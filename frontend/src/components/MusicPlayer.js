import React, { Component } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress, Button, Slider } from "@material-ui/core";


export default class MusicPlayer extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentSongNumber: 1,
            gameEnded: false,
            sliderValue: 50
          };
        this.renderResults = this.renderResults.bind(this);
        this.renderLeaderboard = this.renderLeaderboard.bind(this);
        this.renderSkipButton = this.renderSkipButton.bind(this);
    }
    leaderboard = [];

    setSliderValue = (event, newValue) => {
        this.setState({
            sliderValue: newValue
        });
    };

    renderLeaderboard(){
        return(
            <Grid container spacing={1} style={{overflowY: "auto", maxHeight: "350px"}}>
                <Typography align="center" component="h5" variant="h5" color="textSecondary">
                    {this.leaderboard.length==0 ? "No Songs Rated": "Last Played"}
                </Typography>
                {this.leaderboard.map((typoProps, index) => (
                    <Grid container>
                        <Card>
                            <Grid item xs={4}>
                                <img src={typoProps.image} height="33%" width="33%"></img>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography key={index} component="h5" variant="h5">
                                    {typoProps.name} - {typoProps.score}
                                </Typography>
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </Grid> 
            
        )
    }

    renderResults() {
        return(
            <Grid container spacing={1} alignItems="center">
                <Grid item align="center" xs={12}>
                    <Typography variant="h3" compact="h3">
                        Game Over!
                    </Typography>
                </Grid>
                <Grid item align="center" xs={12}>
                    {this.renderLeaderboard()}
                </Grid>
            </Grid>
          );
    }

    renderSkipButton() {
        return(
            <Button variant="contained" color="secondary" onClick={() => this.skipSong()}>
                Skip
            </Button>
        );
    }

    skipSong(){
        this.setState({
            sliderValue: 50
        });
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                score: 404,
              }),
        };
        fetch("/spotify/skip", requestOptions);
    }

    submitVote(){
        this.leaderboard.push({image: this.props.image_url, name: this.props.title, score: this.state.sliderValue});
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                score: this.state.sliderValue,
              }),
        };
        fetch("/spotify/skip", requestOptions);

        if (this.props.checkHost === "true"){
            fetch("/api/get-votes")
            .then((response) => response.json())
            .then((data) => {
            console.log(data.vote_average)
            //to do: show the value on the frontend
            });
        }
        this.setState({
            currentSongNumber: this.state.currentSongNumber + 1,
            sliderValue: 50
          });
        if (this.state.currentSongNumber == this.props.votes_required){
            this.setState({
                gameEnded: true
            });
        }
    }
    

    pauseSong(){
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/pause", requestOptions);
    }

    playSong(){
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/play", requestOptions);
    }

    render() {
        const songProgress = (this.props.time / this.props.duration) * 100;
        if (this.state.gameEnded){
            return this.renderResults();
          }
        return (
            <Grid container spacing={1}>
                <Card>
                    <Grid container alignItems="center">
                        <Grid item align="center" xs={4}>
                            <img src={this.props.image_url} height="100%" width="100%"></img>
                        </Grid>
                        <Grid item align="center" xs={4}>
                            <Typography component="h5" variant="h5">{this.props.title} </Typography>
                            <Typography color="textSecondary" variant="subtitle1">{this.props.artist}</Typography>
                            <div>
                                {/* <Button variant="contained" color="primary" onClick={() => {
                                this.props.is_playing ? this.pauseSong() : this.playSong();}}>
                                    {this.props.is_playing ? "Pause" : "Play"}
                                </Button> */}

                                {this.props.checkHost === "true" ? this.renderSkipButton() : null}
                                <Button variant="contained" color="primary" onClick={() => this.submitVote()}>
                                    Submit
                                </Button>
                                
                                
                                <Typography component="h5" variant="h5">{this.state.currentSongNumber} / {this.props.votes_required} {this.props.checkHost} {this.props.checkStarted} Songs</Typography>
                            </div>
                        </Grid>
                        <Grid item align="center" xs={4}>
                            {this.renderLeaderboard()}
                        </Grid>
                        
                    </Grid>
                    <LinearProgress variant="determinate" value={songProgress} />
                </Card>
                <Grid item xs={12} align="center">
                    <Slider defaultValue={this.state.sliderValue} value={this.state.sliderValue} aria-label="score" valueLabelDisplay="auto" onChange={this.setSliderValue}></Slider>
                    <Typography component="h5" variant="h5">Rating: {this.state.sliderValue}</Typography>
                </Grid>
                
            </Grid>
        )
    }
}