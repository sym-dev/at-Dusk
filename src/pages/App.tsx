import { Box, HStack } from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { LeftBar } from "../components/LeftBar";
import { MainHeader } from "../components/MainHeader";
import { RightBar } from "../components/RightBar";
import { useColorContext } from "../utils/ColorContext";
import { SocketManager } from "../utils/SocketManager";

import { Home } from "./Home";
import { Login } from "./Login";
import { Settings } from "./Settings";
import { UserPage } from "./UserPage";

import "../style/theme.scss";

export const App: React.FC = memo(function Fn() {
  const { colors } = useColorContext();
  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
  }, []);
  useEffect(() => {
    window.addEventListener("resize", () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    });
  }, []);
  return (
    <Box
      minH="calc(var(--vh, 1vh) * 100)"
      color={colors.text}
      bgColor={colors.base}
    >
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="*"
            element={
              <Auth>
                <SocketManager>
                  <HStack justify="space-between" alignItems="start" w="full">
                    <LeftBar />
                    <Box flex="1" minW="1">
                      <MainHeader />
                      <Box
                        sx={{
                          "@media (min-aspect-ratio: 3/2)": {
                            px: "10%",
                          },
                        }}
                      >
                        <Routes>
                          <Route path="user">
                            <Route path=":id" element={<UserPage />} />
                          </Route>
                          <Route path="settings" element={<Settings />} />
                          <Route path="/" element={<Home />} />
                        </Routes>
                      </Box>
                    </Box>
                    <RightBar />
                  </HStack>
                </SocketManager>
              </Auth>
            }
          />
        </Routes>
      </Router>
    </Box>
  );
});
