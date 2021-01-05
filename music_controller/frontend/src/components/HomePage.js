
import React, { useEffect, useState, useCallback } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

const RenderHomePage = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">House Party</Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>Join a Room</Button>
          <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

function HomePage() {

  const [roomCode, setRoomCode] = useState(null);

  const getRoomCode = async () => {
    await fetch('/api/user-in-room')
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code)
      });
    return
  }

  const clearRoomCode = () => {
    setRoomCode(null)
  }
  const updateRoomCode = (a) => {
    setRoomCode(a)
    return a
  }

  useEffect(() => {
    getRoomCode();
  }, [])
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">{roomCode ? <Redirect to={`/room/${roomCode}`} /> : <RenderHomePage />}</Route>
          <Route path="/join"><RoomJoinPage updateRoomCode={updateRoomCode} /></Route>
          <Route path="/create" ><CreateRoomPage updateRoomCode={updateRoomCode} /></Route>
          <Route path="/room/:roomCode"><Room roomCode={roomCode} leaveRoomCallback={clearRoomCode} /></Route>
        </Switch>
      </Router>
    </>

  )
}


export default HomePage
