import React from "react";
import Modal from "@/components/ui/Modal";

const ListCitiesModal = ({ isOpen, onClose, cities }) => {
  return (
    <Modal activeModal={isOpen} onClose={onClose} title="Cidades Vinculadas">
      <div className="space-y-4">
        {cities && cities.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {cities.map((city) => (
                <li key={city.id} className="py-2 text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{city.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    city.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {city.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">
            Nenhuma cidade vinculada a esta região.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ListCitiesModal;