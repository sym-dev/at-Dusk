import { Note } from "misskey-js/built/entities";

export const sendSubNotes = async (socket: WebSocket, notes: Array<Note>) => {
  notes.forEach(async (note: Note) => {
    socket.send(
      JSON.stringify({
        type: "subNote",
        body: {
          id: note.renoteId && !note.text ? note.renoteId : note.id,
        },
      })
    );
  });
};
