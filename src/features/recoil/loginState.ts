import { useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { useAppSelector } from "../../app/hooks";
import { settings } from "../rtk/settingsSlice";

const loginState = atom<boolean>({
  key: "loginState",
  default: false,
});

const loginToken = atom<string>({
  key: "loginToken",
  default: "",
});

export const useSetLogin = (login: boolean, token?: string) => {
  const setLoginState = useSetRecoilState(loginState);
  const setLoginToken = useSetRecoilState(loginToken);
  if (login && token) {
    setLoginState(login);
    setLoginToken(token);
  } else {
    setLoginState(login);
    setLoginToken("");
  }
};

export const useGetLogin = () => {
  return {
    login: useRecoilValue(loginState),
    token: useRecoilValue(loginToken),
  };
};

export const useSetIsLogin = () => {
  const userInfo = useAppSelector(settings).userInfo;
  const setLoginState = useSetRecoilState(loginState);
  const setLoginToken = useSetRecoilState(loginToken);
  useEffect(() => {
    setLoginState(userInfo.login);
    setLoginToken(userInfo.userToken);
  }, [setLoginState, setLoginToken, userInfo.login, userInfo.userToken]);
};

export const useSetTheme = () => {
  const s = useAppSelector(settings);
  useEffect(() => {
    document.querySelector(":root")?.setAttribute("mode", s.userInfo.themeMode);
    document
      .querySelector(":root")
      ?.setAttribute(
        "theme",
        s.userInfo.themeMode === "dark" ? s.theme.darkTheme : s.theme.lightTheme
      );
  }, [s.userInfo.themeMode, s.theme]);
};
