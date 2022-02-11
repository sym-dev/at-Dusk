import { IconButton, IconButtonProps } from "@chakra-ui/react";
import * as React from "react";
import { FaMoon } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, settings } from "../features/settingsSlice";

export const ColorModeSwitcher: React.VFC<
  Omit<IconButtonProps, "aria-label">
> = (props) => {
  const mode = useAppSelector(settings).userInfo.themeMode;
  const dispatch = useAppDispatch();

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      onClick={() => {
        dispatch(setTheme({ themeMode: mode === "dark" ? "light" : "dark" }));
      }}
      icon={<FaMoon />}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      {...props}
    />
  );
};
