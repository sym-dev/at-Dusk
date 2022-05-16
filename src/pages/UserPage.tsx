import React, { memo } from "react";
import { useParams } from "react-router-dom";

import { Avatar } from "../components/Avatar";
import { Loading } from "../components/ui/Loading";
import { useSetHeader } from "../features/recoil/header";
import { useGetUserData } from "../features/swr/useGetUserData";

export const UserPage = memo(function Fn() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetUserData(id);
  useSetHeader(
    isLoading ? (
      <Loading small />
    ) : error ? (
      <>{id}</>
    ) : data.name ? (
      data.name
    ) : (
      data.username
    ),
    isLoading || error ? (id as string) : data.name ? data.name : data.username
  );
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <>{error.message}</>
      ) : (
        <>
          <Avatar user={data} />
        </>
      )}
    </>
  );
});
