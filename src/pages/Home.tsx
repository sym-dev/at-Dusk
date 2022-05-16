import React, { memo } from "react";

import { TimeLine } from "../components/TimeLine";
import { useSetHeader } from "../features/recoil/header";

export const Home = memo(function Fn() {
  useSetHeader("タイムライン", "タイムライン");
  return (
    <>
      <TimeLine />
    </>
  );
});
