import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

function Loader() {
 

  return (
  <div className="flex flex-col h-[50vh] items-center justify-center ">
    <TailSpin height={80} width={80}  ariaLabel="loading" color="red" />
  </div>
  );
}

export default Loader;
