import "./App.css";
import { useState, useEffect } from "react";
import ReactCSSTransitionGroup from "react-transition-group";

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
  const [displayPic, setDisplayPic] = useState(
    "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"
  );

  // check if the client has already logged in before
  useEffect(async () => {
    const res = await fetch('http://localhost:3000/relog', {
      method: "GET",
      credentials: "include",
    });
    const resJ = await res.json();
    if (!resJ.login) {
      // not already logged in
      setLoggingIn(true)
    } else {
      setLoggingIn(false)
      setUpdate(true);
      setDisplayPic(resJ.dp)
    }
  }, []);

  return (
    <div className="App">
      <div
        className="logInContainer"
        style={loggingIn ? {display: "block"} : { animation: "fadeOut 1s forwards" }}
      >
        <LogIn
          setLoggingIn={setLoggingIn}
          setUpdate={setUpdate}
          setDisplayPic={setDisplayPic}
        />
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
            displayPic={displayPic}
          />
          <div id="timeline">
            <Timeline
              startingIdx={startingIdx}
              setStartingIdx={setStartingIdx}
              bottom={bottom}
              setBottom={setBottom}
              update={update}
              setUpdate={setUpdate}
              loggingIn={loggingIn}
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
