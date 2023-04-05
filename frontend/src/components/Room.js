import React, { Component } from "react";
import { Grid, Button, Typography, Slider } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 5,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      gameStarted: false,
      spotifyAuthenticated: false,
      song: {}
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.updateGameStarted = this.updateGameStarted.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderGame = this.renderGame.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getRoomDetails();
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAccessToken() {
    return fetch("/api/token").then((response) => console.log(response));
  }

  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost){
          this.authenticateSpotify();
        }
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getCurrentSong() {
    fetch('/spotify/current-song').then((response) => {
      if (!response.ok) {
        return {};
      } else {
        return response.json();
      }
    }).then((data) => this.setState({song: data}));
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateGameStarted(value){
    this.setState({
      gameStarted: value,
    });
  }

  renderGame(){
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Spoofipy
          </Typography>
        </Grid>
        {/* <Player accessToken={} /> */}
        <MusicPlayer {...this.state.song} checkHost={this.state.isHost.toString()} checkStarted={this.state.gameStarted.toString()} />

        {/* <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="on"></Slider> */}

        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" size="large" onClick={() => this.updateGameStarted(false)}>
            End Game
          </Button>
        </Grid>

        <Grid item xs={4} align="center">
          <Typography variant="h6" component="h6">Code: {this.roomCode}</Typography>
        </Grid>
        {/* <Grid item xs={4} align="center">
          <Typography variant="h6" component="h6">Songs: {this.state.votesToSkip}</Typography>
        </Grid>
        <Grid item xs={4} align="center">
          <Typography variant="h6" component="h6">Players: N/A</Typography>
        </Grid> */}
      </Grid>
    );
  }

  updateShowSettings(value){
    this.setState({
      showSettings: value,
    });
  }

  renderSettings(){
    return (
      <Grid container spacing={8}>
        <Grid item xs={12} align="center">
          <CreateRoomPage update={true} 
          votesToSkip={this.state.votesToSkip} 
          guestCanPause={this.state.guestCanPause} 
          roomCode={this.roomCode} 
          updateCallback={this.getRoomDetails}>
          </CreateRoomPage>
        </Grid>
        <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>
          Close
        </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton(){
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button variant="text" color="primary" onClick={() => this.updateShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" size="large" onClick={() => this.updateGameStarted(true)}>
          Start Game
        </Button>
      </Grid>
    </Grid>
    );
  }

  render() {
    if (this.state.gameStarted || !this.state.isHost){
      return this.renderGame();
    }
    if (this.state.showSettings){
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Spoofipy
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">Code: {this.roomCode}</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">Songs: {this.state.votesToSkip}</Typography>
        </Grid>
        <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">Game Mode: {this.state.guestCanPause.toString() === "true" ? "Single Player" : "Multiplayer"}</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">{this.state.isHost.toString() === "true" ? "You are the host!" : "Waiting for host..."}</Typography>
        </Grid>
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>Leave Room</Button>
        </Grid>
      </Grid>
    );
  }
}