import React from "react";
import Card from "@/components/ui/Card";
import MacroRegionTable from "../table/react-tables/MacroRegionTable";

const MacroRegionConfig = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  
  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card noborder>
            <MacroRegionTable token={tokenFromLocalStorage} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MacroRegionConfig;