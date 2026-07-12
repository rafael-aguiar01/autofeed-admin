import React, { useState, useMemo } from "react";
import { useFetchScriptsQuery } from "../../../store/api/script/scriptApiSlice";
import {useGenerateAudioMutation} from "../../../store/api/audio/audioApiSlice";
import AudioPlayer from "@/components/ui/AudioPlayer"; 
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
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
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Script",
    accessor: "script",
    Cell: ({ value }) => value.length > 20 ? `${value.substring(0, 20)}...` : value,
  },
  {
    Header: "Data",
    accessor: "created_at",
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


const GenerateAudio = ({ title = "Lista de Scripts" }) => {
  const { data: scripts, error, isLoading } = useFetchScriptsQuery();
  const [generatedAudio, setGeneratedAudio] = useState('');
  const [generateAudio, { isLoading: isGenerating, isSuccess, isError }] = useGenerateAudioMutation();
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // const handleAudioChange = (event) => {
  //   setGeneratedAudio(event.target.value);
  // };

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => scripts || [], [scripts]);

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

  const generateAudioExecute = () => {
    setIsGeneratingAudio(true);
    const selectedScripts = selectedFlatRows.map(row => {
        const script = scripts.find(script => script.id === row.original.id);
        return script ? script.script : null; 
    }).filter(script => script != null); 

    if (selectedScripts.length > 0) {
        generateAudio({ script: selectedScripts[0] }) 
        .then(response => {
            console.log('Audio generated successfully:', response.data);
            setGeneratedAudio(response.data.audioUrl);
        })
        .catch(error => {
            console.error('Error generating audio:', error);
        })
        .finally(() => {
            setIsGeneratingAudio(false);
        });
    } else {
        console.error('No script selected or found.');
        setIsGeneratingAudio(false);
    }
};


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching scripts</div>;

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
          <select
            value={state.pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {/* {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
            ))} */}
          </select>
        </div>
        <Card>
          <div className="space-xy-5">
            <Button onClick={generateAudioExecute} className="btn-dark">
              GERAR AUDIO
            </Button>
            {isGeneratingAudio && <Button text="Carregando..." className="btn-dark" isLoading />}
          </div>
        </Card>
        <AudioPlayer url={generatedAudio} />
      </Card>
    </>
  );
};

export default GenerateAudio;


