import { Global, css } from "@emotion/react";
import React, { memo } from "react";

const focusVisibleStyle = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

export const FocusVisible: React.FC = memo(function Fn() {
  return (
    <>
      <Global styles={focusVisibleStyle} />
    </>
  );
});
