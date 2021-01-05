import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

import {
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

function Room({ roomCode, leaveRoomCallback }) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuessCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const history = useHistory();
  const [song, setSong] = useState({});

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      leaveRoomCallback();
      history.push("/");
    });
  }
  const getData = async () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback();
          history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip)
        setGuessCanPause(data.guest_can_pause)
        setIsHost(data.is_host)
      })
    if (isHost) {
      authenticateSpotify();
    }
  }

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        console.log("IsAuthenticated before " + data.status);
        setSpotifyAuthenticated(data.status)
        console.log("IsAuthenticated after " + data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      })
  }

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json()
        }
      })
      .then((data) => {
        console.log(data);
        setSong(data);
      })
  }
  const pauseSong = () => {
    console.log("pause")
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch('/spotify/pause', requestOptions).then((response) => console.log("response :" + response.json()));
    console.log("done2")
  }

  const playSong = () => {
    console.log("play")
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch('/spotify/play', requestOptions);
    console.log("done1")
  }

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={() => setShowSetting(!showSetting)}>Settings</Button>
      </Grid>
    )
  }
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesTS={votesToSkip}
            guestCP={guestCanPause}
            roomCode={roomCode}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSetting(!showSetting)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }
  useEffect(() => {
    getData();
  }, [roomCode, getData])

  useEffect(() => {
    const timer = setInterval(() => {
      getCurrentSong();
    }, 1000);
    // clearing interval
    return () => clearInterval(timer);
  }, [])

  if (showSetting) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid>

      <MusicPlayer song={song} />
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >Leave Room</Button>
      </Grid>
    </Grid >
  );

}

export default Room
