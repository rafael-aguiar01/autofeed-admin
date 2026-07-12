import React, { useState, useMemo } from "react";
import { useFetchArticlesQuery } from "../../../store/api/article/articleApiSlice";
import { useGeneratePostMutation, useGenerateReelsMutation } from "../../../store/api/instagram/instagramApiSlice"
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
  ({ indeterminate, checked, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
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


const PostInstagram = ({ title = "Lista de notícias", tenant }) => {
  const tokenFromLocalStorage = localStorage.getItem("token");

  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return null;
  }
  
  // 2. Busca as notícias usando o tenant
  const { data: articles, error, isLoading } = useFetchArticlesQuery(tenant, {
    skip: !tenant
  });
  
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [generateReels, { isLoading: isGenerating, isSuccess, isError }] = useGenerateReelsMutation();
  const [generatePosts, { isLoading: isGeneratingPosts, isSuccessPosts, isErrorPosts }] = useGeneratePostMutation();

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => articles?.articles || [], [articles]);

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
      data,
      stateReducer: (state, action) => {
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
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: () => <div>Selecionar</div>,
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps({
                  onChange: (e) => {
                    const selected = row.isSelected;
                    row.toggleRowSelected(!selected);
                  }
                })}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  
  const { globalFilter } = state;

  const generateReelsExecute = () => {
    setIsGeneratingPost(true);
    const slug = String(selectedFlatRows.map((row) => row.original.slug));
    const model = 4;
    // 3. Enviando o 'tenant' no lugar do portalId
    generateReels({ slug, model, tenant, token: tokenFromLocalStorage })
      .then(response => {
        console.log('Post generated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error generating post:', error);
      })
      .finally(() => {
        setIsGeneratingPost(false);
      });
  };

  const generatePostExecute = () => {
    setIsGeneratingPost(true);
    const slug = String(selectedFlatRows.map((row) => row.original.slug));
    // 4. Enviando o 'tenant' no lugar do portalId
    generatePosts({ slug, tenant, token: tokenFromLocalStorage })
      .then(response => {
        console.log('Post generated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error generating post:', error);
      })
      .finally(() => {
        setIsGeneratingPost(false);
      });
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
        
        {/* Lógica de Paginação da Tabela */}
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
        
        <Card className="mt-6">
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <Button onClick={generateReelsExecute} className="btn-dark">
                Publicar Reels
              </Button>
              {isGeneratingPost && <Button text="Carregando..." className="btn-dark" isLoading />}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={generatePostExecute} className="btn-dark">
                Publicar Posts
              </Button>
              {isGeneratingPost && <Button text="Carregando..." className="btn-dark" isLoading />}
            </div>
          </div>
        </Card>
      </Card>
    </>
  );
};

export default PostInstagram;