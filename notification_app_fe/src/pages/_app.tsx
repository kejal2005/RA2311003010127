import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import Log from "logging-middleware";

/**
 * Global App Component Wrapper
 * Provides Material UI theme to entire application
 * Initializes global styles
 */
function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    Log(
      "frontend",
      "info",
      "middleware",
      "Next.js application initialized with Material UI theme provider"
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
