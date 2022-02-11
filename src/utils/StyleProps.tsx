export const useStyleProps = (): Record<
  string,
  Record<string, string | Record<string, string>>
> => {
  return {
    AlphaButton: {
      bgColor: "var(--alpha50)",
      _hover: {
        bgColor: "var(--alpha600)",
      },
      _active: {
        bgColor: "var(--alpha400)",
      },
    },
    PrimaryButton: {
      bgColor: "var(--primary)",
      _hover: {
        bgColor: "var(--primary_darker)",
      },
      _active: {
        bgColor: "var(--primary_darker)",
      },
    },
    DisabledBgColor: {
      bgColor: "var(--alpha50)",
      _hover: {
        bgColor: "var(--alpha50)",
      },
      _active: {
        bgColor: "var(--alpha50)",
      },
    },
  };
};
