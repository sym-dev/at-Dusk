import { ReactElement, useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const headerState = atom<ReactElement | string>({
  key: "headerState",
  default: "",
});

export const useSetHeader = (elm: ReactElement | string, title: string) => {
  const setHeader = useSetRecoilState(headerState);
  useEffect(() => {
    document.title = `${title} | at Dusk.`;
    setHeader(elm);
  }, [setHeader, elm, title]);
};

export const useGetHeader = () => {
  return useRecoilValue(headerState);
};
