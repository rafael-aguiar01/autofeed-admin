import React, { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import GlobalFilter from "../table/react-tables/GlobalFilter"; // Ajuste o caminho se necessário
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";

// Reutilizando os hooks de mutação e query do seu slice de scripts/tópicos
import {
  useFetchScriptsQuery,
  useGenerateScriptMutation
} from "../../store/api/script/scriptApiSlice";

const COLUMNS = [
  { Header: "Id", accessor: "id" },
  { Header: "Título", accessor: "title" },
  { Header: "Status", accessor: "status" },
  { Header: "Data Criada", accessor: "created_at" },
];

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, checked, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        checked={checked}
        {...rest}
        className="table-checkbox"
      />
    );
  }
);
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const Instagram = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const tenantFromLocalStorage = localStorage.getItem("adminTenant") || "global";
  const instagramIdFromLocalStorage = localStorage.getItem("adminTenantId");

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  // Hook unificado para disparar a geração de mídias do Autofeed
  const [generateMedia] = useGenerateScriptMutation();

  // Busca todos os tópicos cadastrados
  // No seu Instagram.jsx, altere a chamada da query para isto:
  const { data: topicsData, error, isLoading, refetch } = useFetchScriptsQuery(
    { accountId: instagramIdFromLocalStorage, token: tokenFromLocalStorage },
    { skip: !tokenFromLocalStorage || !instagramIdFromLocalStorage }
  );

  // Com isso, você pode até remover o .filter() manual que tinha feito antes, 
  // pois a API já vai trazer os tópicos filtrados direto do banco!
  const filteredData = useMemo(() => {
    return topicsData || [];
  }, [topicsData]);
  const columns = useMemo(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
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
      data: filteredData,
      stateReducer: (state, action) => {
        // Garante comportamento de rádio (apenas 1 tópico selecionado por vez)
        if (action.type === 'toggleRowSelected') {
          return {
            ...state,
            selectedRowIds: {
              [action.id]: action.value
            }
          };
        }
        return state;
      }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => [
        {
          id: "selection",
          Header: () => <div className="text-center">Selecionar</div>,
          Cell: ({ row }) => (
            <div className="text-center">
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps({
                  onChange: () => {
                    const selected = row.isSelected;
                    row.toggleRowSelected(!selected);
                  }
                })}
              />
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

  // Função central que gerencia o disparo das 3 mídias com base no tipo clicado
  const handleExecuteGeneration = async (mediaType) => {
    if (selectedFlatRows.length === 0) {
      toast.warning("Selecione um tópico na tabela antes de gerar!");
      return;
    }

    if (!instagramIdFromLocalStorage) {
      toast.error("Nenhum perfil do Instagram selecionado no cabeçalho.");
      return;
    }

    const selectedTopic = selectedFlatRows[0].original;

    // Converte a data selecionada no Flatpickr para string ISO (formato UTC universal)
    const formattedDate = appointmentDate ? appointmentDate.toISOString() : new Date().toISOString();

    const payload = {
      accountId: instagramIdFromLocalStorage,
      topicId: selectedTopic.id,
      type: mediaType,
      appointment: formattedDate
    };

    try {
      setIsProcessing(true);

      // Passa a estrutura estruturada para o hook generateScript mutar
      await generateMedia({ ids: payload, token: tokenFromLocalStorage }).unwrap();

      toast.success(`${mediaType} agendado/gerado com sucesso!`);
      refetch(); // Atualiza a listagem local
    } catch (err) {
      console.error(`Erro ao gerar ${mediaType}:`, err);
      toast.error(err?.data?.error || `Falha ao processar a geração do tipo ${mediaType}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="p-6 text-center">Carregando tópicos da conta...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Erro ao buscar os tópicos.</div>;

  return (
    <div className="space-y-5">
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title text-slate-900 dark:text-white">Fila de Tópicos do Perfil</h4>
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

        {/* Lógica de Paginação */}
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

        {/* Bloco de Agendamento e Ações de Disparo */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            {/* Seletor de Data e Hora usando o Flatpickr */}
            <div className="flex flex-col space-y-2 col-span-1">
              <label className="form-label font-medium text-slate-700 dark:text-slate-300">
                Data e Hora da Publicação/Agendamento
              </label>
              <Flatpickr
                value={appointmentDate}
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                  time_24hr: true
                }}
                className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg text-sm w-full"
                onChange={(date) => setAppointmentDate(date[0])}
              />
            </div>

            {/* Ações Combinadas */}
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button
                onClick={() => handleExecuteGeneration("Reels")} 
                className="btn-dark flex-1 min-w-[120px]"
                disabled={isProcessing}
              >
                Gerar Reels
              </Button>
              <Button
                onClick={() => handleExecuteGeneration("Carrossel")}
                className="btn-dark flex-1 min-w-[120px]"
                disabled={true}
              >
                Gerar Carrossel
              </Button>

              <Button
                onClick={() => handleExecuteGeneration("Post Estatico")}
                className="btn-dark flex-1 min-w-[120px]"
                disabled={true}
              >
                Gerar Post Estático
              </Button>
            </div>

          </div>

          {isProcessing && (
            <div className="mt-4 text-xs text-blue-500 animate-pulse text-right">
              ⚙️ Processando comando de criação do post inteligente na fila da IA...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Instagram;