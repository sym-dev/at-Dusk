import { Box, HStack, VStack } from "@chakra-ui/react";
import { Note as mkNote } from "misskey-js/built/entities";
import React, { memo } from "react";

import { NoteType } from "../features/rtk/notesSlice";
import { useColorContext } from "../utils/ColorContext";

import { Avatar } from "./Avatar";

export const Note: React.VFC<{ note: mkNote; type: NoteType }> = memo(
  function Fn({ note, type }) {
    const { colors } = useColorContext();
    return (
      <>
        <VStack
          overflow="hidden"
          p="2"
          borderRadius="md"
          bgColor={colors.alpha50}
        >
          <HStack w="full" overflow="hidden">
            <Avatar user={note.user} />
            <Box flex="1" color="red.300" noOfLines={1}>
              {note.user.name ? note.user.name : note.user.username}
            </Box>
          </HStack>
          <Box w="full" noOfLines={1}>
            {note.text}
          </Box>
        </VStack>
      </>
    );
  }
);
