import useSWR from "swr";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sendSubNotes } from "../../utils/sendSubNotes";
import { useAPIObject } from "../../utils/useAPIObject";
import { useGetSocket } from "../recoil/socket";
import {
  addLower,
  allNotes,
  isLastInstanceNote,
  moreNote,
  oldestNoteId,
  updateMoreNote,
  updateMoreNoteLoading,
} from "../rtk/notesSlice";
import { settings } from "../rtk/settingsSlice";

export const useGetMoreNotes = (inView: boolean) => {
  const { userInfo } = useAppSelector(settings);
  const { timeline } = useAppSelector(settings).client;
  const socket = useGetSocket();
  const notes = useAppSelector(allNotes);
  const last = useAppSelector(isLastInstanceNote);
  const dispatch = useAppDispatch();
  const oldest = useAppSelector(oldestNoteId);
  const motto = useAppSelector(moreNote);
  const body = useAPIObject({
    type: "api",
    data: {
      limit: 15,
      untilId: oldest,
    },
  }) as string;
  const fetcher = async (socket: WebSocket, path: string) => {
    dispatch(updateMoreNote(false));
    const res = await fetch(`https://${userInfo.instance}/api${path}`, {
      method: "POST",
      body: body,
    });
    const text = await res.json();
    Promise.all([dispatch(addLower(text)), sendSubNotes(socket, text)]);
    dispatch(updateMoreNoteLoading(false));
    return;
  };
  useSWR(
    socket && !last && notes.length !== 0 && motto && inView
      ? [socket, getAPITimeline(timeline), oldest]
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
