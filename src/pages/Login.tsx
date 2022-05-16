import React, { memo } from "react";
import { Navigate } from "react-router-dom";

import { useGetLogin, useSetIsLogin } from "../features/recoil/loginState";

import { GetToken } from "./GetToken";
import { LoginForm } from "./LoginForm";

export const Login: React.FC = memo(function Fn() {
  const session = getUuid();
  useSetIsLogin();
  const { login } = useGetLogin();
  return login ? (
    <Navigate to="/" />
  ) : session ? (
    <GetToken uuid={session} />
  ) : (
    <LoginForm />
  );
});

function getUuid(): string | null {
  const params = new URLSearchParams(document.location.search.substring(1));
  const session = params.get("session");
  return session;
}
