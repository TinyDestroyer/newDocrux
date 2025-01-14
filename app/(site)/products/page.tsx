import React from "react";
import ProductForm from "../../../components/ProductForm";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col items-center w-screen">
      <div className="text-3xl font-semibold text-primary-foreground py-10 w-3/4">
        Your Documents
      </div>
      <div className="text-lg text-white">No documents</div>
    </div>
  );
};

export default page;
