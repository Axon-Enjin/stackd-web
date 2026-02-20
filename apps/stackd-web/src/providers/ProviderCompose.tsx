import React from "react";
import { QueryProvider } from "./QueryProvider"; 
import { ToastProvider } from "./ToastProvider"; 

type Props = {
  children: React.ReactNode;
};

export const ProviderCompose = (props: Props) => {
  return (
    <>
      <QueryProvider>
        {props.children} 
      </QueryProvider>
      <ToastProvider />
    </>
  );
};
