"use client"
import React from "react";

type Props = {};

const page = (props: Props) => {
  const clicked = () => {
    console.log("haan bhai sab bhadiya!!!");
  }
  return(
    <div className="flex justify-center items-center w-full h-full gap-2 text-white m-2">
      <p>Shubh</p>
      <button className="bg-gray-300 rounded-lg p-2 text-black" onClick={clicked}>click here</button>
    </div>
  );
};

export default page;
