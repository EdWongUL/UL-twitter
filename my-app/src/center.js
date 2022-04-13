import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WhatsHappening from "./centerPanel/whatsHappening.js";
import Timeline from "./centerPanel/timeline.js";
import TrendContainer from "./rightPanel/trendContainer.js";
import LogIn from "./centerPanel/logIn.js";
import Profile from "./profile.js";

export default function Center(props) {
  return (
    <div className="centerBar">
      <div className="homeHeader">Home</div>

      <WhatsHappening
        setStartingIdx={props.setStartingIdx}
        setBottom={props.setBottom}
        setUpdate={props.setUpdate}
        displayPic={props.displayPic}
        guest={props.guest}
        setLoggingIn={props.setLoggingIn}
        handle={props.handle}
        setLogInBackground={props.setLogInBackground}
        setScrollTrack={props.setScrollTrack}
      />
        <Timeline
          id="mainTimeline"
          startingIdx={props.startingIdx}
          setStartingIdx={props.setStartingIdx}
          bottom={props.bottom}
          setBottom={props.setBottom}
          update={props.update}
          setUpdate={props.setUpdate}
          handle={props.handle}
          loggingIn={props.loggingIn}
          setLoggingIn={props.setLoggingIn}
          guest={props.guest}
          logInBackground={props.logInBackground}
          scrollTrack={props.scrollTrack}
        />
    </div>
  );
}
