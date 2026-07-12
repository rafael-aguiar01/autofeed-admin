import React, { useState, useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import { Modal, Input } from "antd";
import UserAvatar from "@/assets/images/all-img/user.png";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "@/store/api/auth/authApiSlice";

const profileLabel = () => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          {/* <img
            src={UserAvatar}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          /> */}
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        {/* <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          Tester
        </span> */}
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState();
  const [changePassword] = useChangePasswordMutation()
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    };
    const userFromLocalStorage = loadUserFromLocalStorage();
    if (userFromLocalStorage) {
      setEmail(userFromLocalStorage.email);

    } else {
      navigate("/");
    }
  }, []);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (newPassword !== confirmPassword) {
      message.error("As novas senhas não coincidem.");
      return;
    }

    try {
      await changePassword({ userData: { email, password, newPassword } }).unwrap();
      toast.success("Senha alterada com sucesso.");
      setIsModalVisible(false);
  
    } catch (error) {
      toast.error("Erro ao processar a solicitação. Verifique a senha antiga.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("portalId");
    localStorage.removeItem("user");
    dispatch(logOut());
  };

  const ProfileMenu = [
    // {
    //   label: "Perfil",
    //   icon: "heroicons-outline:user",

    //   action: () => {
    //     navigate("/profile");
    //   },
    // },
    // {
    //   label: "Chat",
    //   icon: "heroicons-outline:chat",
    //   action: () => {
    //     navigate("/chat");
    //   },
    // },
    // {
    //   label: "Email",
    //   icon: "heroicons-outline:mail",
    //   action: () => {
    //     navigate("/email");
    //   },
    // },
    // {
    //   label: "Todo",
    //   icon: "heroicons-outline:clipboard-check",
    //   action: () => {
    //     navigate("/todo");
    //   },
    // },
    // {
    //   label: "Configuração",
    //   icon: "heroicons-outline:cog",
    //   action: () => {
    //     navigate("/settings");
    //   },
    // },
    // {
    //   label: "Price",
    //   icon: "heroicons-outline:credit-card",
    //   action: () => {
    //     navigate("/pricing");
    //   },
    // },
    // {
    //   label: "Faq",
    //   icon: "heroicons-outline:information-circle",
    //   action: () => {
    //     navigate("/faq");
    //   },
    // },
    // {
    //   label: "Alterar Senha",
    //   icon: "heroicons-outline:cog",
    //   action: () => {
    //     dispatch(changePassword);
    //   },
    // },
    {
      label: "Sair",
      icon: "heroicons-outline:login",
      action: () => {
        dispatch(handleLogout);
      },
    },
  ];

  return (
    <>
      <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                onClick={() => item.action()}
                className={`${active
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                    : "text-slate-600 dark:text-slate-300"
                  } block ${item.hasDivider ? "border-t border-slate-100 dark:border-slate-700" : ""}`}
              >
                <div className="block cursor-pointer px-4 py-2">
                  <div className="flex items-center">
                    <span className="block text-xl ltr:mr-3 rtl:ml-3">
                      <Icon icon={item.icon} />
                    </span>
                    <span className="block text-sm">{item.label}</span>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
        {/* New Menu Item for Password Change */}
        <Menu.Item>
          <div onClick={showModal} className="cursor-pointer px-4 py-2 flex items-center">
            <Icon icon="heroicons-outline:key" className="text-xl ltr:mr-3 rtl:ml-3" />
            <span className="block text-sm">Alterar Senha</span>
          </div>
        </Menu.Item>
      </Dropdown>

      {/* Modal for Password Change */}
      <Modal title="Alterar Senha" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
        okButtonProps={{
          type: "primary",
          style: {
            backgroundColor: "#0d1ca0",
            borderColor: "#0d1ca0",     // Optional: Match border color
          },
        }}
      >
        <Input.Password
          placeholder="Senha Antiga"
          value={password}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Input.Password
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Input.Password
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </>
  );
};

export default Profile;
