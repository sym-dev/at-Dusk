import { useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { useAppSelector } from "../../app/hooks";
import { settings } from "../rtk/settingsSlice";

const socketState = atom<WebSocket | undefined>({
  key: "socketState",
  default: undefined,
});

export const useSetSocket = () => {
  const userInfo = useAppSelector(settings).userInfo;
  const setSocket = useSetRecoilState(socketState);
  useEffect(() => {
    setSocket(
      new WebSocket(
        `wss://${userInfo.instance}/streaming?i=${userInfo.userToken}`
      )
    );
  }, [setSocket, userInfo.instance, userInfo.userToken]);
};

export const useGetSocket = () => {
  return useRecoilValue(socketState);
};
