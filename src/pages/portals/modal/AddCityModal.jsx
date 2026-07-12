import React from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
// Importe o hook de mutação para adicionar cidade (ajuste o caminho conforme seu projeto)
import { useAddCityMutation } from "@/store/api/portal/macroRegionSlice";

const AddCityModal = ({ isOpen, onClose, macroRegionId, token }) => {
  // const { register, handleSubmit, reset } = useForm();
  // const [addCity, { isLoading }] = useAddCityMutation();

  // const onSubmit = async (data) => {
  //   try {
  //     const cityData = {
  //       citySlug: data.slug,
  //       macroRegionId: macroRegionId
  //     };

  //     await addCity({ cityData, token }).unwrap();
  //     reset();
  //     onClose();
  //   } catch (err) {
  //     console.error("Erro ao adicionar cidade:", err);
  //     alert("Erro ao adicionar cidade.");
  //   }
  // };

  // return (
  //   <Modal activeModal={isOpen} onClose={onClose} title="Adicionar Nova Cidade">
  //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

  //       {/* ID da região (exibido apenas para confirmação, poderia ser um hidden field) */}
  //       <div className="text-xs text-slate-500 mb-2">
  //         Macro Região ID: <span className="font-mono">{macroRegionId}</span>
  //       </div>

  //       <Textinput
  //         label="Slug (URL)"
  //         name="slug"
  //         id="slug"
  //         register={register}
  //         placeholder="Ex: jundiai"
  //         required
  //       />

  //       <div className="flex justify-end space-x-3 pt-4">
  //         <Button text="Cancelar" className="btn-light" onClick={onClose} />
  //         <Button
  //           type="submit"
  //           text={isLoading ? "Adicionando..." : "Adicionar Cidade"}
  //           className="btn-dark"
  //           isLoading={isLoading}
  //         />
  //       </div>
  //     </form>
  //   </Modal>
  // );
};

export default AddCityModal;