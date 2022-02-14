import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaMoon } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, settings } from "../features/settingsSlice";

export const ColorModeSwitcher: React.VFC<
  Omit<IconButtonProps, "aria-label">
> = (props) => {
  const mode = useAppSelector(settings).userInfo.themeMode;
  const dispatch = useAppDispatch();
  const { setColorMode } = useColorMode();

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      onClick={() => {
        dispatch(setTheme({ themeMode: mode === "dark" ? "light" : "dark" }));
        setColorMode(mode === "dark" ? "light" : "dark");
      }}
      icon={<FaMoon />}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      {...props}
    />
  );
};
