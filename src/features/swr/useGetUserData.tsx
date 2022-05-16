import { UserDetailed } from "misskey-js/built/entities";
import useSWR from "swr";

import { useAppSelector } from "../../app/hooks";
import { useAPIObject } from "../../utils/useAPIObject";
import { settings } from "../rtk/settingsSlice";

export const useGetUserData = (
  id: string | undefined
): { data: UserDetailed; error: Error; isLoading: boolean } => {
  const userInfo = useAppSelector(settings).userInfo;
  const body = useAPIObject({
    type: "api",
    data: {
      username: id?.split("@")[1].split("/")[0],
      host: id?.split("@")[2] ? id?.split("@")[2] : null,
    },
  }) as string;
  const fetcher = async (path: string) => {
    const res = await fetch(`https://${userInfo.instance}/api${path}`, {
      method: "POST",
      body: body,
    });
    if (!res.ok) {
      const text = await res.json();
      const error = new Error(await text.error.message);
      error.name = await text.error.code;
      throw error;
    }
    return res.json();
  };
  const { data, error } = useSWR(["/users/show", id], fetcher);
  return { data, error, isLoading: !error && !data };
};
