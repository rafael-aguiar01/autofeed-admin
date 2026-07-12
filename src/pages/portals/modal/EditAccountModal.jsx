import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal"; 
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { toast } from "react-toastify";

// Importe a mutation do seu slice (ajuste o caminho se necessário)
import { useUpdateAccountMutation } from "@/store/api/instagram/instagramApiSlice"; 

const EditAccountModal = ({ isOpen, onClose, data, token }) => {
  const [updateAccount, { isLoading, error }] = useUpdateAccountMutation();
  
  // 1. Controle de estado nativo idêntico ao do modelo que funciona
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    igAccount: "",
    igToken: "",
    fbAccount: "",
    fbToken: "",
    voiceId: "",
  });

  // 2. Preenche o formulário quando o modal abre
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        username: data.username || "",
        igAccount: data.igAccount || "",
        igToken: data.igToken || "",
        fbAccount: data.fbAccount || "",
        fbToken: data.fbToken || "",
        voiceId: data.voiceId || "",
      });
    }
  }, [data]);

  // 3. Gerencia a digitação nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Salva no backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        username: formData.username.trim(),
        igAccount: formData.igAccount,
        igToken: formData.igToken,
        fbAccount: formData.fbAccount,
        fbToken: formData.fbToken,
        voiceId: formData.voiceId || null,
        videoFolder: formData.username.trim(), // A pasta de vídeo sempre acompanha o username limpo
      };

      await updateAccount({ 
        id: data.id, 
        account: payload, 
        token 
      }).unwrap();
      
      toast.success("Perfil do Instagram atualizado com sucesso!");
      onClose(); // Fecha o modal após sucesso
    } catch (err) {
      console.error("Erro ao atualizar a conta:", err);
      toast.error(err?.data?.error || "Erro ao atualizar os dados.");
    }
  };

  return (
    <Modal
      activeModal={isOpen} // 🚀 O "Pulo do Gato" que o seu template exige para não quebrar o Transition
      onClose={onClose}
      title={`Editar Perfil: ${data?.name || ''}`}
      centered
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="danger">Erro ao salvar as alterações.</Alert>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Perfil/Campanha</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Apoio Adeildo"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username do Instagram (Sem @)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ex: apoio_adeildo"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Account ID (API)</label>
            <input
              type="text"
              name="igAccount"
              value={formData.igAccount}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Graph Token</label>
            <input
              type="text"
              name="igToken"
              value={formData.igToken}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook Page ID (API)</label>
            <input
              type="text"
              name="fbAccount"
              value={formData.fbAccount}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook User Token</label>
            <input
              type="text"
              name="fbToken"
              value={formData.fbToken}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voice ID (ElevenLabs)</label>
            <input
              type="text"
              name="voiceId"
              value={formData.voiceId}
              onChange={handleChange}
              placeholder="Ex: y9CNRBALdlEecGD3RnmT"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          
          <div className="flex flex-col justify-end pb-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 italic block">
              ℹ️ A pasta de assets/vídeos em background será:
              <strong className="text-blue-500 ml-1">
                {formData.username ? `src/shared/assets/videos/${formData.username.trim()}` : "..."}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            type="button"
            text="Cancelar" 
            className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600" 
            onClick={onClose} 
            disabled={isLoading} 
          />
          <Button
            type="submit"
            text={isLoading ? "Salvando..." : "Salvar Alterações"}
            className="btn-dark"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditAccountModal;