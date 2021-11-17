import { IconButton } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Note as mkNote } from "misskey-js/built/entities";
import React, { memo } from "react";
import {
  IoAddCircle,
  IoArrowUndo,
  IoBan,
  IoEllipsisHorizontal,
  IoRepeat,
} from "react-icons/io5";

import { NoteType } from "../features/notesSlice";
import { useStyleProps } from "../utils/StyleProps";

export const NoteFooter: React.VFC<{
  note: mkNote;
  type: NoteType;
  colors: Record<string, string>;
}> = memo(function Fn({ note, type, colors }) {
  const styleProps = useStyleProps();
  return (
    <Flex
      overflow="hidden"
      w="full"
      justifyContent="space-around"
      marginTop="1"
      color={colors.fontColor}
    >
      <Flex alignItems="center">
        <IconButton
          aria-label="reply"
          size="sm"
          icon={<IoArrowUndo />}
          marginRight="0.5"
          {...styleProps.AlphaButton}
        />
        {type.type !== "renote" ? note.repliesCount : note.renote?.repliesCount}
      </Flex>
      <Flex alignItems="center">
        <Menu>
          {note.visibility === "followers" ||
          note.visibility === "specified" ? (
            <MenuButton
              as={IconButton}
              aria-label="renote"
              size="sm"
              icon={<IoBan size="1.4em" />}
              marginRight="0.5"
              {...styleProps.DisabledBgColor}
              disabled
            />
          ) : (
            <MenuButton
              as={IconButton}
              aria-label="renote"
              size="sm"
              icon={<IoRepeat size="1.4em" />}
              marginRight="0.5"
              {...styleProps.AlphaButton}
            />
          )}
          <MenuList bgColor={colors.panelColor} borderColor={colors.alpha400}>
            <MenuItem _focus={{ bgColor: colors.alpha200 }}>Renote</MenuItem>
            <MenuItem _focus={{ bgColor: colors.alpha200 }}>引用</MenuItem>
          </MenuList>
        </Menu>
        {type.type !== "renote" ? note.renoteCount : note.renote?.renoteCount}
      </Flex>
      <IconButton
        aria-label="reaction"
        size="sm"
        icon={<IoAddCircle size="1.4em" />}
        {...styleProps.AlphaButton}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="menu"
          size="sm"
          icon={<IoEllipsisHorizontal size="1.4em" />}
          {...styleProps.AlphaButton}
        />
        <MenuList bgColor={colors.panelColor} borderColor={colors.alpha400}>
          <MenuItem _focus={{ bgColor: colors.alpha200 }}>
            リンクをコピー
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
});
