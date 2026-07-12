import React, { useState } from "react";

import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm, Controller } from 'react-hook-form';
import { useCreateAuthorMutation } from "../../store/api/portal/authorSlice"; 

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const AuthorModal = ({ isOpen, onClose, token, portalId, onAIComplete  }) => {
  const { control, register, handleSubmit, reset } = useForm();
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [createAuthor] = useCreateAuthorMutation();

  const onSubmit = async (data) => {
    try {
      const formData  = {
        ...data, 
        avatar: 'https://services.meteored.com/img/article/inteligencia-artificial-aprende-a-reconstruir-imagens-vistas-por-pessoas-ciencia-fotos-1679175318563_1280.jpg',
        portalId: portalId.toString()
      }
      setIsGeneratingArticle(true);
      await createAuthor( {formData, token} ).unwrap();
      setIsGeneratingArticle(false);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao enviar os dados: ", err);
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Criar autor">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          label="Nome"
          name="name"
          id="name"
          register={register}
        />
        <Textinput
          label="E-mail"
          name="email"
          id="email"
          register={register}
        />
        <Textinput
          label="Senha"
          name="password"
          id="password"
          register={register}
        />
        <Button type="submit" text="Salvar" className="btn-dark" />
        {isGeneratingArticle && <Button text="Carregando..." className="btn-dark" isLoading />}
      </form>
    </Modal>
  );
};

export default AuthorModal;
