"use client";
import React from "react";
import Header from "./_components/Header";
import { createContext, useState } from "react";
export const WebCamContext = createContext();

const DashboardLayout = ({ children }) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  return (
    <div>
      <Header />
      <div className="m-auto w-[90%] max-w-7xl pb-16">
        <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
          {children}
        </WebCamContext.Provider>
      </div>
    </div>
  );
};

export default DashboardLayout;
