import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { configs } from "@/configs/configs";
import { BreakpointIndicator } from "@/components/widgets/BreakpointIndicator";

type Props = {
  children: React.ReactNode;
};

export const ProviderCompose = (props: Props) => {
  console.log(configs.environment);
  return (
    <>
      <QueryProvider>{props.children}</QueryProvider>
      <ToastProvider />
      {configs.environment === "DEVELOPMENT" && <BreakpointIndicator />}
    </>
  );
};
