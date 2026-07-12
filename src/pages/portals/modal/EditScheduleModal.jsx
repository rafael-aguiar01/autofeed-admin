import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal"; // Ajuste o caminho se necessário
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useUpdateScheduleMutation } from "@/store/api/instagram/instagramApiSlice";


const formatToInputDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 16);
};

const EditScheduleModal = ({ isOpen, onClose, data, token }) => {
  const [updateSchedule, { isLoading, isSuccess, error }] = useUpdateScheduleMutation();
  
  // Estados para o formulário
  const [formData, setFormData] = useState({
    content: "",
    appointment: "",
    status: "",
    type: "",
  });

  // Quando o modal abre ou a "data" muda, preenchemos o formulário
  useEffect(() => {
    if (data) {
      setFormData({
        content: data.content || "",
        appointment: formatToInputDate(data.appointment),
        status: data.status || "Pendente",
        type: data.type || "Instagram",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Converte a data de volta para ISO (UTC) para mandar pro banco
      const dateForAPI = new Date(formData.appointment).toISOString();
      console.log(formData)

      await updateSchedule({
        id: data.id,
        token: token,
        data: {
          ...formData,
          appointment: dateForAPI,
        },
      }).unwrap();
      
      // Se deu certo, fecha o modal
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err);
    }
  };

  return (
    <Modal
      activeModal={isOpen}
      onClose={onClose}
      title={`Editar Agendamento #${data?.id}`}
      centered
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="danger">Erro ao salvar as alterações.</Alert>}

        <div>
          <label className="block text-sm font-medium mb-1">Tipo da Rede</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data e Hora do Agendamento</label>
          <input
            type="datetime-local"
            name="appointment"
            value={formData.appointment}
            onChange={handleChange}
            required
            className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Conteúdo do Post</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            required
            className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="Pending">Pendente</option>
            <option value="Executado">Executado</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button text="Cancelar" className="bg-slate-200 text-slate-800" onClick={onClose} disabled={isLoading} />
          <Button
            type="submit"
            text={isLoading ? "Salvando..." : "Salvar Alterações"}
            className="btn-primary"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditScheduleModal;