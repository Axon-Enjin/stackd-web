import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { configs } from "@/configs/configs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SupabaseAuthProvider } from "./SupabaseAuthProvider";

type Props = {
  children: React.ReactNode;
};

export const ProviderCompose = (props: Props) => {
  return (
    <SupabaseAuthProvider>
      <GoogleOAuthProvider clientId={configs.googleAuth.clientId!}>
        <QueryProvider>{props.children}</QueryProvider>
        <ToastProvider />
      </GoogleOAuthProvider>
    </SupabaseAuthProvider>
  );
};
