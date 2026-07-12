import React, { useState } from "react";
import TextinputRegister from "@/components/ui/TextinputRegister";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useSendCodeMutation,
  useVerifyCodeMutation,
  useChangePasswordMutation
} from "../../../store/api/auth/authApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
  })
  .required();

  const ForgotPass = () => {
    const [sendCode, { isLoading, isError, error }] = useSendCodeMutation();
    const [verifyCode, { isLoading: isVerifying, isError: isVerifyError, error: verifyError }] = useVerifyCodeMutation();
    const [resetPassword, { isLoading: isResetting }] = useChangePasswordMutation();
  
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [showPasswordInputs, setShowPasswordInputs] = useState(false);
    const [code, setCode] = useState("");
    const [emailRecovery, setEmailRecovery] = useState("");
    const [resetFormData, setResetFormData] = useState({
      newPassword: '',
      confirmPassword: '',
    });
    const navigate = useNavigate();
    const {
      register,
      formState: { errors },
      handleSubmit,
      getValues,
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    const handleSendCode = async (e) => {
      e.preventDefault();
      const data = getValues();
      try {
        console.log(data.email)
        await sendCode({ email: data.email }).unwrap();
        setEmailRecovery(data.email);
        setShowCodeInput(true);
      } catch (error) {
        toast.error(error?.data?.message || "Erro ao enviar e-mail.");
      }
    };
  
    const handleVerifyCode = async (e) => {
      e.preventDefault();
      try {
        const isValid = await verifyCode({ email: emailRecovery, code }).unwrap();
        if (isValid) {
          setShowPasswordInputs(true);
        } else {
          toast.error(verifyError?.data?.message || "Código inválido.");
        }
      } catch (error) {
        toast.error("Erro ao verificar código.");
      }
    };
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      if (resetFormData.newPassword !== resetFormData.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }
      try {
        await resetPassword({
          userData: {
            email: emailRecovery,
            newPassword: resetFormData.newPassword,
          }
        }).unwrap();
        toast.success("Senha alterada");
        navigate("/");
      } catch (error) {
        toast.error(error?.data?.message || "Erro ao redefinir senha.");
      }
    };
  
    return (
      <form className="space-y-4">
        {!showCodeInput && !showPasswordInputs && (
          <>
            <TextinputRegister
              name="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email}
              className="h-[48px]"
            />
            {isError && <p className="text-red-500">{error?.data?.message || "Erro ao enviar e-mail."}</p>}
            <button
              className="btn btn-dark block w-full bg-primary-501"
              disabled={isLoading}
              onClick={handleSendCode}
            >
              {isLoading ? "Enviando..." : "Recuperar Senha"}
            </button>
          </>
        )}
  
        {showCodeInput && !showPasswordInputs && (
          <>
            <p>Digite o código enviado em seu email</p>
            <TextinputRegister
              name="code"
              label="Código"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-[48px]"
            />
            {isVerifyError && <p className="text-red-500">{verifyError?.data?.message || "Erro ao verificar código."}</p>}
            <button
              className="btn btn-dark block w-full bg-primary-501"
              disabled={isVerifying}
              onClick={handleVerifyCode}
            >
              {isVerifying ? "Verificando..." : "Verificar Código"}
            </button>
          </>
        )}
  
        {showPasswordInputs && (
          <>
            <p>Crie uma nova senha</p>
            <TextinputRegister
              name="newPassword"
              label="Nova Senha"
              type="password"
              value={resetFormData.newPassword}
              onChange={(e) => setResetFormData({ ...resetFormData, newPassword: e.target.value })}
              className="h-[48px]"
            />
            <p>Confirme a senha</p>
            <TextinputRegister
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              value={resetFormData.confirmPassword}
              onChange={(e) => setResetFormData({ ...resetFormData, confirmPassword: e.target.value })}
              className="h-[48px]"
            />
            {resetFormData.newPassword !== resetFormData.confirmPassword && (
              <p className="text-red-500">As senhas não coincidem.</p>
            )}
            <button
              className="btn btn-dark block w-full bg-primary-501"
              disabled={isResetting}
              onClick={handleResetPassword}
            >
              {isResetting ? "Salvando..." : "Salvar Nova Senha"}
            </button>
          </>
        )}
      </form>
    );
  };
  
  export default ForgotPass;