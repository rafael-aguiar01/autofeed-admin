import React from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useUpdateMacroRegionMutation } from "@/store/api/portal/macroRegionSlice"; // Ajuste o import conforme seu projeto

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "disable", label: "Inativo" },
];

const EditMacroRegionModal = ({ isOpen, onClose, data, token }) => {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: data.name,
      instagramUsername: data.instagram_username,
      igAccount: data.ig_account,
      igKey: data.ig_key,
      status: statusOptions.find(opt => opt.value === data.status) || statusOptions[0]
    }
  });

  const [updateMacroRegion, { isLoading }] = useUpdateMacroRegionMutation();

  const onSubmit = async (formData) => {
    const payload = {
      id: data.id,
      name: formData.name,
      instagramUsername: formData.instagramUsername,
      igAccount: formData.igAccount,
      igKey: formData.igKey,
      status: formData.status.value
    };

    try {
      await updateMacroRegion({
        id: data.id,
        macroRegion: payload,
        token: token 
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar região:", err);
    }
  };

  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Editar Macro Região">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          label="Nome da Região"
          name="name"
          register={register}
          placeholder="Ex: Região Macro Capital"
        />
        <Textinput
          label="Instagram Username"
          name="instagramUsername"
          register={register}
          placeholder="demanhanoticias"
        />
        <Textinput
          label="Conta IG (ID)"
          name="igAccount"
          register={register}
        />
        <Textinput
          label="Chave (Token Meta)"
          name="igKey"
          register={register}
        />

        <label className="form-label">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={statusOptions}
              className="react-select"
              classNamePrefix="select"
            />
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button text="Cancelar" className="btn-light" onClick={onClose} />
          <Button type="submit" text={isLoading ? "Salvando..." : "Salvar"} className="btn-dark" isLoading={isLoading} />
        </div>
      </form>
    </Modal>
  );
};

export default EditMacroRegionModal;