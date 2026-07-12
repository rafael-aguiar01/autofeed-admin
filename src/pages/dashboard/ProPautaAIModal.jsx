import React, { useState } from "react";

import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "react-select";
import Button from "@/components/ui/Button";
import { useForm, Controller } from 'react-hook-form';
import { usePautaproaiMutation } from "../../store/api/jornalix/jornalixAIApiSlice"; 

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const tonsOptions = [
  { value: 'critico', label: 'Crítico' },
  { value: 'didatico', label: 'Didático' },
  { value: 'emotivo', label: 'Emotivo' },
  { value: 'formal', label: 'Formal' },
  { value: 'humoristico', label: 'Humorístico/Satírico' },
  { value: 'informativo', label: 'Informativo' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'neutro', label: 'Neutro' },
  { value: 'otimista', label: 'Otimista' },
  { value: 'pessimista', label: 'Pessimista' },
  { value: 'sensacionalista', label: 'Sensacionalista' }
];

const ProPautaAIModal = ({ isOpen, onClose, onAIComplete, token  }) => {
  const { control, register, handleSubmit, reset } = useForm();
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [jornalix] = usePautaproaiMutation();

  const onSubmit = async (data) => {
    try {
      setIsGeneratingArticle(true);
      const returnAPI = await jornalix( {data, token } ).unwrap();
      setIsGeneratingArticle(false);
      onAIComplete(returnAPI);
      reset();
      onClose();
    } catch (err) {
      console.error("Erro ao enviar os dados: ", err);
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Journalix - Gerador de Notícias">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label htmlFor=" hh2" className="form-label ">
              Tons da notícia
            </label>
            <Controller
              name="newsTone"
              control={control}
              render={({ field }) => (
                <Select
                {...field}
                value={selectedOption}
                options={tonsOptions}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : '');
                  setSelectedOption(selectedOption); 
                }}
                  id="newsTone"
                />
              )}
            />
        <Textinput
          label="Título do Evento/Acontecimento"
          placeholder="Forneça um título curto ou descrição do evento."
          name="eventTitle"
          id="eventTitle"
          register={register}
        />
        <Textarea
          label="Resumo"
          placeholder="Resumo do Evento"
          name="summary"
          id="summary"
          register={register}
        />
        <Textinput
          label="Pontos chave"
          placeholder="Pontos chaves"
          name="keyPoints"
          id="keyPoints"
          register={register}
        />
        <Textinput
          label="Personagens Envolvidos"
          placeholder="Nomes, idades, ocupações, características relevantes."
          name="charactersInvolved"
          id="charactersInvolved"
          register={register}
        />
        <Textarea
          label="Citações/Declarações"
          placeholder="Adicione declarações fictícias de pessoas envolvidas ou autoridades."
          name="quotesStatements"
          id="quotesStatements"
          register={register}
        />
        <Textarea
          label="Fontes"
          placeholder="Nomes de fontes de onde as informações são originadas."
          name="sources"
          id="sources"
          register={register}
        />
        <Button type="submit" text="Gerar Notícia" className="btn-dark" />
        {isGeneratingArticle && <Button text="Carregando..." className="btn-dark" isLoading />}
      </form>
    </Modal>
  );
};

export default ProPautaAIModal;
