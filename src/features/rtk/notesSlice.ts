import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ID, Note } from "misskey-js/built/entities";

import { RootState } from "../../app/store";

export interface NoteType {
  id: ID;
  type: "note" | "reply" | "renote" | "quote";
}

export interface NotesState {
  notes: Array<Note>;
  noteTypes: Array<NoteType>;
  moreNote: boolean;
  moreNoteLoading: boolean;
  isLastInstanceNote: boolean;
}

const initialState: NotesState = {
  notes: [],
  noteTypes: [],
  moreNote: false,
  moreNoteLoading: false,
  isLastInstanceNote: false,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addUpper: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
      state.noteTypes.unshift({
        id: action.payload.id,
        type:
          action.payload.renoteId && !action.payload.text
            ? "renote"
            : action.payload.replyId
            ? "reply"
            : action.payload.renoteId
            ? "quote"
            : "note",
      });
    },
    addLower: (state, action: PayloadAction<Array<Note>>) => {
      state.notes = state.notes.concat(action.payload);
      if (action.payload.length < 15) state.isLastInstanceNote = true;
      (async () => {
        action.payload.forEach((note) => {
          state.noteTypes.push({
            id: note.id,
            type:
              note.renoteId && !note.text
                ? "renote"
                : note.replyId
                ? "reply"
                : note.renoteId
                ? "quote"
                : "note",
          });
        });
      })();
    },
    updateMoreNote: (state, action: PayloadAction<boolean>) => {
      state.moreNote = action.payload;
    },
    updateMoreNoteLoading: (state, action: PayloadAction<boolean>) => {
      state.moreNoteLoading = action.payload;
    },
    noteDelete: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: { deletedAt: string };
      }>
    ) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload.id);
      state.noteTypes = state.noteTypes.filter(
        (note) => note.id !== action.payload.id
      );
    },
    clear: (state) => {
      state.notes = [];
      state.noteTypes = [];
      state.isLastInstanceNote = false;
    },
  },
});

export const {
  addUpper,
  addLower,
  updateMoreNote,
  updateMoreNoteLoading,
  noteDelete,
  clear,
} = notesSlice.actions;

export const allNoteTypes = (state: RootState): Array<NoteType> =>
  state.notes.noteTypes;
export const allNotes = (state: RootState): Array<Note> => state.notes.notes;
export const moreNote = (state: RootState): boolean => state.notes.moreNote;
export const moreNoteLoading = (state: RootState): boolean =>
  state.notes.moreNoteLoading;
export const oldestNoteId = (state: RootState): string =>
  state.notes.notes.length > 0
    ? state.notes.notes[state.notes.notes.length - 1].id
    : "";
export const isLastInstanceNote = (state: RootState): boolean =>
  state.notes.isLastInstanceNote;

export default notesSlice.reducer;
