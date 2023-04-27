import React from "react";
import { TableContainer } from "./containers";
import Grid from "@mui/material/Grid";

import "./App.css";

function App() {
  return (
    <Grid container justifyContent="center" spacing={2} p={5}>
      <Grid item xs={10}>
        <TableContainer />
      </Grid>
    </Grid>
  );
}

export default App;
