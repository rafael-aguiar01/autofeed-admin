import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal"; 
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { toast } from "react-toastify";

// Importe a mutation do seu slice (ajuste o caminho se necessário)
import { useUpdateAccountMutation } from "@/store/api/instagram/instagramApiSlice"; 

const EditAccountModal = ({ isOpen, onClose, data, token }) => {
  const [updateAccount, { isLoading, error }] = useUpdateAccountMutation();
  
  // 1. Controle de estado nativo com TODOS os novos campos incluídos
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    igAccount: "",
    igToken: "",
    fbAccount: "",
    fbToken: "",
    voiceId: "",
    fontName: "ArchivoBlack-Regular.ttf",
    boxColor: "#1E5A22",
    positionManchete: "top",
    positionCredits: "bottom",
    promptManchete: "",
    promptLegenda: "",
    promptReels: "",
    postModel: 1,
    // --- NOVOS CAMPOS ---
    carouselModels: "11, 12, 13",
    carouselTextsPrompt: "",
    promptTextPost: ""
  });

  // 2. Preenche o formulário quando o modal abre (Sincronização correta do backend para os campos)
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
        fontName: data.fontName || "ArchivoBlack-Regular.ttf",
        boxColor: data.boxColor || "#1E5A22",
        positionManchete: data.positionManchete || "top",
        positionCredits: data.positionCredits || "bottom",
        promptManchete: data.promptManchete || "",
        promptLegenda: data.promptLegenda || "",
        promptReels: data.promptReels || "",
        postModel: data.postModel !== undefined ? data.postModel : 1,
        
        // --- TRATAMENTO DOS NOVOS CAMPOS ---
        // Se vier array do banco [11,12,13], transforma na string "11, 12, 13" para o input
        carouselModels: data.carouselModels && Array.isArray(data.carouselModels) 
          ? data.carouselModels.join(", ") 
          : "11, 12, 13",
        carouselTextsPrompt: data.carouselTextsPrompt || "",
        promptTextPost: data.promptTextPost || ""
      });
    }
  }, [data]);

  // 3. Gerencia a digitação nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Salva no backend com o payload estendido completo
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
        
        // Mapeamento dos campos de design e prompts
        fontName: formData.fontName,
        boxColor: formData.boxColor,
        positionManchete: formData.positionManchete,
        positionCredits: formData.positionCredits,
        promptManchete: formData.promptManchete,
        promptLegenda: formData.promptLegenda,
        promptReels: formData.promptReels,
        postModel: Number(formData.postModel),

        // --- CONVERSÃO REVERSA DOS NOVOS CAMPOS ---
        // Transforma a string do input "11, 12, 13" de volta para array [11, 12, 13]
        carouselModels: formData.carouselModels
          .toString()
          .split(',')
          .map(num => Number(num.trim()))
          .filter(num => !isNaN(num)),
        carouselTextsPrompt: formData.carouselTextsPrompt,
        promptTextPost: formData.promptTextPost
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
      activeModal={isOpen} 
      onClose={onClose}
      title={`Editar Perfil: ${data?.name || ''}`}
      centered
      className="max-w-3xl max-h-[90vh] overflow-y-auto" 
    >
      <form onSubmit={handleSubmit} className="space-y-4 pr-1">
        {error && <Alert type="danger">Erro ao salvar as alterações.</Alert>}

        {/* Bloco 1: Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Perfil/Campanha</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Apoio Adeildo"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
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
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
              required
            />
          </div>
        </div>

        {/* Bloco 2: Tokens Sociais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Account ID (API)</label>
            <input
              type="text"
              name="igAccount"
              value={formData.igAccount}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Graph Token</label>
            <input
              type="text"
              name="igToken"
              value={formData.igToken}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
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
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook User Token</label>
            <input
              type="text"
              name="fbToken"
              value={formData.fbToken}
              onChange={handleChange}
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        <hr className="my-4 border-slate-200 dark:border-slate-700" />
        <h5 className="text-base font-medium text-slate-900 dark:text-white">Configurações de Design e Áudio (FFmpeg)</h5>

        {/* Bloco 3: Parâmetros do Motor de Renderização */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voice ID (ElevenLabs)</label>
            <input
              type="text"
              name="voiceId"
              value={formData.voiceId}
              onChange={handleChange}
              placeholder="ID da Voz"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fonte do Texto</label>
            <input
              type="text"
              name="fontName"
              value={formData.fontName}
              onChange={handleChange}
              placeholder="Ex: ArchivoBlack-Regular.ttf"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Modelo de Post (Estático)</label>
            <input
              type="number"
              name="postModel"
              value={formData.postModel}
              onChange={handleChange}
              placeholder="Ex: 1"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Seletor de Cor Hexadecimal Dinâmico */}
          <div>
            <label className="block text-sm font-medium mb-1">Cor da Caixa do Texto</label>
            <div className="flex space-x-2 items-center">
              <input 
                type="color" 
                name="boxColor" 
                value={formData.boxColor} 
                onChange={handleChange} 
                className="h-9 w-9 border-0 rounded cursor-pointer bg-transparent flex-none" 
              />
              <input 
                type="text" 
                name="boxColor" 
                value={formData.boxColor} 
                onChange={handleChange} 
                className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm" 
                placeholder="#1E5A22" 
              />
            </div>
          </div>

          {/* Seletor Dropdown para Posição da Manchete */}
          <div>
            <label className="block text-sm font-medium mb-1">Posição da Manchete</label>
            <select 
              name="positionManchete" 
              value={formData.positionManchete} 
              onChange={handleChange} 
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm bg-white"
            >
              <option value="top">Topo (Top)</option>
              <option value="bottom">Rodapé (Bottom)</option>
            </select>
          </div>

          {/* Seletor Dropdown para Posição dos Créditos */}
          <div>
            <label className="block text-sm font-medium mb-1">Posição dos Créditos</label>
            <select 
              name="positionCredits" 
              value={formData.positionCredits} 
              onChange={handleChange} 
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm bg-white"
            >
              <option value="top">Topo (Top)</option>
              <option value="bottom">Rodapé (Bottom)</option>
            </select>
          </div>
        </div>

        {/* Novo: Modelos do Carrossel (Coloquei abaixo das posições) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Modelos do Carrossel (Capa, Horizontal, Vertical)</label>
            <input
              type="text"
              name="carouselModels"
              value={formData.carouselModels}
              onChange={handleChange}
              placeholder="Ex: 11, 12, 13"
              className="form-control w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        {/* Box Informativo do Diretório */}
        <div className="pb-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 italic block">
            ℹ️ Pasta física vinculada para background: 
            <strong className="text-blue-500 ml-1">
              {formData.username ? `src/shared/assets/videos/${formData.username.trim()}` : "..."}
            </strong>
          </span>
        </div>

        <hr className="my-4 border-slate-200 dark:border-slate-700" />
        <h5 className="text-base font-medium text-slate-900 dark:text-white">Prompts Customizados da IA</h5>

        {/* Bloco 4: Caixas de Texto Expansíveis (Textareas) para Engenharia de Prompt */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Prompt do Roteiro (Reels)</label>
            <textarea 
              name="promptReels" 
              value={formData.promptReels} 
              onChange={handleChange} 
              className="form-control w-full p-2.5 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm resize-y min-h-[90px]" 
              placeholder="Escreva as diretrizes do roteiro narrado pela IA..."
            ></textarea>
          </div>

          {/* Novo: Prompt dos Textos do Carrossel */}
          <div>
            <label className="block text-sm font-medium mb-1">Prompt de Conteúdo (Carrossel)</label>
            <textarea 
              name="carouselTextsPrompt" 
              value={formData.carouselTextsPrompt} 
              onChange={handleChange} 
              className="form-control w-full p-2.5 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm resize-y min-h-[90px]" 
              placeholder="Extraia os 3 pontos mais importantes para um carrossel..."
            ></textarea>
          </div>

          {/* Novo: Prompt de Texto do Post Estático */}
          <div>
            <label className="block text-sm font-medium mb-1">Prompt de Conteúdo (Post Estático Único)</label>
            <textarea 
              name="promptTextPost" 
              value={formData.promptTextPost} 
              onChange={handleChange} 
              className="form-control w-full p-2.5 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm resize-y min-h-[90px]" 
              placeholder="Resuma o artigo em uma frase de impacto para colocar na imagem..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prompt da Manchete (Geral)</label>
            <textarea 
              name="promptManchete" 
              value={formData.promptManchete} 
              onChange={handleChange} 
              className="form-control w-full p-2.5 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm resize-y min-h-[70px]" 
              placeholder="Diretrizes para gerar o título sobreposto no vídeo..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prompt da Legenda (Geral)</label>
            <textarea 
              name="promptLegenda" 
              value={formData.promptLegenda} 
              onChange={handleChange} 
              className="form-control w-full p-2.5 border rounded dark:bg-slate-800 dark:border-slate-700 text-sm resize-y min-h-[70px]" 
              placeholder="Diretrizes de copy, CTAs e hashtags do corpo do post..."
            ></textarea>
          </div>
        </div>

        {/* Botões de Controle */}
        <div className="flex justify-end space-x-3 mt-6 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Button 
            type="button"
            text="Cancelar" 
            className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 text-sm" 
            onClick={onClose} 
            disabled={isLoading} 
          />
          <Button
            type="submit"
            text={isLoading ? "Salvando..." : "Salvar Alterações"}
            className="btn-dark text-sm"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditAccountModal;