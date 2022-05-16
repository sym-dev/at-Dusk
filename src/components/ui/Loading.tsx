import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import { memo } from "react";

import { useColorContext } from "../../utils/ColorContext";

export const Loading: React.FC<{ small?: boolean }> = memo(function Fn({
  small,
}) {
  const { colors } = useColorContext();
  return (
    <>
      <Box m="4">
        {small ? (
          <Spinner size="lg" color={colors.primaryThin} thickness="4px" />
        ) : (
          <Spinner size="xl" color={colors.primaryThin} thickness="4px" />
        )}
      </Box>
    </>
  );
});
