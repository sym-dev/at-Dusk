import { Center } from "@chakra-ui/layout";
import React, { memo, useEffect, useState } from "react";
import { useLocation, useMatch } from "react-router";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { clearNoteDetails } from "../features/noteDetailsSlice";
import { setAttr } from "../features/settingsSlice";
import { clearFF, clearUserData, user } from "../features/userSlice";

import { useSocketOpen } from "./SocketContext";

export const CheckLocation: React.VFC<{ children: React.ReactNode }> = memo(
  function Fn({ children }) {
    const userData = useAppSelector(user);
    const [username, updateUsername] = useState("");
    const dispatch = useAppDispatch();
    const location = useLocation();
    const userMatch = useMatch("/user/:id");
    const { isSocketOpen } = useSocketOpen();
    useEffect(() => {
      dispatch(setAttr());
    }, [dispatch]);
    useEffect(() => {
      if (userData.id)
        updateUsername(
          `@${userData.username}${userData.host ? `@${userData.host}` : ""}`
        );
    }, [userData]);
    useEffect(() => {
      dispatch(clearNoteDetails());
      if (userMatch && username) {
        if (userMatch.params.id && userMatch.params.id !== username) {
          updateUsername(userMatch.params.id);
          dispatch(clearUserData()); //userpage -> userpage
        }
      } else {
        if (!location.pathname.startsWith(`/user/${username}`)) {
          dispatch(clearUserData()); //userpage -> otherpage
        } else if (location.pathname !== `/user/${username}`) {
          dispatch(clearFF());
        }
      }
    }, [location.pathname, dispatch, userMatch, username]);
    return (
      <>
        {isSocketOpen ? (
          children
        ) : (
          <Center>
            <Loading />
          </Center>
        )}
      </>
    );
  }
);
