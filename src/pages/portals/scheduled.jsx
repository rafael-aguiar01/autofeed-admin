import React, { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import GlobalFilter from "../table/react-tables/GlobalFilter"; // Ajuste o caminho se necessário
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import EditScheduleModal from "@/pages/portals/modal/EditScheduleModal"; // Ajuste o caminho se necessário

import {
  useFetchScheduleByDateQuery,
  useRegisterManualPostMutation
} from "@/store/api/script/scriptApiSlice";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const COLUMNS = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Tipo",
    accessor: "type",
  },
  {
    Header: "Conteúdo / Tópico",
    accessor: "topic.title",
    Cell: ({ cell: { value } }) => (
      <div className="max-w-[280px] truncate font-medium text-slate-700 dark:text-slate-200" title={value || "Sem título"}>
        {value || "-"}
      </div>
    ),
  },
  {
    Header: "Agendado Para",
    accessor: "appointment",
    Cell: ({ cell: { value } }) => formatDateTime(value),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ cell: { value } }) => {
      const isExecuted = value === "Executado";
      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${isExecuted
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
            }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    Header: "Criado Em",
    accessor: "created_at",
    Cell: ({ cell: { value } }) => formatDateTime(value),
  },
  {
    Header: "Ações",
    accessor: "action",
  },
];

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="table-checkbox"
      />
    );
  }
);
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const BannerConfig = ({ title = "Agendamentos" }) => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const instagramIdFromLocalStorage = localStorage.getItem("adminTenantId");

  // console.log('oi: ', instagramIdFromLocalStorage)

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Consome a rota do back filtrando por ID do Instagram e Data selecionada
  const { data: pendings, error, isLoading, isFetching } = useFetchScheduleByDateQuery(
    {
      accountId: instagramIdFromLocalStorage,
      date: selectedDate,
      token: tokenFromLocalStorage
    },
    { skip: !tokenFromLocalStorage || !instagramIdFromLocalStorage }
  );

  const [registerManual, { isLoading: isRegistering }] = useRegisterManualPostMutation();

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
      ...COLUMNS.map((col) => {
        if (col.accessor === "action") {
          return {
            ...col,
            Cell: ({ row }) => (
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content="Editar agendamento" placement="top" arrow animation="shift-away">
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
          };
        }
        return col;
      }),
    ];
  }, []);

  const data = useMemo(() => (pendings ? pendings : []), [pendings]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 30 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => [
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
        ...cols,
      ]);
    }
  );

  const { globalFilter } = state;

  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return null;
  }

  // const handleManualPost = async () => {
  //   try {
  //     await registerManual({
  //       token: tokenFromLocalStorage,
  //       body: {
  //         date: selectedDate,
  //         action: "manual_post",
  //         accountId: instagramIdFromLocalStorage
  //       }
  //     }).unwrap();

  //     alert("Postagem manual registrada com sucesso!");
  //   } catch (err) {
  //     console.error("Erro ao registrar postagem manual:", err);
  //     alert("Erro ao registrar. Tente novamente.");
  //   }
  // };

  if (isLoading) return <div className="p-6 text-center">Carregando agendamentos do perfil...</div>;
  if (error) return <div className="p-6"><Alert type="danger">Erro ao carregar a fila de agendamentos.</Alert></div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card noborder>
            <div className="md:flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h4 className="card-title text-slate-900 dark:text-white">{title}</h4>
                {isFetching && <span className="text-xs text-blue-500 font-normal animate-pulse">Atualizando...</span>}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                {/* <Button
                  text="Postagem Manual"
                  className="bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900"
                  onClick={handleManualPost}
                  isLoading={isRegistering}
                  icon="heroicons:plus"
                /> */}

                <div className="flex items-center space-x-2">
                  <label htmlFor="dateFilter" className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    Filtrar data:
                  </label>
                  <input
                    type="date"
                    id="dateFilter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-control block w-full px-3 py-2 text-sm font-normal text-slate-700 bg-white bg-clip-padding border border-slate-300 rounded transition ease-in-out focus:text-slate-700 focus:bg-white focus:border-primary-500 focus:outline-none dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  />
                </div>

                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table {...getTableProps()} className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  {headerGroups.map((headerGroup, i) => (
                    <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, j) => (
                        <th
                          key={j}
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
                        >
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
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr key={i} {...row.getRowProps()}>
                        {row.cells.map((cell, j) => (
                          <td
                            key={j}
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação da Tabela */}
            <div className="pagination flex items-center space-x-2 mt-4 text-sm">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-2 py-1 bg-slate-100 rounded disabled:opacity-50">{'<<'}</button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-2 py-1 bg-slate-100 rounded disabled:opacity-50">{'<'}</button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="px-2 py-1 bg-slate-100 rounded disabled:opacity-50">{'>'}</button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-2 py-1 bg-slate-100 rounded disabled:opacity-50">{'>>'}</button>
              <span>
                Página <strong>{state.pageIndex + 1} de {pageOptions.length}</strong>
              </span>
              <select
                className="btn-dark p-1 rounded text-xs"
                value={state.pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>Ver {pageSize}</option>
                ))}
              </select>
            </div>
          </Card>
        </div>
      </div>

      {isModalOpen && selectedComponent && (
        <EditScheduleModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          data={selectedComponent}
          token={tokenFromLocalStorage}
        />
      )}
    </div>
  );
};

export default BannerConfig;