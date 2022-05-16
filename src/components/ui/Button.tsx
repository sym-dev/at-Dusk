import { Button as CkButton, ButtonProps, forwardRef } from "@chakra-ui/react";
import React from "react";

import { useColorContext } from "../../utils/ColorContext";

export const Button = forwardRef<
  ButtonProps & {
    model?:
      | "alpha"
      | "alpha-primary"
      | "primary"
      | "alpha-secondary"
      | "secondary";
  } & {
    state?: boolean;
  },
  "button"
>(({ model = "alpha", state, ...props }, ref) => {
  const { colors } = useColorContext();
  const colorProps: ButtonProps =
    model === "alpha"
      ? {
          sx: {
            "*": {
              color: colors.text,
            },
          },
          color: colors.text,
          bgColor: colors.alpha50,
          _hover: {
            bgColor: colors.alpha400,
          },
          _active: {
            bgColor: colors.alpha200,
          },
        }
      : model === "alpha-primary"
      ? {
          sx: {
            "*": {
              color: state ? colors.textPrimary : colors.text,
            },
          },
          color: state ? colors.textPrimary : colors.text,
          bgColor: state ? colors.primary : colors.alpha50,
          _hover: {
            bgColor: state ? colors.primaryThick : colors.alpha400,
          },
          _active: {
            bgColor: state ? colors.primaryThin : colors.alpha200,
          },
        }
      : model === "primary"
      ? {
          sx: {
            "*": {
              color: colors.textPrimary,
            },
          },
          color: colors.textPrimary,
          bgColor: colors.primary,
          _hover: {
            bgColor: colors.primaryThick,
          },
          _active: {
            bgColor: colors.primaryThin,
          },
        }
      : model === "alpha-secondary"
      ? {
          sx: {
            "*": {
              color: state ? colors.textSecondary : colors.text,
            },
          },
          color: state ? colors.textSecondary : colors.text,
          bgColor: state ? colors.secondary : colors.alpha50,
          _hover: {
            bgColor: state ? colors.secondaryThick : colors.alpha400,
          },
          _active: {
            bgColor: state ? colors.secondaryThin : colors.alpha200,
          },
        }
      : model === "secondary"
      ? {
          sx: {
            "*": {
              color: colors.textSecondary,
            },
          },
          color: colors.textSecondary,
          bgColor: colors.secondary,
          _hover: {
            bgColor: colors.secondaryThick,
          },
          _active: {
            bgColor: colors.secondaryThin,
          },
        }
      : {};
  return <CkButton ref={ref} {...props} {...colorProps} />;
});
