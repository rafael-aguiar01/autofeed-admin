import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";
import Illustration from "@/assets/images/auth/ad5a73a0-1be0-4d69-9b60-b7e70d5d45d8.png";

const login = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            {/* <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" className="mb-10" />
            </Link> */}
            {/* <h4>
            Inovação, Eficiência, 
              <span className="text-slate-800 dark:text-slate-400 font-bold">
               Crescimento.
              </span>
            </h4> */}
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full z-[-1]">
            <img
              src={Illustration}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center items-center">
              <div className="logo-container text-center mb-6">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto mb-4"
                  />
                </Link>
              </div>
              <div className="text-center mb-4">
                {/* <h4 className="font-medium">Entre</h4> */}
                <div className="text-slate-500 text-base">
                  Entre em sua conta
                </div>
              </div>
              <LoginForm />
              <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                {/* <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div> */}
              </div>
              {/* <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div> */}
              {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                Não tem conta? {" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Registre
                </Link>
              </div> */}
            </div>
            <div className="auth-footer text-center">
              Copyright 2026, Wh4 Sistemas Todos os direitos.
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default login;
