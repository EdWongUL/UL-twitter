import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LeftPanel from "./leftPanel/leftPanel.js";
import WhatsHappening from "./centerPanel/whatsHappening.js";
import Timeline from "./centerPanel/timeline.js";
import TrendContainer from "./rightPanel/trendContainer.js";
import LogIn from "./centerPanel/logIn.js";
import Profile from "./profile.js";
import ProfileLikes from "./profileLikes.js";
import Center from "./center.js";

function App() {
  // idx from zero, updates by 10 everytime we reach the bottom
  const [startingIdx, setStartingIdx] = useState(0);
  // boolean that determines when the bottom is (all tweets have
  // eventually been sent).
  const [bottom, setBottom] = useState(false);
  // boolean indicating if the log in screen is in use.
  const [loggingIn, setLoggingIn] = useState(false);
  const [logInBackground, setLogInBackground] = useState(true);
  // update flag on when to fetch tweets and trends
  const [update, setUpdate] = useState(false);
  const [displayPic, setDisplayPic] = useState(
    "https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"
  );
  const [handle, setHandle] = useState("");
  const [guest, setGuest] = useState(false);
  const [scrollTrack, setScrollTrack] = useState(false);

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
        setDisplayPic(resJ.dp);
        setHandle(resJ.handle);
        setGuest(resJ.guest);
        setLogInBackground(false);
        setUpdate(true);
        setScrollTrack(true);
      } else {
        // user has not logged in before (as user or guest)
        setLoggingIn(true);
      }
    } catch (e) {
      // no connection to server right?
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <LogIn
          loggingIn={loggingIn}
          setLoggingIn={setLoggingIn}
          setUpdate={setUpdate}
          setDisplayPic={setDisplayPic}
          setGuest={setGuest}
          setHandle={setHandle}
          setLogInBackground={setLogInBackground}
          setScrollTrack={setScrollTrack}
        />

        <div
          className="container"
          style={logInBackground ? { filter: "blur(4px)" } : { filter: "none" }}
        >
          <LeftPanel />

          <Routes>
            <Route
              index
              element={
                <Center
                  startingIdx={startingIdx}
                  setStartingIdx={setStartingIdx}
                  bottom={bottom}
                  setBottom={setBottom}
                  update={update}
                  setUpdate={setUpdate}
                  loggingIn={loggingIn}
                  setLoggingIn={setLoggingIn}
                  logInBackground={logInBackground}
                  setLogInBackground={setLogInBackground}
                  scrollTrack={scrollTrack}
                  setScrollTrack={setScrollTrack}
                  displayPic={displayPic}
                  guest={guest}
                  handle={handle}
                />
              }
            />
            <Route
              path="profile/*"
              element={
                <Profile
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
                  logInBackground={logInBackground}
                  scrollTrack={scrollTrack}
                />
              }
            />
          </Routes>

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
      </BrowserRouter>
    </div>
  );
}

export default App;
