import { Box, Avatar as CkAvatar } from "@chakra-ui/react";
import { UserLite } from "misskey-js/built/entities";
import React, { memo } from "react";

import { useColorContext } from "../utils/ColorContext";

import { Cat } from "./Cat";

export const Avatar: React.FC<{
  user: UserLite & { isCat?: boolean };
  small?: boolean;
}> = memo(function Fn({ user, small }) {
  const { colors } = useColorContext();
  return (
    <Box pos="relative" boxSize={small ? "10" : "16"}>
      <CkAvatar
        name={user.name ? user.name : user.username}
        src={user.avatarUrl}
        bg="transparent"
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        size={small ? "sm" : "md"}
        zIndex="1"
      />
      {user.isCat && (
        <Box
          w={small ? "10" : "16"}
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -55%)"
        >
          <Cat
            color={
              user.avatarBlurhash
                ? `#${[...user.avatarBlurhash.slice(2, 6)]
                    .map((x) =>
                      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".indexOf(
                        x
                      )
                    )
                    .reduce((a, c) => a * 83 + c, 0)
                    .toString(16)
                    .padStart(6, "0")}`
                : colors.secondary
            }
            // https://github.com/misskey-dev/misskey/blob/develop/packages/client/src/scripts/extract-avg-color-from-blurhash.ts
          />
        </Box>
      )}
    </Box>
  );
});
