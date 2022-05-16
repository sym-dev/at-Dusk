import { Box } from "@chakra-ui/react";
import React, { memo } from "react";

import { useColorContext } from "../utils/ColorContext";

export const RightBar = memo(function Fn() {
  const { colors } = useColorContext();
  return (
    <Box
      bgColor={colors.alpha200}
      color={colors.text}
      height="calc(var(--vh, 1vh) * 100)"
      top="0"
      pos="sticky"
      w="3xs"
      px={[2, 4]}
      py="2"
      sx={{
        "@media (max-aspect-ratio: 3/2), (max-width: 800px)": {
          display: "none",
        },
      }}
    ></Box>
  );
});
