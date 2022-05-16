import { useMemo } from "react";

import { useGetLogin } from "../features/recoil/loginState";

interface StreamBody {
  id: string;
  channel: string;
}

export interface StreamObject {
  type: string;
  body: StreamBody;
}

export interface DisconnectObject {
  type: string;
  body: {
    id: string;
  };
}

interface Props {
  type: "api" | "connect" | "disconnect";
  id?: string;
  endpoint?: string;
  channel?: string;
  data?: Record<string, unknown>;
}

export const useAPIObject = (
  props: Props
): string | StreamObject | DisconnectObject => {
  const { token } = useGetLogin();
  return useMemo(
    () =>
      props.type === "api"
        ? JSON.stringify({
            i: token,
            ...props.data,
          })
        : props.type === "connect"
        ? ({
            type: props.type,
            body: {
              id: props.id,
              channel: props.channel,
            },
          } as StreamObject)
        : ({
            type: props.type,
            body: {
              id: props.id,
            },
          } as DisconnectObject),
    [props, token]
  );
};
