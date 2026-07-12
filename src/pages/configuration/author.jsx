import React from "react";
import Card from "@/components/ui/Card";
import AuthorTable from '../table/react-tables/AuthorTable'

const Author = () => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 col-span-12">
          <Card   noborder>
            <AuthorTable />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Author;