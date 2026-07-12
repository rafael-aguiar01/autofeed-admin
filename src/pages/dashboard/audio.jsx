import React from "react";
import Card from "@/components/ui/Card";
import GenerateAudio from "../table/react-tables/GenerateAudio";
import Button from "@/components/ui/Button";
import SelectMonth from "@/components/partials/SelectMonth";
const Audio = () => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card  headerslot={<SelectMonth />} noborder>
            <GenerateAudio />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Audio;

