import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm } from 'react-hook-form'; // Controller removido pois não estava a ser usado
import { useUploadImageMutation } from "@/store/api/article/articleApiSlice";
import Fileinput from "@/components/ui/Fileinput";
import { useCreateBannerMutation } from "@/store/api/portal/bannerSlice";

const AddBannerModal = ({ isOpen, onClose, tenant, token, onComplete }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [createBanner] = useCreateBannerMutation();
  const [uploadImage] = useUploadImageMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const onSubmit = async (formData) => {
    // Tratamento para garantir que a data está no formato correto (adicionando segundos e o Z)
    let formattedDate = formData.expiresDate;
    if (formattedDate) {
      // Se vier do input datetime-local (ex: "2027-01-31T23:59"), converte para ISO completo
      const dateObj = new Date(formattedDate);
      formattedDate = dateObj.toISOString(); 
    }

    const banner = {
      position: formData.position || "top-banner",
      status: formData.status || "active",
      expiresDate: formattedDate, // Usando a data formatada
      imageUrl: uploadedImageUrl,
      citySlug: tenant, // Enviando o tenant como citySlug
    };

    try {
      setIsSaving(true);
      await createBanner({ banner, token }).unwrap();
      onComplete();
      reset();
      setUploadedImageUrl(null); // Limpa a imagem para o próximo cadastro
      onClose();
    } catch (err) {
      console.error("Erro ao cadastrar banner: ", err);
      alert("Erro ao cadastrar banner. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await uploadImage({ formData, token }).unwrap();
        setUploadedImageUrl(response.imageUrl);
      } catch (error) {
        console.error('Erro no upload:', error);
      }
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Cadastrar Novo Banner">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput label="Posição" name="position" register={register} defaultValue="top-banner" />
        <Textinput label="Status" name="status" register={register} defaultValue="active" />
        <Textinput label="Data de Expiração" name="expiresDate" type="datetime-local" register={register} required />
        <Fileinput label="Imagem do Banner" name="imageUrl" onChange={handleFileChange} />

        {uploadedImageUrl && (
          <img src={uploadedImageUrl} className="h-20 w-auto rounded" alt="Preview" />
        )}

        <Button type="submit" text={isSaving ? "Salvando..." : "Cadastrar"} className="btn-dark" isLoading={isSaving} />
      </form>
    </Modal>
  );
};

export default AddBannerModal;