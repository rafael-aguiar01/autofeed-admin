import React from "react";
import Card from "@/components/ui/Card";
import BannerTable from "../table/react-tables/BannerTable";

const BannerConfig = () => {
  const tokenFromLocalStorage = localStorage.getItem("token");
  const tenantFromLocalStorage = localStorage.getItem("adminTenant") || "global";
  
  if (!tokenFromLocalStorage) {
    console.error("Token não encontrado.");
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card noborder>
            <BannerTable token={tokenFromLocalStorage} tenant={tenantFromLocalStorage} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BannerConfig;