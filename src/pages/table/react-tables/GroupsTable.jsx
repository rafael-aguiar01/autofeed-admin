import React, { useMemo } from "react";
import { useFetchGroupsQuery, useSaveGroupMutation } from "../../../store/api/whatsapp/whatsappApiSlice";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { toast } from 'react-toastify';

const actions = [
  {
    name: "Conectar",
    icon: "heroicons-outline:eye",
  },
];

const GroupsTable = ({ citySlug, token }) => {
  const { data: groups, error, isLoading } = useFetchGroupsQuery({ citySlug, token });
  const [saveGroup] = useSaveGroupMutation();
  
  const handleSaveGroup = async (groupId, name) => {
    try {
      await saveGroup({ whatsappGroupId: groupId, name, citySlug, token }).unwrap();
      toast.success('Grupo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o grupo:', error);
      toast.error('Erro ao adicionar o grupo. Tente novamente.');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Nome",
        accessor: "name",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <Dropdown
            classMenuItems="right-0 w-[140px] top-[110%]"
            label={
              <span className="text-xl text-center block w-full">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {actions.map((item, i) => (
                <Menu.Item key={i}>
                  <div
                    className={`${"hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"} w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                    onClick={() => handleSaveGroup(row.original.id, row.original.name)}
                  >
                    <span className="text-base">
                      <Icon icon={item.icon} />
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Dropdown>
        ),
      },
    ],
    [citySlug, token]
  );

  // 🚀 O SEGREDO ESTÁ AQUI: Blindagem do dado
  const data = useMemo(() => {
    if (!groups) return [];
    
    // Se o backend retornou diretamente o array de grupos
    if (Array.isArray(groups)) return groups;
    
    // Se o backend retornou um objeto contendo o array (ex: { groups: [...] })
    if (groups.groups && Array.isArray(groups.groups)) return groups.groups;
    
    // Se for string ("Desconectado") ou qualquer outra coisa inválida, retorna vazio
    return [];
  }, [groups]);

  // Se o backend responder "Desconectado", renderiza um aviso amigável em vez da tabela
  const isDisconnected = typeof groups === 'string' && groups.includes('Desconectado');

  if (isLoading) return <div>Carregando grupos...</div>;
  if (error) return <div>Erro ao buscar os grupos do WhatsApp.</div>;

  // Tela alternativa para WhatsApp desconectado
  if (isDisconnected) {
    return (
      <Card noborder>
        <div className="text-center py-10">
          <Icon icon="heroicons-outline:device-mobile" className="mx-auto text-6xl text-slate-400 mb-4" />
          <h4 className="text-xl font-medium text-slate-600 dark:text-slate-300">WhatsApp Desconectado</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Por favor, conecte a instância lendo o QR Code para listar os grupos disponíveis.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card noborder>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">Lista de Grupos Disponíveis</h4>
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className="border-t border-slate-100 dark:border-slate-800">
                <tr>
                  {columns.map((column) => (
                    <th key={column.accessor} scope="col" className="table-th">
                      {column.Header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {/* 🚀 O map agora é 100% seguro pois "data" é sempre um Array */}
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={row.id || index}>
                      {columns.map((column) => (
                        <td key={column.accessor} className="table-td">
                          {column.accessor !== 'action' ? row[column.accessor] : column.Cell({ row: { original: row } })}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-slate-500">
                      Nenhum grupo encontrado nesta instância.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupsTable;