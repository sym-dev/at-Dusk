import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomEmoji,
  InstanceMetadata,
  MeDetailed,
} from "misskey-js/built/entities";

import { RootState } from "../../app/store";

export interface SettingsState {
  theme: {
    lightTheme: string;
    darkTheme: string;
  };
  userInfo: {
    login: boolean;
    userToken: string;
    instance: string;
    appname: string;
    userData: MeDetailed;
    instanceMeta: InstanceMetadata;
    themeMode: "dark" | "light";
  };
  client: {
    timeline:
      | "homeTimeline"
      | "localTimeline"
      | "hybridTimeline"
      | "globalTimeline";
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
    autoMotto: boolean;
    TLPostForm: boolean;
    iconSidebar: boolean;
    RUEmoji: Array<CustomEmoji | string>;
  };
}

const initialState: SettingsState = {
  theme: {
    lightTheme: "illuminating",
    darkTheme: "chillout",
  },
  userInfo: {
    login: false,
    userToken: "",
    instance: "",
    appname: "",
    userData: {} as MeDetailed,
    instanceMeta: {} as InstanceMetadata,
    themeMode: "dark",
  },
  client: {
    timeline: "homeTimeline",
    defaultVisibility: "public",
    defaultLocalOnly: false,
    autoMotto: true,
    TLPostForm: false,
    iconSidebar: false,
    RUEmoji: [],
  },
};

export const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    setTheme: (
      state,
      action: PayloadAction<{
        theme?: { lightTheme: string; darkTheme: string };
        themeMode?: "dark" | "light";
      }>
    ) => {
      if (action.payload.theme) {
        state.theme = action.payload.theme;
        document
          .querySelector(":root")
          ?.setAttribute(
            "theme",
            state.userInfo.themeMode === "dark"
              ? action.payload.theme.darkTheme
              : action.payload.theme.lightTheme
          );
      }
      if (action.payload.themeMode) {
        state.userInfo.themeMode = action.payload.themeMode;
        document
          .querySelector(":root")
          ?.setAttribute("mode", action.payload.themeMode);
        document
          .querySelector(":root")
          ?.setAttribute(
            "theme",
            state.userInfo.themeMode === "dark"
              ? state.theme.darkTheme
              : state.theme.lightTheme
          );
      }
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        login: boolean;
        userToken: string;
        instance: string;
        appname: string;
        userData: MeDetailed;
        instanceMeta: InstanceMetadata;
        themeMode: "dark" | "light";
      }>
    ) => {
      state.userInfo.login = action.payload.login;
      state.userInfo.userToken = action.payload.userToken;
      state.userInfo.instance = action.payload.instance;
      state.userInfo.appname = action.payload.appname;
      state.userInfo.userData = action.payload.userData;
      state.userInfo.instanceMeta = action.payload.instanceMeta;
      state.userInfo.themeMode = action.payload.themeMode;
    },
    setTimeline: (
      state,
      action: PayloadAction<{
        timeline:
          | "homeTimeline"
          | "localTimeline"
          | "hybridTimeline"
          | "globalTimeline";
      }>
    ) => {
      state.client.timeline = action.payload.timeline;
    },
    setClientSettings: (
      state,
      action: PayloadAction<{
        timeline:
          | "homeTimeline"
          | "localTimeline"
          | "hybridTimeline"
          | "globalTimeline";
        defaultVisibility: "public" | "home" | "followers" | "specified";
        defaultLocalOnly: boolean;
        autoMotto: boolean;
        TLPostForm: boolean;
        iconSidebar: boolean;
      }>
    ) => {
      state.client.timeline = action.payload.timeline;
      state.client.defaultVisibility = action.payload.defaultVisibility;
      state.client.defaultLocalOnly = action.payload.defaultLocalOnly;
      state.client.autoMotto = action.payload.autoMotto;
      state.client.TLPostForm = action.payload.TLPostForm;
      state.client.iconSidebar = action.payload.iconSidebar;
    },
    addRUEmoji: (state, action: PayloadAction<CustomEmoji | string>) => {
      if (typeof action.payload === "string") {
        state.client.RUEmoji = state.client.RUEmoji.filter(
          (emoji) =>
            (typeof emoji === "string" && emoji !== action.payload) ||
            typeof emoji !== "string"
        );
      } else {
        const e = action.payload as CustomEmoji;
        state.client.RUEmoji = state.client.RUEmoji.filter(
          (emoji) =>
            (typeof emoji !== "string" && emoji.name !== e.name) ||
            typeof emoji === "string"
        );
      }
      state.client.RUEmoji.unshift(action.payload);
      if (state.client.RUEmoji.length > 16) state.client.RUEmoji.pop();
    },
    setDefault: (state) => {
      state.theme = initialState.theme;
      state = initialState;
    },
  },
});

export const {
  setTheme,
  setUserInfo,
  setTimeline,
  setClientSettings,
  addRUEmoji,
  setDefault,
} = settingsSlice.actions;

export const settings = (state: RootState): SettingsState => state.settings;

export default settingsSlice.reducer;
