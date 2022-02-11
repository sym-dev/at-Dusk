import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

import { useAppDispatch } from "../app/hooks";
import { setTheme } from "../features/settingsSlice";

export const ColorModeSwitcher: React.VFC<
  Omit<IconButtonProps, "aria-label">
> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const dispatch = useAppDispatch();

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      onClick={() => {
        toggleColorMode();
        dispatch(setTheme({ themeMode: text }));
      }}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
