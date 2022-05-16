import { Box, Center } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { store } from "../app/store";
import { Loading } from "../components/ui/Loading";
import { useGetLogin, useSetLogin } from "../features/recoil/loginState";
import { setUserInfo } from "../features/rtk/settingsSlice";

export const GetToken: React.FC<{
  uuid: string;
}> = ({ uuid }) => {
  const navigate = useNavigate();
  const { login } = useGetLogin();
  const tokenUrl = `https://${
    store.getState().settings.userInfo.instance
  }/api/miauth/${uuid}/check`;
  useFetchData(tokenUrl, useSetLogin);
  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [login, navigate]);
  return (
    <Box w="full">
      <Center>
        <Loading />
      </Center>
    </Box>
  );
};

function useFetchData(
  tokenUrl: string,
  useSetLogin: (login: boolean, token?: string | undefined) => void
) {
  const toast = useToast();
  let token = "";
  try {
    (async () => {
      const res = await fetch(tokenUrl, { method: "POST" });
      const text = await res.json();
      if (text.token) {
        localStorage.setItem("userId", text.user.id);
        const settings = store.getState().settings.userInfo;
        store.dispatch(
          setUserInfo({ ...settings, login: text.ok, userToken: text.token })
        );
        Promise.allSettled([fetchMeta(), fetchUser(text.user.id)]).then(() => {
          token = text.token;
        });
      }
    })();
  } catch (error) {
    toast({
      title: "Login Error.",
      status: "error",
      duration: 1000,
    });
  } finally {
    useSetLogin(true, token);
  }
}

async function fetchMeta() {
  const settings = store.getState().settings.userInfo;
  const res = await fetch(
    `https://${store.getState().settings.userInfo.instance}/api/meta`,
    {
      method: "POST",
    }
  );
  const text = await res.json();
  store.dispatch(setUserInfo({ ...settings, instanceMeta: await text }));
  await Promise.resolve();
}

async function fetchUser(id: string) {
  const settings = store.getState().settings.userInfo;
  const res = await fetch(
    `https://${store.getState().settings.userInfo.instance}/api/users/show`,
    {
      method: "POST",
      body: JSON.stringify({
        userId: id,
      }),
    }
  );
  const text = await res.json();
  store.dispatch(setUserInfo({ ...settings, userData: await text }));
  await Promise.resolve();
}
