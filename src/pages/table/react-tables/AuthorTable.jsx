import React, { useState, useMemo } from "react";
import { useFetchAuthorsQuery } from "../../../store/api/portal/authorSlice";
import { useGenerateScriptMutation, useSaveScriptMutation } from "../../../store/api/script/scriptApiSlice";
import { useGenerateAudioMutation } from "../../../store/api/audio/audioApiSlice"
import { useSendAudioMutation } from "../../../store/api/whatsapp/whatsappApiSlice"
import AudioPlayer from "@/components/ui/AudioPlayer";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import GlobalFilter from "./GlobalFilter";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import AuthorModal from "../../configuration/AuthorModal"

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const COLUMNS = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Nome",
    accessor: "name",
  },
  {
    Header: "E-mail",
    accessor: "email",
  },
  {
    Header: "Avatar",
    accessor: "avatar",
    Cell: (row) => {
      return (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={row?.cell?.value}
                alt=""
                className="object-cover w-full h-full rounded-full"
              />
            </span>
          </span>
        </div>
      );
    },
  },
  {
    Header: "Data",
    accessor: "created_at",
  },
  {
    Header: "Ações",
    accessor: "action",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Resetar Senha" placement="top" arrow animation="shift-away">
            <button 
              className="action-btn" 
              type="button"
              onClick={() => {
              }}
              >
              <Icon icon="heroicons:key" />
            </button>
          </Tooltip>
          <Tooltip content="Excluir" placement="top" theme="danger">
            <button
              className="action-btn"
              type="button"
              onClick={() => {
              }}
            >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const AuthorTable = ({ title = "Lista de autores" }) => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const portalIdFromLocalStorage = localStorage.getItem("portalId")
  
  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return;
  }  
  const { data: authors, error, isLoading } = useFetchAuthorsQuery(portalIdFromLocalStorage);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => authors?.authors || [], [authors?.authors]);

    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
    state,
    setGlobalFilter,
    getToggleAllRowsSelectedProps,
    getToggleAllPageRowsSelectedProps,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const { globalFilter } = state;



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching articles</div>;

  return (
    <>
      <Card>
      <Button text="Criar Autor" className="btn-dark" onClick={openModal}/>
      <AuthorModal
                  isOpen={isModalOpen}
                  portalId={portalIdFromLocalStorage}
                  token={tokenFromLocalStorage}
                  onClose={closeModal}
                  onAIComplete={(data) => {
                    closeModal();
                  }}
                />
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title text-slate-900 dark:text-white">{title}</h4>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
        <table {...getTableProps()} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-100 dark:bg-slate-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer">
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Página{' '}
            <strong>
              {state.pageIndex + 1} de {pageOptions.length}
            </strong>{' '}
          </span>
          <select className="btn-dark"
            value={state.pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
        </div>
      </Card>
    </>
  );
};

export default AuthorTable;


