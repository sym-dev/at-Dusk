import React, { useRef, createContext, useContext, useState } from "react";

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
  const socketRef = useRef<WebSocket>(
    new WebSocket(
      "wss://" +
        localStorage.getItem("instanceURL") +
        "/streaming?i=" +
        localStorage.getItem("UserToken")
    )
  );

  socketRef.current.onerror = (e) => {
    console.error(e);
  };

  socketRef.current.onclose = () => {
    console.log("SOCKET CLOSED");
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