import React from "react";
import Graph from "./Graph";
import { Theme, ThemeOptions, ThemeProvider } from "@material-ui/core/styles";
import { Palette } from "@material-ui/core/styles/createPalette";
import { createMuiTheme } from "@material-ui/core";

interface IPalette extends Palette {}

export interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
}

export interface ITheme extends Theme {
  palette: IPalette;
}

export const customTheme = {
  palette: {
    primary: {
      main: "#34c240"
    }
  }
};

function App() {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          ...customTheme.palette
        }
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <Graph />
    </ThemeProvider>
  );
}

export default App;
