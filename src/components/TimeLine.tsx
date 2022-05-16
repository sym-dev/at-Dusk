import { Box, Center, VStack } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  allNotes,
  allNoteTypes,
  moreNoteLoading,
  updateMoreNote,
  updateMoreNoteLoading,
} from "../features/rtk/notesSlice";
import { settings } from "../features/rtk/settingsSlice";
import { useGetMoreNotes } from "../features/swr/useGetMoreNotes";
import { useGetMoreNotesByButton } from "../features/swr/useGetMoreNotesByButton";

import { Note } from "./Note";
import { Button } from "./ui/Button";
import { Loading } from "./ui/Loading";

export const TimeLine = memo(function Fn() {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  const { autoMotto } = useAppSelector(settings).client;
  const [mottoClicked, updateMotto] = useState(false);
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  const moreLoading = useAppSelector(moreNoteLoading);
  useGetMoreNotes(autoMotto && inView);
  useGetMoreNotesByButton(mottoClicked, updateMotto);
  useEffect(() => {
    if (autoMotto && inView) {
      dispatch(updateMoreNote(inView));
      dispatch(updateMoreNoteLoading(true));
    }
    if (mottoClicked) {
      dispatch(updateMoreNote(true));
      dispatch(updateMoreNoteLoading(true));
    }
  }, [dispatch, inView, autoMotto, mottoClicked]);
  return notes.length ? (
    <VStack alignItems="start" pb="4">
      {notes.map((note, i) => (
        <Box key={note.id} w="full">
          <Note note={note} type={noteTypes[i]} />
        </Box>
      ))}
      <Button
        model="alpha"
        alignSelf="center"
        ref={ref}
        disabled={moreLoading}
        onClick={() => {
          updateMotto(true);
        }}
      >
        {!moreLoading ? "MOTTO" : <Loading small />}
      </Button>
    </VStack>
  ) : (
    <Center>
      <Loading />
    </Center>
  );
});
