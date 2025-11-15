import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Header from "./components/Header";
import Home from "./Pages/Home"
import "./App.css";

function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <Home/>
    </div>
  );
}
export default App;
