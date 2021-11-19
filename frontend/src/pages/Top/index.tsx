import React from "react";
import "./index.scss";
import { Card, Box, Grid, Typography, Button } from "@mui/material";

type Prop = {};
const logoStyle = {
  position: "absolute" as "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
};
const lButtonStyle = {
  position: "absolute" as "absolute",
  top: "80%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: 250,
  border: "2px solid #000",
  p: 4,
  fontSize: "20px",
};

const rButtonStyle = {
  position: "absolute" as "absolute",
  top: "80%",
  left: "30%",
  transform: "translate(-50%, -50%)",
  width: 250,
  border: "2px solid #000",
  p: 4,
  fontSize: "20px",
};

const titleStyle = {
  fontSize: "20px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
};

export const Top: React.FC<Prop> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <div className="Logo__container">
          <img className="Logo__image" src="./logo512.png" alt="" />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="success"
          variant="contained"
          sx={lButtonStyle}
          href="/room_host"
        >
          <img className="icon" src="./images/home.png" alt="" />
          ルームを作る
        </Button>
        <Button
          color="success"
          variant="contained"
          sx={rButtonStyle}
          href="/enter_room_client"
        >
          <img className="icon" src="./images/enter.png" alt="" />
          ルームに入る
        </Button>
      </Grid>
    </Grid>
  );
};
