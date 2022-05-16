import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import notesReducer from "../features/rtk/notesSlice";
import settingsReducer from "../features/rtk/settingsSlice";

const reducers = combineReducers({
  settings: settingsReducer,
  notes: notesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
