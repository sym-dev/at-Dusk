export const useColors = (): Record<string, string> => {
  const alpha50 = "var(--alpha50)";
  const alpha200 = "var(--alpha200)";
  const alpha400 = "var(--alpha400)";
  const alpha600 = "var(--alpha600)";
  const base = "var(--base)";
  const baseThin = "var(--base_thin)";
  const baseThick = "var(--base_thick)";
  const baseAlpha = "var(--base_alpha)";
  const panel = "var(--panel)";
  const primary = "var(--primary)";
  const primaryThin = "var(--primary_thin)";
  const primaryThick = "var(--primary_thick)";
  const secondary = "var(--secondary)";
  const secondaryThin = "var(--secondary_thin)";
  const secondaryThick = "var(--secondary_thick)";
  const text = "var(--text)";
  const textPrimary = "var(--text_primary)";
  const textSecondary = "var(--text_secondary)";
  const textInverse = "var(--text_inverse)";
  const backdrop = "var(--backdrop)";
  return {
    alpha50,
    alpha200,
    alpha400,
    alpha600,
    base,
    baseThin,
    baseThick,
    baseAlpha,
    panel,
    primary,
    primaryThin,
    primaryThick,
    secondary,
    secondaryThin,
    secondaryThick,
    text,
    textPrimary,
    textSecondary,
    textInverse,
    backdrop,
  };
};
