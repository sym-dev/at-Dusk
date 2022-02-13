import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/layout";
import { Note as mkNote, UserLite } from "misskey-js/built/entities";
import React, { memo } from "react";
import {
  IoArrowUndo,
  IoFastFood,
  IoHome,
  IoLockClosed,
  IoMail,
} from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";

import { NoteType } from "../features/notesSlice";
import { useColorContext } from "../utils/ColorContext";
import { getRelativeTime } from "../utils/getRelativeTime";

import { Files } from "./Files";
import { NoteFooter } from "./NoteFooter";
import { ParseMFM } from "./ParseMFM";
import { Poll } from "./Poll";
import { Reactions } from "./Reactions";

export const Note: React.VFC<{
  note: mkNote;
  type: NoteType;
  depth: number;
  onlyBody?: boolean;
}> = memo(
  function Fn({ note, type, depth, onlyBody }) {
    const { colors } = useColorContext();
    const name = note.user.name ? note.user.name : note.user.username;
    const [cw, updateCw] = React.useState(
      note.cw || note.cw === "" ? true : false
    );
    return (
      <Box
        p="2"
        borderRadius="lg"
        overflow="hidden"
        bgColor={colors.panelColor}
        color={colors.textColor}
      >
        {type.type === "note" && (
          <GeneralNote
            note={note}
            name={name}
            depth={depth}
            cw={cw}
            updateCw={updateCw}
          />
        )}
        {type.type === "reply" && <Reply note={note} name={name} />}
        {type.type === "renote" && <Renote note={note} name={name} />}
        {type.type === "quote" && (
          <Quote
            note={note}
            name={name}
            depth={depth}
            cw={cw}
            updateCw={updateCw}
          />
        )}
        {!onlyBody && (
          <>
            <Reactions
              id={
                type.type === "renote" ? (note.renote?.id as string) : note.id
              }
            />
            <NoteFooter note={note} type={type} />
          </>
        )}
      </Box>
    );
  },
  (p, n) => p.note.id === n.note.id
);

const GeneralNote: React.VFC<{
  note: mkNote;
  name: string;
  depth: number;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = memo(function Fn({ note, name, depth, cw, updateCw }) {
  const { colors } = useColorContext();
  return (
    <>
      <Flex>
        <Link
          as={RouterLink}
          to={`/user/@${note.user.username}${
            note.user.host ? `@${note.user.host}` : ""
          }`}
        >
          <Avatar
            name={note.user.username}
            src={note.user.avatarUrl}
            marginRight="2"
            bg="none"
          />
        </Link>
        <Box overflow="hidden" flex="1">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" overflow="hidden">
              <Link
                as={RouterLink}
                to={`/user/@${note.user.username}${
                  note.user.host ? `@${note.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM text={name} emojis={note.user.emojis} type="plain" />
              </Link>
              <Text color="gray.400" isTruncated>{`@${note.user.username}${
                note.user.host ? `@${note.user.host}` : ""
              }`}</Text>
            </Flex>
            <HStack flexShrink={0} spacing="1">
              <Link as={RouterLink} to={`/notes/${note.id}`} color="gray.400">
                {getRelativeTime(note.createdAt)}
              </Link>
              <Visibility
                visibility={note.visibility}
                local={note.localOnly}
                renote={false}
              />
            </HStack>
          </Flex>
          {note.user.host && depth === 0 && <Instance user={note.user} />}
          <Box>
            {note.cw || note.cw === "" ? (
              <>
                <HStack alignItems="start">
                  {note.replyId && <Icon as={IoArrowUndo} mt="2" />}
                  <Box>
                    <Box
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      display="inline"
                    >
                      <ParseMFM
                        text={note.cw}
                        emojis={note.emojis}
                        type="full"
                      />
                    </Box>
                    <Button
                      marginLeft="1"
                      size="xs"
                      color={colors.headerTextColor}
                      colorScheme="whiteAlpha"
                      onClick={() => {
                        updateCw(!cw);
                      }}
                    >
                      {!cw
                        ? "隠す"
                        : `もっと見る (${
                            note.text?.length ? `${note.text?.length}文字` : ""
                          }${
                            note.text?.length && note.files.length ? " / " : ""
                          }${
                            note.files.length
                              ? `${note.files.length}ファイル`
                              : ""
                          }${
                            (note.text?.length || note.files.length) &&
                            note.poll
                              ? " / "
                              : ""
                          }${note.poll ? "アンケート" : ""})`}
                    </Button>
                  </Box>
                </HStack>
                {!cw && (
                  <Box w="full">
                    <Box
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      display="inline"
                      w="full"
                    >
                      <ParseMFM
                        text={note.text}
                        emojis={note.emojis}
                        type="full"
                      />
                    </Box>
                    {note.renoteId && note.renote?.text && (
                      <Text
                        marginLeft="1"
                        color="green.400"
                        display="inline"
                        verticalAlign="middle"
                      >
                        <i>RN:</i>
                      </Text>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <HStack alignItems="start">
                {note.replyId && <Icon as={IoArrowUndo} mt="2" />}
                <Box paddingInline="1" w="full">
                  <Box
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    display="inline"
                    w="full"
                  >
                    <ParseMFM
                      text={note.text}
                      emojis={note.emojis}
                      type="full"
                    />
                  </Box>
                  {note.renoteId && note.renote?.text && (
                    <Text
                      marginLeft="1"
                      color="green.400"
                      display="inline"
                      verticalAlign="middle"
                    >
                      <i>RN:</i>
                    </Text>
                  )}
                </Box>
              </HStack>
            )}
          </Box>
        </Box>
      </Flex>
      {!cw && depth === 0 ? (
        <>
          {note.fileIds.length > 0 && <Files files={note.files} />}
          {note.poll && <Poll id={note.id} emojis={note.emojis} />}
        </>
      ) : (
        <>
          {!cw && (note.fileIds.length > 0 || note.poll?.choices) && (
            <>
              {note.fileIds.length > 0 && (
                <Accordion allowToggle m="1">
                  <AccordionItem border="none">
                    <AccordionButton
                      w="fit-content"
                      bgColor={colors.alpha200}
                      paddingBlock="0"
                    >
                      <AccordionIcon />
                      {`${note.fileIds.length}個のファイル`}
                    </AccordionButton>
                    <AccordionPanel p="1">
                      <Files files={note.files} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
              {note.poll?.choices && (
                <Accordion allowToggle m="1">
                  <AccordionItem border="none">
                    <AccordionButton
                      w="fit-content"
                      bgColor={colors.alpha200}
                      paddingBlock="0"
                    >
                      <AccordionIcon />
                      アンケート
                    </AccordionButton>
                    <AccordionPanel p="1">
                      <Poll id={note.id} emojis={note.emojis} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          )}
        </>
      )}
    </>
  );
});

const Reply: React.VFC<{
  note: mkNote;
  name: string;
}> = memo(function Fn({ note, name }) {
  const { colors } = useColorContext();
  const [replyCw, updateReplyCw] = React.useState(
    note.reply && (note.reply?.cw || note.reply?.cw === "") ? true : false
  );
  const [cw, updateCw] = React.useState(
    note.cw || note.cw === "" ? true : false
  );
  return (
    <Box>
      <Box
        border="1.5px dashed"
        borderColor={colors.secondaryColor}
        borderRadius="lg"
        marginBottom="2"
        paddingInline="1"
        paddingBlock="2"
        opacity="0.6"
      >
        <GeneralNote
          note={note.reply as mkNote}
          name={
            note.reply?.user.name
              ? note.reply.user.name
              : (note.reply?.user.username as string)
          }
          depth={1}
          cw={replyCw}
          updateCw={updateReplyCw}
        />
      </Box>
      {note.renoteId ? (
        <Box overflow="hidden">
          <Quote
            note={note}
            name={name}
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      ) : (
        <Box overflow="hidden">
          <GeneralNote
            note={note}
            name={name}
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      )}
    </Box>
  );
});

const Renote: React.VFC<{
  note: mkNote;
  name: string;
}> = memo(function Fn({ note, name }) {
  const [cw, updateCw] = React.useState(
    note.renote && (note.renote.cw || note.renote.cw === "") ? true : false
  );
  return (
    <Box>
      {note.renote?.replyId && (
        <Box marginBottom="1" opacity="0.7">
          {note.renote?.renoteId ? (
            <Box overflow="hidden">
              <Quote
                note={note.renote.reply as mkNote}
                name={
                  note.renote?.reply?.user.name
                    ? note.renote.reply.user.name
                    : (note.renote?.reply?.user.username as string)
                }
                depth={1}
                cw={cw}
                updateCw={updateCw}
              />
            </Box>
          ) : (
            <Box overflow="hidden">
              <GeneralNote
                note={note.renote.reply as mkNote}
                name={
                  note.renote?.reply?.user.name
                    ? note.renote.reply.user.name
                    : (note.renote?.reply?.user.username as string)
                }
                depth={1}
                cw={cw}
                updateCw={updateCw}
              />
            </Box>
          )}
        </Box>
      )}
      <Flex alignItems="center" justifyContent="space-between" marginBottom="2">
        <Flex overflow="hidden">
          <Avatar
            name={note.user.username}
            src={note.user.avatarUrl}
            size="xs"
            marginRight="1"
            bg="none"
          />
          <HStack color="green.400" spacing="0" overflow="hidden">
            <Link
              as={RouterLink}
              to={`/user/@${note.user.username}${
                note.user.host ? `@${note.user.host}` : ""
              }`}
              isTruncated
            >
              <ParseMFM text={name} emojis={note.user.emojis} type="plain" />
            </Link>
            <Box isTruncated>がRenote</Box>
          </HStack>
        </Flex>
        <HStack spacing="1" flexShrink={0}>
          <Link as={RouterLink} to={`/notes/${note.id}`} color="green.400">
            {getRelativeTime(note.createdAt)}
          </Link>
          <Box color="green.400">
            <Visibility
              visibility={note.visibility}
              local={note.localOnly}
              renote={true}
            />
          </Box>
        </HStack>
      </Flex>
      {note.renote?.renoteId ? (
        <Box overflow="hidden">
          <Quote
            note={note.renote as mkNote}
            name={
              note.renote?.user.name
                ? note.renote.user.name
                : (note.renote?.user.username as string)
            }
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      ) : (
        <Box overflow="hidden">
          <GeneralNote
            note={note.renote as mkNote}
            name={
              note.renote?.user.name
                ? note.renote.user.name
                : (note.renote?.user.username as string)
            }
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      )}
    </Box>
  );
});

const Quote: React.VFC<{
  note: mkNote;
  name: string;
  depth: number;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = memo(function Fn({ note, name, depth, cw, updateCw }) {
  const { colors } = useColorContext();
  const [quoteCw, updateQuoteCw] = React.useState(
    note.renote?.cw || note.renote?.cw === "" ? true : false
  );
  return (
    <Box>
      <GeneralNote
        note={note}
        name={name}
        depth={0}
        cw={cw}
        updateCw={updateCw}
      />
      {!((note.cw || note.cw === "") && cw) && depth === 0 && (
        <Box
          marginTop="1"
          paddingInline="1"
          paddingBlock="2"
          borderRadius="lg"
          border="1.5px dashed"
          borderColor={colors.borderColor}
        >
          <GeneralNote
            note={note.renote as mkNote}
            name={
              note.renote?.user.name
                ? note.renote.user.name
                : (note.renote?.user.username as string)
            }
            depth={1}
            cw={quoteCw}
            updateCw={updateQuoteCw}
          />
        </Box>
      )}
    </Box>
  );
});

const Instance: React.VFC<{
  user: UserLite;
}> = memo(function Fn({ user }) {
  const { colors } = useColorContext();
  return (
    <>
      <Flex
        bgGradient={`linear(to-r, ${
          user.instance?.themeColor ? user.instance.themeColor : colors.alhpa600
        }, #00000000)`}
        paddingLeft="1"
        borderRadius="md"
        alignItems="center"
      >
        <Image
          src={user.instance?.faviconUrl as string}
          h="5"
          marginRight="1"
          alt="favicon"
        />
        <Text color="white">{user.instance?.name}</Text>
      </Flex>
    </>
  );
});

const Visibility: React.VFC<{
  visibility: "public" | "home" | "followers" | "specified";
  local: boolean | undefined;
  renote: boolean;
}> = memo(function Fn({ visibility, local, renote }) {
  let v = null;
  switch (visibility) {
    case "home":
      v = <Icon as={IoHome} color={renote ? "green.400" : "gray.400"} />;
      break;
    case "followers":
      v = <Icon as={IoLockClosed} color={renote ? "green.400" : "gray.400"} />;
      break;
    case "specified":
      v = <Icon as={IoMail} color={renote ? "green.400" : "gray.400"} />;
      break;
    default:
      break;
  }
  return (
    <HStack spacing="1">
      {local && (
        <Icon as={IoFastFood} color={renote ? "green.400" : "gray.400"} />
      )}
      {v}
    </HStack>
  );
});
