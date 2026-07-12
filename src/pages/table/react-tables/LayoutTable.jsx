import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import EditLayoutModal from "@/pages/portals/modal/EditLayoutModal";
import { useFetchLayoutQuery } from "../../../store/api/portal/layoutSlice"

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";


const COLUMNS = [
  {
    Header: "Componente",
    accessor: "component",
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

const LayoutTable = ({ title = "Layout", portalId, token }) => {
  const { data: layout, isLoading: isLoadingLayout } = useFetchLayoutQuery({ portalId, token})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  console.log(layout)

  const handleEdit = (componentData) => {
    setSelectedComponent(componentData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComponent(null);
  };

  // const handleSave = async (updatedData) => {
  //   try {
  //     console.log('oi')
  //     await editComponent(updatedData).unwrap();
  //     alert("Componente atualizado com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao atualizar componente:", error);
  //   }
  // };
  
  const columns = useMemo(() => {
    return [
      ...COLUMNS.map((col) => {
        if (col.accessor === "action") {
          return {
            ...col,
            Cell: ({ row }) => (
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content="Editar componente" placement="top" arrow animation="shift-away">
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
  const data = useMemo(() => (layout ? layout : []), [layout]);

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
          <h4 className="card-title text-slate-900 dark:text-white">{title}</h4>
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
        <EditLayoutModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          token={token}
          portalId={portalId}
          data={selectedComponent}
          onAIComplete={(response) => {
          }}
        />
      )}
    </>
  );
};

export default LayoutTable; 


