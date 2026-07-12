import React, { useState, useMemo, useCallback } from "react";
import Card from "@/components/ui/Card";
import GlobalFilter from "./GlobalFilter";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

import { useFetchMacroRegionsQuery } from "@/store/api/portal/macroRegionSlice";
import ListCitiesModal from "@/pages/portals/modal/ListCitiesModal";
import EditMacroRegionModal from "@/pages/portals/modal/EditMacroRegionModal";
import AddCityModal from "@/pages/portals/modal/AddCityModal";


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
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

const MacroRegionTable = ({ title = "Macro Regiões", token }) => {
  const { data: macroRegions, isLoading } = useFetchMacroRegionsQuery(token, {
    skip: !token
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [isListCitiesModalOpen, setIsListCitiesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // const handleEdit = (componentData) => {
  //   setSelectedComponent(componentData);
  //   setIsModalOpen(true);
  // };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
  };

  const handleOpenCitiesList = useCallback((region) => {
    setSelectedRegion(region);
    setIsListCitiesModalOpen(true);
  }, []);

  const handleEdit = useCallback((region) => {
    setSelectedRegion(region);
    setIsEditModalOpen(true);
  }, []);

  const handleAddCity = useCallback((region) => {
    setSelectedRegion(region);
    setIsAddCityModalOpen(true);
  }, []);

  const handleCloseAllModals = () => {
    setIsListCitiesModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddCityModalOpen(false);
    setSelectedRegion(null);
  };

  const columns = useMemo(() => {
    return [
      { Header: "Nome da Região", accessor: "name" },
      {
        Header: "Instagram",
        accessor: "instagramUsername",
        Cell: ({ cell: { value } }) => <span className="font-semibold text-slate-700 dark:text-slate-300">@{value}</span>
      },
      { Header: "Conta IG", accessor: "igAccount" },
      {
        Header: "Chave (Token)",
        accessor: "igKey",
        Cell: ({ cell: { value } }) => <div className="max-w-[150px] truncate text-slate-500" title={value}>{value}</div>
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {value === "active" ? "Ativo" : "Inativo"}
          </span>
        )
      },
      {
        Header: "Cidades",
        accessor: "cities",
        Cell: ({ row }) => (
          <button
            onClick={() => handleOpenCitiesList(row.original)} // AGORA ISSO VAI FUNCIONAR
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold hover:underline"
          >
            {row.original.cities?.length || 0}
          </button>
        ),
      },
      {
        Header: "Ações",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-3">
            <Tooltip content="Editar Região">
              <button onClick={() => handleEdit(row.original)} className="action-btn"><Icon icon="heroicons:pencil" /></button>
            </Tooltip>
            <Tooltip content="Adicionar Cidade">
              <button onClick={() => handleAddCity(row.original)} className="action-btn text-green-600"><Icon icon="heroicons:plus" /></button>
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [handleOpenCitiesList, handleEdit, handleAddCity]);
  const data = useMemo(() => (macroRegions ? macroRegions : []), [macroRegions]);
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

  if (isLoading) return <div className="p-6 text-center">Carregando regiões...</div>;

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title text-slate-900 dark:text-white">{title}</h4>
          <GlobalFilter filter={state.globalFilter} setFilter={setGlobalFilter} />
        </div>
        <div className="overflow-x-auto">
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
        </div>

        {/* Paginação */}
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
              <option key={pageSize} value={pageSize}>Mostrar {pageSize}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Modal Listar Cidades */}
      {isListCitiesModalOpen && selectedRegion && (
        <ListCitiesModal
          isOpen={isListCitiesModalOpen}
          onClose={handleCloseAllModals}
          cities={selectedRegion.cities}
        />
      )}

      {/* Modal Editar Macro Região */}
      {isEditModalOpen && selectedRegion && (
        <EditMacroRegionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseAllModals}
          data={selectedRegion}
          token={token}
        />
      )}

      {/* Modal Adicionar Cidade */}
      {isAddCityModalOpen && selectedRegion && (
        <AddCityModal
          isOpen={isAddCityModalOpen}
          onClose={handleCloseAllModals}
          accountId={selectedRegion.id}
          token={token}
        />
      )}

    </>
  );
};

export default MacroRegionTable;