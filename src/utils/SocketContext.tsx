import { useToast } from "@chakra-ui/react";
import React, { useRef, createContext, useContext, useState } from "react";

import { store } from "../app/store";

const SocketContext = createContext<{
  socket: React.MutableRefObject<WebSocket>;
  isSocketOpen: boolean;
  updateSocketOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>(
  {} as {
    socket: React.MutableRefObject<WebSocket>;
    isSocketOpen: boolean;
    updateSocketOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
);

const SocketProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const [isSocketOpen, updateSocketOpen] = useState<boolean>(false);
  const toast = useToast();
  const info = store.getState().settings.userInfo;
  const socketRef = useRef<WebSocket>(
    new WebSocket("wss://" + info.instance + "/streaming?i=" + info.userToken)
  );

  socketRef.current.onerror = (err) => {
    console.error(err);
    toast({
      title: "Socket Error.",
      status: "error",
      duration: 3000,
    });
  };

  socketRef.current.onclose = () => {
    console.log("SOCKET CLOSED");
    toast({
      title: "Socket Closed.",
      description: "再接続するにはリロードしてください",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef, isSocketOpen, updateSocketOpen }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = (): WebSocket => {
  const socket = useContext(SocketContext);
  return socket.socket.current;
};

const useSocketOpen = (): {
  isSocketOpen: boolean;
  updateSocketOpen: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const socket = useContext(SocketContext);
  return {
    isSocketOpen: socket.isSocketOpen,
    updateSocketOpen: socket.updateSocketOpen,
  };
};

export { SocketProvider, useSocket, useSocketOpen };
