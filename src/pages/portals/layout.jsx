import React from "react";
import Card from "@/components/ui/Card";
import LayoutTable from "../table/react-tables/LayoutTable";

const LayoutConfig = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const portalIdFromLocalStorage = localStorage.getItem("portalId")
  
  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return;
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card noborder>
            <LayoutTable token= { tokenFromLocalStorage } portalId={portalIdFromLocalStorage} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LayoutConfig;