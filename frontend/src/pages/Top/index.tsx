import React from "react";
import "./index.scss";
import { Card, Grid, Typography, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

type Prop = {};

const cardStyle = {
  position: "absolute" as "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const lButtonStyle = {
  position: "absolute" as "absolute",
  top: "70%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: 200,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "20px",
};

const rButtonStyle = {
  position: "absolute" as "absolute",
  top: "70%",
  left: "30%",
  transform: "translate(-50%, -50%)",
  width: 200,
  border: "2px solid #000",
  boxShadow: 24,
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
  const history = useHistory();
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <Card sx={cardStyle}>
          <Typography sx={titleStyle}>どこでも麻雀卓</Typography>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="success"
          variant="contained"
          sx={lButtonStyle}
          href="/room_host"
        >
          ルームを作る
        </Button>
        <Button
          color="success"
          variant="contained"
          sx={rButtonStyle}
          href="/enter_room_client"
        >
          ルームに入る
        </Button>
      </Grid>
    </Grid>
  );
};
