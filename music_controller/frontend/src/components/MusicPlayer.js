import React, { useState } from 'react'
import {
 Grid,
 Typography,
 Card,
 IconButton,
 LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";


function MusicPlayer({ song }) {
 const skipSong = () => {
  console.log("skip")
  const requestOptions = {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  };
  fetch("/spotify/skip", requestOptions);
 }
 const pauseSong = () => {
  console.log("pause")
  const requestOptions = {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
  };
  fetch("/spotify/pause", requestOptions);
 }

 const playSong = () => {
  console.log("play")
  const requestOptions = {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
  };
  fetch("/spotify/play", requestOptions);
 }

 const songProgress = (song.time / song.duration) * 100
 return (
  <Card>
   <Grid container alignItems="center">
    <Grid item style={{ align: "center" }} xs={4}>
     <img src={song.image_url} style={{ width: '100%', height: "200" }} />
    </Grid>
    <Grid item align="center" xs={8}>
     <Typography component="h5" variant="h5">
      {song.title}
     </Typography>
     <Typography color="textSecondary" variant="subtitle1">
      {song.artist}
     </Typography>
     <div>
      <IconButton onClick={song.is_playing ? pauseSong : playSong}>
       {song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton onClick={skipSong}>
       Votes: {song.votes} / {song.votes_required}
       <SkipNextIcon />
      </IconButton>
     </div>
    </Grid>
   </Grid>
   <LinearProgress variant="determinate" value={songProgress} />
  </Card >
 );
}

export default MusicPlayer
