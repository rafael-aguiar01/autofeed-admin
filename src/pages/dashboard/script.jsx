import React from "react";
import { useForm } from 'react-hook-form';
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import SelectMonth from "@/components/partials/SelectMonth";
import GenerateScript from "../table/react-tables/GenerateScript";
import { useRegisterManualPostMutation } from "../../store/api/script/scriptApiSlice";
import { toast } from "react-toastify";

const Script = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const tenantFromLocalStorage = localStorage.getItem("adminTenant") || "global";
  const instagramIdFromLocalStorage = localStorage.getItem("adminTenantId");

  const [registerTopic, { isLoading }] = useRegisterManualPostMutation();
  
  // 🌟 Padrão oficial do seu projeto usando react-hook-form
  const { register, handleSubmit, reset } = useForm();

  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return null; 
  }

  // O React Hook Form passa os dados preenchidos direto no parâmetro da função
  const handleSubmitTopic = async (data) => {
    if (!instagramIdFromLocalStorage) {
      toast.error("Selecione um perfil do Instagram no topo antes de cadastrar!");
      return;
    }

    if (!data.title?.trim() || !data.content?.trim()) {
      toast.error("Preencha o título e o conteúdo do tópico.");
      return;
    }

    try {
      const payload = {
        title: data.title.trim(),
        content: data.content.trim(),
        status: "Pending",
        instagramId: instagramIdFromLocalStorage
      };

      await registerTopic({ body: payload, token: tokenFromLocalStorage }).unwrap();
      toast.success("Tópico cadastrado com sucesso!");

      // Limpa os inputs do formulário usando a função nativa do useForm
      reset();
      
      window.location.reload();

    } catch (error) {
      console.error("Erro ao cadastrar tópico:", error);
      toast.error(error?.data?.error || "Erro ao salvar o tópico.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Formulário de Cadastro de Novo Tópico */}
      <Card title="Cadastrar Novo Tópico para Reels">
        <form onSubmit={handleSubmit(handleSubmitTopic)} className="space-y-4">
          
          <Textinput
            label="Título do Tópico (Fique atento, pois isso vira gancho)"
            name="title"
            id="title"
            type="text"
            placeholder="Ex: Prefeitura realiza melhorias no sistema de iluminação pública com tecnologia LED"
            register={register} // 🚀 Passando o register nativo do useForm exatamente igual ao Article
          />

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Conteúdo/Matéria Base da Notícia
            </label>
            <textarea
              name="content"
              id="content"
              rows="5"
              className="form-control py-20"
              placeholder="Cole aqui o texto completo ou fatos da notícia para a IA criar a narração..."
              {...register("content")} // 🚀 Registra a textarea nativa dentro do ecossistema do useForm
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "14px"
              }}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              text={isLoading ? "Salvando..." : "Salvar Tópico"}
              className="btn-dark"
              isLoading={isLoading}
            />
          </div>
        </form>
      </Card>
      

      {/* Tabela de Gerenciamento Existente */}
      {/* <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card headerslot={<SelectMonth />} noborder>
            <GenerateScript 
              token={tokenFromLocalStorage} 
              tenant={tenantFromLocalStorage} 
            />
          </Card>
        </div>
      </div> */}
    </div>
  );
};

export default Script;