import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
const schema = yup
  .object({
    email: yup.string().email("Email inválido").required("Informe seu e-mail"),
    password: yup.string().required("Informe sua senha"),
  })
  .required();
const LoginForm = () => {
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await login({ email: data.email, password: data.password });
      const token = response.data.token;

      const userId = response.data.user.id
      const portalId = response.data.user.portalId

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("portalId", portalId);
    
      if (response.error) {
        throw new Error(response.error.data.error);
      }
    
      if (!response.data.token) {
        throw new Error("Invalid credentials");
      }
    
      dispatch(setUser(response.data.user)); 
      navigate("/dashboard");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Entrando");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        defaultValue=""
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="password"
        type="password"
        defaultValue=""
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <div className="flex justify-between">
        {/* <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Mantenha-me conectado "
        /> */}
        <Link
          to="/forgot-password3"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
           Esqueceu a senha?{" "}
        </Link>
      </div>

      <Button
        type="submit"
        text="Entrar"
        className="btn btn-dark block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
