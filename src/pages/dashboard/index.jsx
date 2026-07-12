import React, { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import HomeBredCurbs from "./HomeBredCurbs";
import GlobalFilter from "../table/react-tables/GlobalFilter"; // Ajuste o caminho se necessário
import EditAccountModal from "@/pages/portals/modal/EditAccountModal"; // Se você usar um modal específico para contas, troque o import aqui

// Hook que busca a lista de instagrans/perfis do seu backend
import { useFetchCitiesQuery } from "@/store/api/portal/bannerSlice";

import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

// Configuração das colunas para exibir os metadados do Perfil do Instagram
const COLUMNS = [
  {
    Header: "Nome da Campanha",
    accessor: "name",
    Cell: ({ cell: { value } }) => <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>,
  },
  {
    Header: "Instagram Username",
    accessor: "username",
    Cell: ({ cell: { value } }) => <span className="text-blue-500">@{value}</span>,
  },
  {
    Header: "Voice ID (ElevenLabs)",
    accessor: "voiceId",
    Cell: ({ cell: { value } }) => <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{value || "Padrão"}</span>,
  },
  {
    Header: "Pasta de Vídeos",
    accessor: "videoFolder",
    Cell: ({ cell: { value } }) => <span className="text-xs text-slate-500 dark:text-slate-400">{value || "-"}</span>,
  },
  {
    Header: "Criado Em",
    accessor: "created_at",
    Cell: ({ cell: { value } }) => value ? new Date(value).toLocaleDateString("pt-BR") : "-",
  },
  {
    Header: "Ações",
    accessor: "action",
  },
];

const Dashboard = () => {
  const tokenFromLocalStorage = localStorage.getItem("token") || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Busca a lista de contas usando o RTK Query do seu portal
  const { data: accountsData, isLoading, error, refetch } = useFetchCitiesQuery(tokenFromLocalStorage, {
    skip: !tokenFromLocalStorage,
  });

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    refetch(); // Atualiza a lista após fechar o modal de edição
  };

  const columns = useMemo(() => {
    return [
      ...COLUMNS.map((col) => {
        if (col.accessor === "action") {
          return {
            ...col,
            Cell: ({ row }) => (
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content="Editar Conta do Instagram" placement="top" arrow animation="shift-away">
                  <button
                    className="action-btn text-slate-600 hover:text-blue-600 transition-colors"
                    type="button"
                    onClick={() => handleEditAccount(row.original)}
                  >
                    <Icon icon="heroicons:pencil" className="w-5 h-5" />
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

  const data = useMemo(() => accountsData || [], [accountsData]);

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
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter } = state;

  if (isLoading) return <div className="p-6 text-center">Carregating perfis do Instagram...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Erro ao carregar os perfis.</div>;

  return (
    <div>
      <HomeBredCurbs title="Gerenciamento de Contas" />

      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card title="Contas do Instagram Ativas">

            {/* Filtro Global da Tabela no Topo */}
            <div className="flex justify-end mb-4">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50">{'<<'}</button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50">{'<'}</button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50">{'>'}</button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50">{'>>'}</button>
              <span>
                Página <strong>{state.pageIndex + 1} de {pageOptions.length}</strong>
              </span>
              <select
                className="btn-dark p-1 rounded text-xs ms-2"
                value={state.pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>Ver {pageSize}</option>
                ))}
              </select>
            </div>

          </Card>
        </div>
      </div>

      {/* Modal de Edição da Conta */}
      {/* No seu Dashboard.jsx, garanta que a montagem esteja assim controlada: */}
      {isModalOpen && selectedAccount && (
        <EditAccountModal
          isOpen={Boolean(isModalOpen && selectedAccount)}
          onClose={handleModalClose}
          data={selectedAccount}
          token={tokenFromLocalStorage}
        />
      )}
    </div>
  );
};

export default Dashboard;