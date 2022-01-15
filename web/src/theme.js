const themeStyles = (theme) => ({
  colorPrimary: theme === "light" ? "#333333" : "#F3F3F3",
  colorSecondary: "#858585",
  bg: theme === "light" ? "#F3F3F3" : "#333333",
  accentLight: "#007ACC",
  accentDark: "#005B99",
});

export default themeStyles;
