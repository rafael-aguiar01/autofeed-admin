import React, { useState, useMemo } from "react";
import { useFetchArticlesQuery } from "../../../store/api/article/articleApiSlice";
import { useGenerateScriptMutation, useSaveScriptMutation } from "../../../store/api/script/scriptApiSlice";
import { useGenerateAudioMutation } from "../../../store/api/audio/audioApiSlice"
import { useSendAudioMutation } from "../../../store/api/whatsapp/whatsappApiSlice"
import AudioPlayer from "@/components/ui/AudioPlayer";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import GlobalFilter from "./GlobalFilter";
import Button from "@/components/ui/Button";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

const COLUMNS = [
  { Header: "Id", accessor: "id" },
  { Header: "Título", accessor: "title" },
  { Header: "Categoria", accessor: "cate" },
  { Header: "Data", accessor: "created_at" },
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

const GenerateScript = ({ title = "Lista de notícias", token, tenant }) => {
  const { data: articles, error, isLoading } = useFetchArticlesQuery(tenant, {
    skip: !tenant
  });
  
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState('');
  
  const [generateScript, { isLoading: isGenerating, isSuccess, isError }] = useGenerateScriptMutation();
  const [generateAudio, { isLoading: isGeneratingAudio }] = useGenerateAudioMutation();
  const [sendAudio] = useSendAudioMutation();

  const handleScriptChange = (event) => {
    setGeneratedScript(event.target.value);
  };

  const todayString = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const filteredData = useMemo(() => {
    return articles?.articles?.filter(article => {
      const articleDate = article.created_at.split('T')[0];
      return articleDate === todayString || articleDate === yesterdayString;
    }) || [];
  }, [articles?.articles, todayString, yesterdayString]);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, [filteredData]);

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
            <div><IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} /></div>
          ),
          Cell: ({ row }) => (
            <div><IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /></div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const { globalFilter } = state;

  const generateScriptExecute = () => {
    setIsGeneratingScript(true);
    const selectedIds = selectedFlatRows.map((row) => row.original.id);
    generateScript({ ids: selectedIds, token })
      .then(response => {
        console.log('Script generated successfully:', response.data);
        setGeneratedScript(response.data);
      })
      .catch(error => {
        console.error('Error generating script:', error);
      })
      .finally(() => {
        setIsGeneratingScript(false);
      });
  };

  const handleGenerateAudio = () => {
    generateAudio({ script: generatedScript, token })
      .then(response => {
        console.log('Audio generated successfully:', response.data);
        setGeneratedAudio(response.data);
      })
      .catch(error => {
        console.error('Error generating audio:', error);
      });
  };

  const handleSendAudio = () => {
    if (generatedAudio) {
      sendAudio({ 
        audioUrl: generatedAudio, 
        citySlug: tenant, // 3. Enviamos o tenant para a API do WhatsApp
        token 
      })
        .then(response => {
          console.log('Audio sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending audio:', error);
        });
    } else {
      console.log('No audio URL available to send');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching articles</div>;

  return (
    <>
      <Card>
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
        
        {/* ... Lógica de Paginação (Mantida igual ao seu original) ... */}
        <div className="pagination flex items-center space-x-2 mt-4">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
          <span>
            Página <strong>{state.pageIndex + 1} de {pageOptions.length}</strong>
          </span>
          <select className="btn-dark p-1 rounded"
            value={state.pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>Show {pageSize}</option>
            ))}
          </select>
        </div>

        <Card className="mt-6">
          <div className="space-y-5">
            <Button onClick={generateScriptExecute} className="btn-dark">
              GERAR SCRIPT
            </Button>
            {isGeneratingScript && <Button text="Carregando..." className="btn-dark" isLoading />}
          </div>
        </Card>

        <div className="mt-6">
          <Textarea
            label="Script Gerado"
            id="pn4"
            placeholder=""
            value={generatedScript}
            onChange={handleScriptChange}
          />
        </div>

        <div className="space-y-4 mt-6">
          <Card>
            <div className="flex space-x-5">
              {generatedScript && (
                <>
                  <Button onClick={handleGenerateAudio} className="btn-dark">
                    {isGeneratingAudio ? "Gerando Áudio..." : "Gerar Áudio"}
                  </Button>
                  {generatedAudio && (
                    <>
                      <AudioPlayer url={generatedAudio} />
                      <Button onClick={handleSendAudio} className="btn-dark">
                        Enviar WhatsApp
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
};

export default GenerateScript;


