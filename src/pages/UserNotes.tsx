import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Box, HStack, Center } from "@chakra-ui/layout";
import { Note as mkNote, UserDetailed } from "misskey-js/built/entities";
import React, { useState, useEffect, memo } from "react";
import { IoPin } from "react-icons/io5";
import { useInView } from "react-intersection-observer";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { Note } from "../components/Note";
import { settings } from "../features/settingsSlice";
import {
  isChangedUserNoteType,
  clearUserNotes,
  moreUserNote,
  updateMoreUserNote,
  user,
  userNotes,
  changeUserNotesType,
  lasts,
  oldests,
  initLoadeds,
} from "../features/userSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

export const UserNotes: React.VFC = memo(function Fn() {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(user);
  const userNotesData = useAppSelector(userNotes);
  const motto = useAppSelector(moreUserNote);
  const initLoaded = useAppSelector(initLoadeds).userNote;
  const changeType = useAppSelector(isChangedUserNoteType);
  const autoMotto = useAppSelector(settings).autoMotto;
  const isLastNote = useAppSelector(lasts).userNote;
  const { colors, props } = useColorContext();
  const [userNotesType, updateUserNotesType] = useState<
    "note" | "note-reply" | "files"
  >("note");
  const userNotesObject = useAPIObject({
    type: "api",
    id: "userNotes",
    endpoint: "users/notes",
    data: {
      limit: 15,
      userId: userData.id,
      includeReplies: userNotesType === "note" ? false : true,
      withFiles: userNotesType === "files" ? true : false,
    },
  }) as APIObject;
  const userNotesObjectJson = JSON.stringify(userNotesObject);
  const moreUserNotesObject = JSON.stringify(
    useAPIObject({
      id: "moreUserNotes",
      type: "api",
      endpoint: "users/notes",
      data: {
        limit: 15,
        userId: userData.id,
        untilId: useAppSelector(oldests).userNote,
        includeReplies: userNotesType === "note" ? false : true,
        withFiles: userNotesType === "files" ? true : false,
      },
    })
  );
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (!initLoaded && userNotesObject.body.data.userId) {
      socket.send(userNotesObjectJson);
    }
    if (changeType) {
      socket.send(userNotesObjectJson);
    }
  }, [socket, userNotesObjectJson, initLoaded, changeType, userNotesObject.body.data.userId]);
  useEffect(() => {
    if (autoMotto && inView && initLoaded && !changeType && !motto) {
      dispatch(updateMoreUserNote(true));
      socket.send(moreUserNotesObject);
    }
  }, [inView, autoMotto, initLoaded, changeType, motto, socket, dispatch, moreUserNotesObject]);
  return (
    <>
      <Box maxW="95vw" w="6xl" color={colors.textColor} pb="2">
        {userData.id && (
          <Box>
            {userData.pinnedNoteIds.length > 0 && (
              <PinnedNotes userData={userData} />
            )}
            {!userData.isBlocking && !userData.isBlocked ? (
              <>
                <HStack justify="space-around" mb="1">
                  <Button
                    {...(userNotesType === "note"
                      ? { ...props.PrimaryButton }
                      : { ...props.AlphaButton })}
                    onClick={() => {
                      if (userNotesType !== "note") {
                        updateUserNotesType("note");
                        dispatch(clearUserNotes());
                        dispatch(changeUserNotesType(true));
                      }
                    }}
                  >
                    ?????????
                  </Button>
                  <Button
                    {...(userNotesType === "note-reply"
                      ? { ...props.PrimaryButton }
                      : { ...props.AlphaButton })}
                    onClick={() => {
                      if (userNotesType !== "note-reply") {
                        updateUserNotesType("note-reply");
                        dispatch(clearUserNotes());
                        dispatch(changeUserNotesType(true));
                      }
                    }}
                  >
                    ???????????????
                  </Button>
                  <Button
                    {...(userNotesType === "files"
                      ? { ...props.PrimaryButton }
                      : { ...props.AlphaButton })}
                    onClick={() => {
                      if (userNotesType !== "files") {
                        updateUserNotesType("files");
                        dispatch(clearUserNotes());
                        dispatch(changeUserNotesType(true));
                      }
                    }}
                  >
                    ??????????????????
                  </Button>
                </HStack>
                <UserNotesData
                  userNotesData={userNotesData}
                  loaded={initLoaded}
                  change={changeType}
                />
              </>
            ) : (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                ????????????{userData.isBlocking ? "??????" : "?????????"}
                ?????????????????????????????????????????????
              </Alert>
            )}
            {!isLastNote && initLoaded && userNotes.length > 0 && (
              <>
                {autoMotto ? (
                  <Center>
                    {!motto ? <Box p="9" ref={ref} /> : <Loading small />}
                  </Center>
                ) : (
                  <Center marginBottom="2">
                    <Button
                      aria-label="more notes"
                      size="lg"
                      onClick={() => {
                        dispatch(updateMoreUserNote(true));
                        socket.send(moreUserNotesObject);
                      }}
                    >
                      {motto ? <Loading small /> : "?????????"}
                    </Button>
                  </Center>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
});

const PinnedNotes: React.VFC<{
  userData: UserDetailed;
}> = memo(function Fn({ userData }) {
  const { colors } = useColorContext();
  return (
    <Box
      p="2"
      border="1px solid"
      borderColor={colors.secondaryColor}
      borderRadius="md"
      mb="2"
    >
      <HStack spacing="0.5" color={colors.secondaryColor} justify="center">
        <IoPin />
        <Box>??????????????????????????????</Box>
      </HStack>
      {userData.pinnedNotes.map((note) => (
        <Box paddingBlock="1" key={note.id}>
          <Note
            note={note}
            type={{
              id: note.id,
              type:
                note.renoteId && !note.text
                  ? "renote"
                  : note.replyId
                  ? "reply"
                  : note.renoteId
                  ? "quote"
                  : "note",
            }}
            depth={0}
          />
        </Box>
      ))}
    </Box>
  );
});

const UserNotesData: React.VFC<{
  userNotesData: Array<mkNote>;
  loaded: boolean;
  change: boolean;
}> = memo(function Fn({ userNotesData, loaded, change }) {
  return (
    <>
      {userNotesData.length > 0 ? (
        userNotesData.map((note) => (
          <Box key={note.id} paddingBlock="1">
            <Note
              note={note}
              type={{
                id: note.id,
                type:
                  note.renoteId && !note.text
                    ? "renote"
                    : note.replyId
                    ? "reply"
                    : note.renoteId
                    ? "quote"
                    : "note",
              }}
              depth={0}
            />
          </Box>
        ))
      ) : loaded && !change ? (
        <Center>????????????????????????</Center>
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </>
  );
});
