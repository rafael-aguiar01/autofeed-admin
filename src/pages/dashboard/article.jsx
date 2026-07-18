import React, { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import userAvatar from "@/assets/images/all-img/main-user.png";
// Substitua pelo slice correto de contas que você tiver criado no seu RTK Query
import { useCreateAccountMutation } from "../../store/api/instagram/instagramApiSlice"; 
import { toast } from "react-toastify";

const Article = () => {
  const [accountData, setAccountData] = useState({
    username: "",
    name: "",
    igAccount: "",
    igToken: "",
    fbAccount: "",
    fbToken: "",
    voiceId: "",
    // Novos campos adicionados com valores padrão recomendados
    fontName: "ArchivoBlack-Regular.ttf",
    boxColor: "#1E5A22",
    positionManchete: "top",
    positionCredits: "bottom",
    promptManchete: "",
    promptLegenda: "",
    promptReels: "",
    postModel: 1
  });
  
  const [createAccount, { isLoading }] = useCreateAccountMutation();
  const { register, handleSubmit, reset } = useForm();
  
  const tokenFromLocalStorage = localStorage.getItem("token");

  if (!tokenFromLocalStorage) {
    console.error("Token de autenticação não encontrado.");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitAccount = async () => {
    try {
      const payload = {
        username: accountData.username.trim(),
        name: accountData.name,
        igAccount: accountData.igAccount,
        igToken: accountData.igToken,
        fbAccount: accountData.fbAccount,
        fbToken: accountData.fbToken,
        voiceId: accountData.voiceId || null,
        videoFolder: accountData.username.trim(), // Sempre igual ao username
        
        // Novos campos mapeados para a API
        fontName: accountData.fontName,
        boxColor: accountData.boxColor,
        positionManchete: accountData.positionManchete,
        positionCredits: accountData.positionCredits,
        promptManchete: accountData.promptManchete,
        promptLegenda: accountData.promptLegenda,
        promptReels: accountData.promptReels,
        postModel: Number(accountData.postModel)
      };

      await createAccount({ account: payload, token: tokenFromLocalStorage }).unwrap();
      toast.success("Conta do Instagram cadastrada com sucesso!");
      
      reset();
      setAccountData({
        username: "",
        name: "",
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
        postModel: 1
      });

    } catch (error) {
      console.error("Falha ao cadastrar a conta:", error);
      toast.error(error?.data?.error || "Erro ao cadastrar a conta do Instagram.");
    }
  };

  return (
    <div>
      <Card title="Cadastrar Perfil do Instagram">
        <form onSubmit={handleSubmit(handleSubmitAccount)}>
          <div className="space-y-4">
            
            {/* Bloco 1: Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textinput
                label="Nome do Perfil/Campanha"
                name="name"
                id="name"
                type="text"
                placeholder="Ex: Apoio Adeildo - Campo Limpo Paulista"
                register={register}
                onChange={handleInputChange}
                value={accountData.name}
              />
              <Textinput
                label="Username do Instagram (Sem @)"
                name="username"
                id="username"
                type="text"
                placeholder="Ex: apoio_adeildo"
                register={register}
                onChange={handleInputChange}
                value={accountData.username}
              />
            </div>

            {/* Bloco 2: Tokens Sociais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Textinput
                label="Instagram Account ID (API)"
                name="igAccount"
                id="igAccount"
                type="text"
                placeholder="ID numérico da conta do Instagram"
                register={register}
                onChange={handleInputChange}
                value={accountData.igAccount}
              />
              <Textinput
                label="Instagram Graph Token"
                name="igToken"
                id="igToken"
                type="text"
                placeholder="Token permanente do Instagram"
                register={register}
                onChange={handleInputChange}
                value={accountData.igToken}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Textinput
                label="Facebook Page ID (API)"
                name="fbAccount"
                id="fbAccount"
                type="text"
                placeholder="ID numérico da página do Facebook"
                register={register}
                onChange={handleInputChange}
                value={accountData.fbAccount}
              />
              <Textinput
                label="Facebook User Token"
                name="fbToken"
                id="fbToken"
                type="text"
                placeholder="Token de acesso do Facebook"
                register={register}
                onChange={handleInputChange}
                value={accountData.fbToken}
              />
            </div>

            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            <h5 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Configurações de Áudio e Vídeo (FFmpeg)</h5>

            {/* Bloco 3: Configurações de Design e Áudio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Textinput
                label="Voice ID (ElevenLabs)"
                name="voiceId"
                id="voiceId"
                type="text"
                placeholder="Ex: y9CNRBALdlEecGD3RnmT"
                register={register}
                onChange={handleInputChange}
                value={accountData.voiceId}
              />
              <Textinput
                label="Fonte do Texto"
                name="fontName"
                id="fontName"
                type="text"
                placeholder="Ex: ArchivoBlack-Regular.ttf"
                register={register}
                onChange={handleInputChange}
                value={accountData.fontName}
              />
              <Textinput
                label="Modelo de Post (Estático)"
                name="postModel"
                id="postModel"
                type="number"
                placeholder="Ex: 1"
                register={register}
                onChange={handleInputChange}
                value={accountData.postModel}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Color Picker Visual */}
              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Cor da Caixa do Texto</label>
                <div className="flex space-x-2 items-center">
                  <input 
                    type="color" 
                    name="boxColor" 
                    value={accountData.boxColor} 
                    onChange={handleInputChange} 
                    className="h-10 w-10 border-0 rounded cursor-pointer bg-transparent" 
                  />
                  <input 
                    type="text" 
                    name="boxColor" 
                    value={accountData.boxColor} 
                    onChange={handleInputChange} 
                    className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 rounded-lg text-sm flex-1" 
                    placeholder="#1E5A22" 
                  />
                </div>
              </div>

              {/* Seletor de Posição da Manchete */}
              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Posição da Manchete</label>
                <select 
                  name="positionManchete" 
                  value={accountData.positionManchete} 
                  onChange={handleInputChange} 
                  className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg text-sm w-full"
                >
                  <option value="top">Topo (Top)</option>
                  <option value="bottom">Rodapé (Bottom)</option>
                </select>
              </div>

              {/* Seletor de Posição dos Créditos */}
              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Posição dos Créditos</label>
                <select 
                  name="positionCredits" 
                  value={accountData.positionCredits} 
                  onChange={handleInputChange} 
                  className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg text-sm w-full"
                >
                  <option value="top">Topo (Top)</option>
                  <option value="bottom">Rodapé (Bottom)</option>
                </select>
              </div>
            </div>

            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            <h5 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Prompts da Inteligência Artificial</h5>

            {/* Bloco 4: Textareas para os Prompts (Expansíveis) */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Prompt do Roteiro (Reels)</label>
                <textarea 
                  name="promptReels" 
                  value={accountData.promptReels} 
                  onChange={handleInputChange} 
                  className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 rounded-lg text-sm w-full resize-y min-h-[100px]" 
                  placeholder="Escreva um roteiro narrado de 30 a 45 segundos..."
                ></textarea>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Prompt da Manchete</label>
                <textarea 
                  name="promptManchete" 
                  value={accountData.promptManchete} 
                  onChange={handleInputChange} 
                  className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 rounded-lg text-sm w-full resize-y min-h-[80px]" 
                  placeholder="Crie uma manchete curta e impactante baseada no texto..."
                ></textarea>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="form-label font-medium text-slate-700 dark:text-slate-300">Prompt da Legenda</label>
                <textarea 
                  name="promptLegenda" 
                  value={accountData.promptLegenda} 
                  onChange={handleInputChange} 
                  className="form-control bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 rounded-lg text-sm w-full resize-y min-h-[80px]" 
                  placeholder="Crie uma legenda engajadora para o Instagram sobre este tema..."
                ></textarea>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                text={isLoading ? "Cadastrando..." : "Cadastrar Perfil"} 
                className="btn-dark" 
                isLoading={isLoading} 
              />
            </div>

          </div>
        </form>
      </Card>
    </div>
  );
};

export default Article;