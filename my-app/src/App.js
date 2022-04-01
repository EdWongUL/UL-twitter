import "./App.css";
import { useState, useEffect } from "react";

import WhatsHappening from "./whatsHappening.js";
import Timeline from "./timeline.js";
import TrendContainer from "./trendContainer.js";
import LogIn from "./logIn.js";

function App() {
  // idx from zero, updates by 10 everytime we reach the bottom
  const [startingIdx, setStartingIdx] = useState(0);
  // boolean that determines when the bottom is (all tweets have
  // eventually been sent).
  const [bottom, setBottom] = useState(false);
  // boolean indicating if the log in screen is in use. Once the
  // user has logged in, 
  const [loggingIn, setLoggingIn] = useState(true);
  // update flag on when to fetch tweets and trends
  const [update, setUpdate] = useState(false);

  // This detects when we reach the bottom of the window
  // TODO Do we need debounce so we don't spam the server with requests?
  // TODO only add a listener when the user has logged in
  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  };

  useEffect(() => {
    window.addEventListener("scroll", trackScrolling);
    return () => window.removeEventListener("scroll", trackScrolling);
  });

  const trackScrolling = () => {
    const wrappedElement = document.getElementById("timeline");
    if (isBottom(wrappedElement)) {
      if (!bottom && !loggingIn) {
        setStartingIdx(startingIdx + 10);
        setUpdate(true);
      } else {
        console.log("reached bottom of the timeline");
        // TODO Add something that shows you've reached the bottom
      }
    }
  };

  return (
    <div className="App">
      <div
        className="logInContainer"
        style={
          loggingIn
            ? { opacity: "1", display: "block" }
            : { opacity: "0", display: "none" }
        }
      >
        <LogIn setLoggingIn={setLoggingIn} setUpdate={setUpdate} />
      </div>

      <div
        className="container"
        style={loggingIn ? { filter: "blur(4px)" } : { filter: "none" }}
      >
        {/*Invisible side bar*/}
        <div className="leftSideBar"></div>

        {/*Timeline middle bit*/}
        <div className="centerBar">
          <div className="homeHeader">Home</div>

          <WhatsHappening
            setStartingIdx={setStartingIdx}
            setBottom={setBottom}
            setUpdate={setUpdate}
          />
          <div id="timeline">
            <Timeline
              startingIdx={startingIdx}
              setBottom={setBottom}
              update={update}
              setUpdate={setUpdate}
            />
          </div>
        </div>

        {/*Search and topics/trends*/}
        <div className="rightSideBar">
          <form className="searchForm">
            <label className="searchLabel">
              <input
                className="searchInput"
                placeholder="Search Twitter"
                type="text"
              />
            </label>
          </form>
          <div className="trendsContainer">
            <div className="trendsHeader">
              <h5 className="trendsHeaderText">
                Topics you may be interested in
              </h5>
              <button className="trendSettings" />
            </div>
            <TrendContainer setUpdate={setUpdate} update={update} />
            <div className="showMore">
              <a href="#">Show more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
