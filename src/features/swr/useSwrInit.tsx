import { useState } from "react";
import useSWR from "swr";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sendSubNotes } from "../../utils/sendSubNotes";
import { useAPIObject } from "../../utils/useAPIObject";
import { useGetSocket } from "../recoil/socket";
import { addLower, allNotes } from "../rtk/notesSlice";
import { settings, setUserInfo } from "../rtk/settingsSlice";

export const useSwrInit = () => {
  const [load, updateLoad] = useState(false);
  useInit(load, updateLoad);
};

export const useInit = (
  load: boolean,
  updateLoad: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const notes = useAppSelector(allNotes);
  const { userInfo } = useAppSelector(settings);
  const { timeline } = useAppSelector(settings).client;
  const dispatch = useAppDispatch();
  const socket = useGetSocket();
  const initNotesObject = useAPIObject({
    type: "api",
    data: {
      limit: 15,
    },
  }) as string;
  const getMeDataObject = useAPIObject({
    type: "api",
  }) as string;
  const fetcher = async (socket: WebSocket, path: string) => {
    updateLoad(true);
    Promise.allSettled([
      (async () => {
        const res = await fetch(`https://${userInfo.instance}/api${path}`, {
          method: "POST",
          body: initNotesObject,
        });
        const text = await res.json();
        Promise.all([dispatch(addLower(text)), sendSubNotes(socket, text)]);
        return;
      })(),
      (async () => {
        const res = await fetch(`https://${userInfo.instance}/api/i`, {
          method: "POST",
          body: getMeDataObject,
        });
        const text = await res.json();
        dispatch(setUserInfo({ ...userInfo, userData: text }));
        return;
      })(),
    ]);
    return;
  };
  useSWR(
    !load && socket && notes.length === 0
      ? [socket, getAPITimeline(timeline)]
      : null,
    fetcher
  );
  return;
};

const getAPITimeline = (
  timeline:
    | "homeTimeline"
    | "localTimeline"
    | "hybridTimeline"
    | "globalTimeline"
) =>
  timeline === "homeTimeline"
    ? "/notes/timeline"
    : timeline === "localTimeline"
    ? "/notes/local-timeline"
    : timeline === "hybridTimeline"
    ? "/notes/hybrid-timeline"
    : "/notes/global-timeline";
