import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { configs } from "@/configs/configs";
import { BreakpointIndicator } from "@/components/widgets/BreakpointIndicator";
import { GoogleOAuthProvider } from "@react-oauth/google";

type Props = {
  children: React.ReactNode;
};

export const ProviderCompose = (props: Props) => {

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
    >
      <QueryProvider>{props.children}</QueryProvider>
      <ToastProvider />
    </GoogleOAuthProvider>
  );
};
