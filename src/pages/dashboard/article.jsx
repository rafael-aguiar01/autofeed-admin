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
    voiceId: ""
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
      // O payload envia o videoFolder idêntico ao username automaticamente
      const payload = {
        username: accountData.username.trim(),
        name: accountData.name,
        igAccount: accountData.igAccount,
        igToken: accountData.igToken,
        fbAccount: accountData.fbAccount,
        fbToken: accountData.fbToken,
        voiceId: accountData.voiceId || null,
        videoFolder: accountData.username.trim() // 🌟 Sempre igual ao username
      };

      await createAccount({ account: payload, token: tokenFromLocalStorage }).unwrap();
      toast.success("Conta do Instagram cadastrada com sucesso!");
      
      // Reseta os campos após o sucesso
      reset();
      setAccountData({
        username: "",
        name: "",
        igAccount: "",
        igToken: "",
        fbAccount: "",
        fbToken: "",
        voiceId: ""
      });

    } catch (error) {
      console.error("Falha ao cadastrar a conta:", error);
      toast.error(error?.data?.error || "Erro ao cadastrar a conta do Instagram.");
    }
  };

  return (
    <div>
      {/* Card Superior */}
      <Card>
        <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 place-content-center">
          <div className="flex space-x-4 h-full items-center rtl:space-x-reverse">
            <div className="flex-none">
              <div className="h-20 w-20 rounded-full">
                <img src={userAvatar} alt="" className="w-full h-full" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium mb-2">
                <span className="block">Autofeed Engine</span>
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-2">
                Gerencie e provisione novas automações de Reels por perfil.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Card do Formulário de Cadastro */}
      <Card title="Cadastrar Perfil do Instagram">
        <form onSubmit={handleSubmit(handleSubmitAccount)}>
          <div className="space-y-4">
            
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
                placeholder="Ex: apoio_adeildo (Define também a pasta de vídeos)"
                register={register}
                onChange={handleInputChange}
                value={accountData.username}
              />
            </div>

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
                placeholder="ID numérico da página do Facebook vinculada"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              
              {/* Box Informativo para deixar claro visualmente */}
              <div className="flex flex-col justify-end pb-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 italic block">
                  ℹ️ A pasta de assets/vídeos em background será vinculada automaticamente como: 
                  <strong className="text-blue-500 ml-1">
                    {accountData.username ? `src/shared/assets/videos/${accountData.username.trim()}` : "(Aguardando username)"}
                  </strong>
                </span>
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