import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useConnectWhatsappMutation, useFetchConnectionQuery, useDeleteConnectionMutation } from '../../store/api/whatsapp/whatsappApiSlice';
import GroupsTable from "../table/react-tables/GroupsTable";

const Whatsapp = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const portalIdFromLocalStorage = localStorage.getItem("portalId")
  const tenantFromLocalStorage = localStorage.getItem("adminTenant") || "global";

  console.log(tenantFromLocalStorage)


  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return;
  }
  const [connectWhatsapp, { isLoading }] = useConnectWhatsappMutation();
  const { data: connectionStatus, isLoading: isFetchingStatus } = useFetchConnectionQuery({ portalId: tenantFromLocalStorage, token: tokenFromLocalStorage });
  const [deleteConnection, { isLoading: isDeletingStatus }] = useDeleteConnectionMutation();
  const [connection, setConnectionStatus] = useState(null);

  useEffect(() => {
    if (connection && connection.qrcode === "Conectado com sucesso") {
      window.location.reload();
    }
  }, [connection]);

  const generateConnectWhatsapp = async () => {
    try {
      const response = await connectWhatsapp({ portalId: tenantFromLocalStorage, token: tokenFromLocalStorage }).unwrap();
      setConnectionStatus(response);
    } catch (error) {
      console.error("Erro ao conectar o WhatsApp:", error);
      setConnectionStatus({ qrcode: null, error: "Falha ao conectar. Tente novamente." });
    }
  };

  const handleDeleteConnection = async () => {
    try {
      await deleteConnection({ portalId: tenantFromLocalStorage, token: tokenFromLocalStorage }).unwrap();
      window.location.reload()
    } catch (error) {
      console.error("Erro ao remover a conexão:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card noborder>
            {/* Botão para conectar */}
            {isFetchingStatus ? (
              <p>Verificando status...</p>
            ) : connectionStatus === "Conectado" ? (
              <div>
                <p className="text-green-500 font-semibold">Conectado com sucesso!</p>
                <Button onClick={handleDeleteConnection} className="btn-warning" disabled={isDeletingStatus}>
                  {isDeletingStatus ? "Removendo..." : "Remover Conexão"}
                </Button>
              </div>
            ) : (
              <Button onClick={generateConnectWhatsapp} className="btn-dark" disabled={isLoading}>
                {isLoading ? "Conectando..." : "Conectar Whatsapp"}
              </Button>
            )}

            <div className="mt-4">
              {connection && connection.qrcode && (
                typeof connection.qrcode === 'string' && connection.qrcode.startsWith('data:image') ? (
                  <img src={connection.qrcode} alt="QR Code" className="w-48 h-48 mx-auto" />
                ) : (
                  <p className="text-green-500 font-semibold">{connection.qrcode}</p>
                )
              )}
              {connection && connection.error && (
                <p className="text-red-500 font-semibold">{connection.error}</p>
              )}
            </div>
          </Card>
          {connectionStatus === "Conectado" && <Card><GroupsTable citySlug={tenantFromLocalStorage} token={tokenFromLocalStorage} /></Card>}
        </div>
      </div>
    </div>
  );
};

export default Whatsapp;
