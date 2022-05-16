import { Input as CkInput, InputProps, forwardRef } from "@chakra-ui/react";
import React from "react";

import { useColorContext } from "../../utils/ColorContext";

export const Input = forwardRef<InputProps, "input">((props, ref) => {
  const { colors } = useColorContext();
  return (
    <CkInput
      color={colors.text}
      borderColor={colors.alpha400}
      _hover={{ borderColor: colors.alpha600 }}
      _focus={{ borderColor: colors.secondary }}
      _placeholder={{ color: colors.alpha600 }}
      ref={ref}
      {...props}
    />
  );
});
