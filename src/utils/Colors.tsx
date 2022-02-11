export const useColors = (): Record<string, string> => {
  const alpha50 = "var(--alhpa50)";
  const alpha200 = "var(--alhpa200)";
  const alpha400 = "var(--alhpa400)";
  const alpha600 = "var(--alhpa600)";
  const baseColor = "var(--base)";
  const panelColor = "var(--panel)";
  const primaryColor = "var(--primary)";
  const primaryDarkerColor = "var(--primary_darker)";
  const secondaryColor = "var(--secondary)";
  const textColor = "var(--text)";
  const headerTextColor = "var(--headerText)";
  const borderColor = "var(--secondary)";
  return {
    alpha50: alpha50,
    alpha200: alpha200,
    alpha400: alpha400,
    alpha600: alpha600,
    baseColor: baseColor,
    panelColor: panelColor,
    primaryColor: primaryColor,
    primaryDarkerColor: primaryDarkerColor,
    secondaryColor: secondaryColor,
    textColor: textColor,
    headerTextColor: headerTextColor,
    borderColor: borderColor,
  };
};
