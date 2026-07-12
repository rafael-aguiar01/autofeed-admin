import React from "react";
import { Link } from "react-router-dom";
import Social from "./common/social";
import ForgotPass from "./common/forgot-pass";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
// image import
// import bgImage from "@/assets/images/all-img/bg-page2.png";
// import LogoWhite from "@/assets/images/logo/logofundopreto.png";
// import Logo from "@/assets/images/logo/logofundobranco.png";
const login3 = () => {
  const [isDark] = useDarkMode();
  return (
    <div
      className="loginwrapper bg-cover bg-no-repeat bg-center"
      // style={{
      //   backgroundImage: `url(${bgImage})`,
      // }}
    >
      <div className="lg-inner-column">
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className="auth-box2 p-0 bg-white"
            style={{
              width: "15%",
              borderRadius: "20px 20px 0px 0px"
            }}
          >
          </div>

          <div className="auth-box2 bg-white"
            style={{
              borderRadius: "20px 20px 20px 20px"
            }}
          >
            {/* <img
              src={isDark ? LogoWhite : Logo}
              alt=""
              className="mx-auto p-0"

            /> */}
            <div className="mobile-logo text-center mb-6 lg:hidden block">
              <Link to="/">
                {/* <img
                  src={isDark ? LogoWhite : Logo}
                  alt=""
                  className="mx-auto"
                /> */}
              </Link>
            </div>
            <div className="text-center 2xl:mb-10 mb-5">
              <h4 className="font-medium mb-4">Esqueceu sua Senha</h4>
              <div className="text-slate-500 dark:text-slate-400 text-base">
              Entre com seu e-mail para gerar uma nova senha
              </div>
            </div>
            {/* <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-slate-600 rounded py-3 mb-4 mt-10">
            </div> */}


            <ForgotPass />
            {/* <div className="mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 uppercase text-sm text-center">
              Não está cadastrado?
              <br></br>
              <Link
                to="/register"
                className="text-primary-501 font-medium hover:underline"
              >
                CADASTRAR
              </Link>
            </div> */}
          </div>
        </div>
        <div className="auth-footer3 text-white py-5 px-5 text-sm w-full text-center">
          Desenvolvido por WH4 Sistemas
        </div>
      </div>
    </div>
  );
};

export default login3;