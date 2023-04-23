import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import { Grid, Typography} from "@material-ui/core";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        
        <div style={{ 
          backgroundImage: "url('/static/images/background.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center center", 
          height: "100vh"
        }}>
          <div class="center">
            <HomePage />
          </div>    
        </div>
          
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);