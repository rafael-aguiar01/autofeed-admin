"use client";

import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useFetchCitiesQuery } from "@/store/api/portal/bannerSlice";

const City = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";

  // O hook busca a lista de instagrans/perfis do seu backend
  const { data: instagramData, isLoading } = useFetchCitiesQuery(token, {
    skip: !token,
  });

  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (instagramData && instagramData.length > 0) {
      setAccounts(instagramData);

      // Busca qual perfil estava ativo anteriormente no localStorage pelo username
      const savedTenant = localStorage.getItem("adminTenant");
      
      if (savedTenant) {
        const foundAccount = instagramData.find((acc) => acc.username === savedTenant);
        setSelected(foundAccount || instagramData[0]);
      } else {
        // Se for o primeiro acesso, assume a primeira conta retornada
        const defaultAccount = instagramData[0];
        setSelected(defaultAccount);
        
        // Alimenta o storage com as novas chaves do ecossistema do autofeed
        localStorage.setItem("adminTenant", defaultAccount.username);
        localStorage.setItem("adminTenantId", defaultAccount.id);
        localStorage.setItem("adminVideoFolder", defaultAccount.videoFolder || "");
        localStorage.setItem("adminVoiceId", defaultAccount.voiceId || "");
      }
    }
  }, [instagramData]);

  const handleAccountChange = (account) => {
    setSelected(account);
    
    // Atualiza o bloco de chaves de contexto no localStorage
    localStorage.setItem("adminTenant", account.username);
    localStorage.setItem("adminTenantId", account.id); 
    localStorage.setItem("adminVideoFolder", account.videoFolder || ""); 
    localStorage.setItem("adminVoiceId", account.voiceId || "");
    
    // Recarrega a página para aplicar a alteração em todas as queries e telas
    window.location.reload(); 
  };

  if (isLoading || !selected) {
    return <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>;
  }

  return (
    <div>
      <Listbox value={selected} onChange={handleAccountChange}>
        <div className="relative z-[22]">
          <Listbox.Button className="relative w-full flex items-center cursor-pointer space-x-[6px] px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span className="text-slate-600 dark:text-slate-300">
              <MapPinIcon className="w-5 h-5 text-green-500" />
            </span>
            <span className="text-sm md:block hidden font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
              {selected.name}
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute right-0 w-64 max-h-60 overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 mt-2 shadow-lg py-1">
              {accounts.map((item) => (
                <Listbox.Option key={item.id} value={item} as={Fragment}>
                  {({ active }) => (
                    <li
                      className={`
                        w-full px-4 py-2.5 cursor-pointer flex flex-col justify-start transition-colors
                        ${active ? "bg-slate-50 dark:bg-slate-700/50" : ""}
                        ${selected.id === item.id ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`${selected.id === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}>
                          <MapPinIcon className="w-5 h-5" />
                        </span>
                        <span className={`flex-1 text-sm ${selected.id === item.id ? "font-semibold text-blue-600 dark:text-blue-400" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 pl-8" style={{ marginTop: '-2px' }}>
                        @{item.username}
                      </span>
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default City;