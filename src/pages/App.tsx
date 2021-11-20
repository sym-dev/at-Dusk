import { useColorModeValue } from "@chakra-ui/color-mode";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { EmojiModal } from "../components/EmojiModal";
import { Header } from "../components/Header";
import { PostModal } from "../components/PostModal";
import { CheckLocation } from "../utils/CheckLocation";
import { SocketProvider } from "../utils/SocketContext";
import { SocketManager } from "../utils/SocketManager";

import { Home } from "./Home";
import { Login } from "./Login";
import { Notes } from "./Notes";
import { Settings } from "./Settings";
import { User } from "./User";

export const App: React.VFC = () => {
  return (
    <Router>
      <Flex
        minH="100vh"
        direction="column"
        alignItems="center"
        bgColor={useColorModeValue("light.base", "dark.base")}
        transitionDuration="normal"
        transitionProperty="background-color"
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Auth>
                <SocketProvider>
                  <SocketManager>
                    <Header />
                    <CheckLocation>
                      <Routes>
                        <Route path="/user">
                          <Route path=":id" element={<User />} />
                        </Route>
                        <Route path="/notes">
                          <Route path=":id" element={<Notes />} />
                        </Route>
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/" element={<Home />} />
                      </Routes>
                    </CheckLocation>
                    <PostModal />
                    <EmojiModal />
                  </SocketManager>
                </SocketProvider>
              </Auth>
            }
          />
        </Routes>
      </Flex>
    </Router>
  );
};
