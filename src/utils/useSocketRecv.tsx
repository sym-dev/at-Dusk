import { Note } from "misskey-js/built/entities";
import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { useGetSocket } from "../features/recoil/socket";
import { addUpper } from "../features/rtk/notesSlice";

export const useSocketRecv = () => {
  const socket = useGetSocket();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const res = JSON.parse(event.data);
        const data = res.body;
        if (!data.error) {
          switch (res.type) {
            case "channel": {
              switch (data.id) {
                case "timeline": {
                  Promise.allSettled([
                    dispatch(addUpper(data.body)),
                    sendSubNote(socket, data.body),
                  ]);
                  break;
                }
              }
            }
          }
        } else {
          console.error(data.error);
        }
      };
    }
  }, [socket, dispatch]);
};

const sendSubNote = async (socket: WebSocket, note: Note) => {
  socket.send(
    JSON.stringify({
      type: "subNote",
      body: {
        id: note.renoteId && !note.text ? note.renoteId : note.id,
      },
    })
  );
};
