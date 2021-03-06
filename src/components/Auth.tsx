import React, { useEffect } from "react";
import { memo } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { useLoginContext } from "../utils/LoginContext";

export const Auth: React.VFC<{
  children: React.ReactNode;
}> = memo(function Fn({ children }) {
  const info = useAppSelector(settings).userInfo;
  const { updateToken } = useLoginContext();
  useEffect(() => {
    if (info?.login) updateToken(info?.userToken as string);
  }, [info, updateToken]);
  return info?.login ? <>{children}</> : <Navigate to="/login" />;
});
