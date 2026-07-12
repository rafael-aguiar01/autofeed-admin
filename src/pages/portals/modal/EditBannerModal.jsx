import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm, Controller } from 'react-hook-form';
import { useUploadImageMutation } from "@/store/api/article/articleApiSlice";
import Fileinput from "@/components/ui/Fileinput";
import { useUpdateBannerMutation } from "@/store/api/portal/bannerSlice";


const EditBannerModal = ({ isOpen, onClose, data, token, onAIComplete }) => {
  const { control, register, handleSubmit, reset } = useForm();
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [updateBanner] = useUpdateBannerMutation();
  const [uploadImage] = useUploadImageMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const onSubmit = async (formData) => {
    const banner = {
      ...formData,
      id: Number(data.id),
      imageUrl: uploadedImageUrl
    };
    try {
      setIsGeneratingArticle(true);
      const returnAPI = await updateBanner({ banner, token }).unwrap();
      setIsGeneratingArticle(false);
      onAIComplete(returnAPI);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao enviar os dados: ", err);
    }
  };

  const handleFileChange2 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await uploadImage({ formData, token }).unwrap();
        setUploadedImageUrl(response.imageUrl);
      } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
      }
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Editar Banner">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          label="Link"
          name="href"
          id="href"
          register={register}
        />
        <label htmlFor="imageUrl" className="form-label">
          Banner
        </label>
        <div className="input-group">
          <Fileinput
            type="file"
            className="form-control"
            name="imageUrl"
            onChange={handleFileChange2}
          />

          {/* Lógica de exibição da miniatura */}
          {(uploadedImageUrl || data?.imageUrl) && (
            <div className="mt-4">
              <span className="text-xs text-slate-500 mb-2 block">
                {uploadedImageUrl ? "Nova imagem carregada:" : "Imagem atual:"}
              </span>
              <img
                src={uploadedImageUrl || data?.imageUrl}
                alt="Banner preview"
                className="h-32 w-auto object-cover rounded border border-slate-200 shadow-sm"
              />
            </div>
          )}
        </div>
        <Button type="submit" text="Salvar" className="btn-dark" />
        {isGeneratingArticle && <Button text="Carregando..." className="btn-dark" isLoading />}
      </form>
    </Modal>
  );
};

export default EditBannerModal;
