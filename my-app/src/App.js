import "./App.css";
import { useState, useEffect } from "react";
import ReactCSSTransitionGroup from "react-transition-group";

import LeftPanel from "./leftPanel/leftPanel.js";
import WhatsHappening from "./centerPanel/whatsHappening.js";
import Timeline from "./centerPanel/timeline.js";
import TrendContainer from "./rightPanel/trendContainer.js";
import LogIn from "./centerPanel/logIn.js";

function App() {
  // idx from zero, updates by 10 everytime we reach the bottom
  const [startingIdx, setStartingIdx] = useState(0);
  // boolean that determines when the bottom is (all tweets have
  // eventually been sent).
  const [bottom, setBottom] = useState(false);
  // boolean indicating if the log in screen is in use.
  const [loggingIn, setLoggingIn] = useState(true);
  // update flag on when to fetch tweets and trends
  const [update, setUpdate] = useState(false);
  const [displayPic, setDisplayPic] = useState(
    "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"
  );
  const [handle, setHandle] = useState("");
  const [guest, setGuest] = useState(false);

  // check if the client has already logged in before
  useEffect(async () => {
    try {
      const res = await fetch("http://localhost:3000/relog", {
        method: "GET",
        credentials: "include",
      });
      const resJ = await res.json();
      if (resJ.login || resJ.guest) {
        // user has already logged in with their credentials
        setLoggingIn(false);
        setDisplayPic(resJ.dp);
        setHandle(resJ.handle);
        setGuest(resJ.guest);
        setUpdate(true);
      } else {
        // user has not logged in before (as user or guest)
        setLoggingIn(true);
      }
    } catch (e) {
      // no connection to server right?
      setLoggingIn(true);
    }
  }, []);

  return (
    <div className="App">
      <div
        className="logInContainer"
        style={
          loggingIn
            ? // ? { animation: "fadeIn 1s forwards" }
              { display: "block" }
            : { animation: "fadeOut 1s forwards" }
        }
      >
        <LogIn
          setLoggingIn={setLoggingIn}
          setUpdate={setUpdate}
          setDisplayPic={setDisplayPic}
          setGuest={setGuest}
          setHandle={setHandle}
        />
      </div>

      <div
        className="container"
        style={loggingIn ? { filter: "blur(4px)" } : { filter: "none" }}
      >
        {/*Invisible side bar*/}
        <LeftPanel />

        {/*Timeline middle bit*/}
        <div className="centerBar">
          <div className="homeHeader">Home</div>

          <WhatsHappening
            setStartingIdx={setStartingIdx}
            setBottom={setBottom}
            setUpdate={setUpdate}
            displayPic={displayPic}
            guest={guest}
            setLoggingIn={setLoggingIn}
            handle={handle}
          />
          <div id="timeline">
            <Timeline
              startingIdx={startingIdx}
              setStartingIdx={setStartingIdx}
              bottom={bottom}
              setBottom={setBottom}
              update={update}
              setUpdate={setUpdate}
              handle={handle}
              loggingIn={loggingIn}
              setLoggingIn={setLoggingIn}
              guest={guest}
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
                onSubmit={(e) => {
                  e.preventDefault();
                }}
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
