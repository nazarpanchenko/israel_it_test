import React from "react";
import { Provider } from "react-redux";
import store from "./state/store";
import { TableContainer } from "./containers";
import Grid from "@mui/material/Grid";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Grid container justifyContent="center" spacing={2} p={5}>
        <Grid item xs={12} md={9}>
          <TableContainer />
        </Grid>
      </Grid>
    </Provider>
  );
}

export default App;
