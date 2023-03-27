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
    }

    setSliderValue = (event, newValue) => {
        this.setState({
            sliderValue: newValue
        });
    };


    showResults() {
        this.setState({
            gameEnded: true
        });
    }

    renderResults() {
        return(
            <Grid container spacing={1} alignItems="center">
                <Grid item align="center" xs={12}>
                    <Typography variant="h3" compact="h3">
                        Game Over!
                    </Typography>
                </Grid>
            </Grid>
          );
    }

    skipSong(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/skip", requestOptions);
    }

    submitVote(){
        this.setState({
            currentSongNumber: this.state.currentSongNumber + 1,
          });
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch("/spotify/skip", requestOptions);
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
                        <Grid item align="center" xs={8}>
                            <Typography component="h5" variant="h5">{this.props.title}</Typography>
                            <Typography color="textSecondary" variant="subtitle1">{this.props.artist}</Typography>
                            <div>
                                {/* <Button variant="contained" color="primary" onClick={() => {
                                this.props.is_playing ? this.pauseSong() : this.playSong();}}>
                                    {this.props.is_playing ? "Pause" : "Play"}
                                </Button> */}
                                <Button variant="contained" color="secondary" onClick={() => this.skipSong()}>
                                    Skip
                                </Button>
                                <Button variant="contained" color="primary" onClick={this.state.currentSongNumber != this.props.votes_required ? () => this.submitVote() : () => this.showResults()}>
                                    Submit
                                </Button>
                                <Typography component="h5" variant="h5">{this.state.currentSongNumber} / {this.props.votes_required} Songs</Typography>
                            </div>
                        </Grid>
                        
                    </Grid>
                    <LinearProgress variant="determinate" value={songProgress} />
                </Card>
                <Grid item xs={12} align="center">
                    <Slider defaultValue={this.state.sliderValue} aria-label="score" valueLabelDisplay="auto" onChange={this.setSliderValue}></Slider>
                    <Typography component="h5" variant="h5">Rating: {this.state.sliderValue}</Typography>
                </Grid>
            </Grid>
        )
    }
}