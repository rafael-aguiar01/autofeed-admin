import React, { useState } from "react";

import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "react-select";
import Button from "@/components/ui/Button";
import { useForm, Controller } from 'react-hook-form';
import { useUpdateLayoutMutation } from "../../../store/api/portal/layoutSlice"

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const filterType = [
  { value: 'visible', label: 'Personalizado' },
  { value: 'Category', label: 'Categoria' },
];

const EditLayoutModal = ({ isOpen, onClose, data, portalId, token, onAIComplete  }) => {
  const { control, register, handleSubmit, reset } = useForm();
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [updateSection] = useUpdateLayoutMutation();

  const onSubmit = async (formData) => {

   const section = {
    ...formData,     
    id: Number(data.id),
    portalId    
    };
    try {
      setIsGeneratingArticle(true);
      const returnAPI = await updateSection({section, token}).unwrap();
      setIsGeneratingArticle(false);
      onAIComplete(returnAPI);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao enviar os dados: ", err);
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Editar seção">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label htmlFor=" hh2" className="form-label ">
              Filtrar por
            </label>
            <Controller
              name="filterType"
              control={control}
              render={({ field }) => (
                <Select
                {...field}
                value={selectedOption}
                options={filterType}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : '');
                  setSelectedOption(selectedOption); 
                }}
                  id="filterType"
                />
              )}
            />
        <Textinput
          label="Conteúdo do filtro"
          placeholder=""
          name="content"
          id="content"
          register={register}
        />
        <Textinput
          label="Primeira Notícia"
          name="startIndex"
          id="startIndex"
          register={register}
        />
        <Textinput
          label="última Notícia"
          name="endIndex"
          id="endIndex"
          register={register}
        />
        <Button type="submit" text="Atualizar Seção" className="btn-dark" />
        {isGeneratingArticle && <Button text="Carregando..." className="btn-dark" isLoading />}
      </form>
    </Modal>
  );
};

export default EditLayoutModal;
