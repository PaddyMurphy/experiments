import { MantineProvider, createTheme } from "@mantine/core";
import { HashRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import App from "./App";

const theme = createTheme({
  primaryColor: "cyan",
  defaultRadius: "md",
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#060815",
    ],
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* HashRouter: deep links work on GitHub Pages without server rewrites (see vite base './'). */}
    <MantineProvider defaultColorScheme="dark" forceColorScheme="dark" theme={theme}>
      <HashRouter>
        <App />
      </HashRouter>
    </MantineProvider>
  </StrictMode>,
);
