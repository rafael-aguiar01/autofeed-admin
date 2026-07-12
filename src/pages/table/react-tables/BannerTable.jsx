import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import GlobalFilter from "./GlobalFilter";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import EditLayoutModal from "@/pages/portals/modal/EditLayoutModal";
import EditBannerModal from "@/pages/portals/modal/EditBannerModal";
import { useFetchBannersQuery } from "@/store/api/portal/bannerSlice";
import AddBannerModal from "@/pages/portals/modal/AddBannerModal";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const COLUMNS = [
  {
    Header: "Posição",
    accessor: "position",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Imagem",
    accessor: "imageUrl",
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
    Header: "Ações",
    accessor: "action",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Editar componente" placement="top" arrow animation="shift-away">
            <button
              className="action-btn"
              type="button"
              onClick={() => {
              }}
            >
              <Icon icon="heroicons:pencil" />
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

const BannerTable = ({ title = "Banner", tenant, token }) => {
  const { data: banner, isLoading: isLoadingLayout } = useFetchBannersQuery(
    { tenant, token },
    { skip: !tenant || !token }
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleEdit = (componentData) => {
    setSelectedComponent(componentData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
  };

  const columns = useMemo(() => {
    return [
      { Header: "Posição", accessor: "position" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Imagem",
        accessor: "image_url",
        Cell: ({ row }) => (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
            <img
              src={row.original.image_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ),
      },
      {
        Header: "Ações",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip content="Editar banner" placement="top" arrow>
              <button
                className="action-btn"
                type="button"
                onClick={() => handleEdit(row.original)}
              >
                <Icon icon="heroicons:pencil" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ];
  }, []);
  const data = useMemo(() => (banner ? banner : []), [banner]);

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


  if (isLoadingLayout) return <div>Loading...</div>;

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <Button text="Novo Banner" className="btn-dark" onClick={() => setIsAddModalOpen(true)} />
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
      </Card>
      {isModalOpen && selectedComponent && (
        <EditBannerModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          data={selectedComponent}
          token={token}
          onAIComplete={(response) => {
          }}
        />
      )}

      {isAddModalOpen && (
        <AddBannerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          token={token}
          tenant={tenant}
          onComplete={() => { }}
        />
      )}
    </>
  );
};

export default BannerTable;


