import "./App.css";
import { useState, useEffect } from "react";

import WhatsHappening from "./whatsHappening.js";
import Timeline from "./timeline.js";
import TrendContainer from "./trendContainer.js";

function App() {
  const [startingIdx, setStartingIdx] = useState(0);
  const [bottom, setBottom] = useState(false);

  // This detects when we reach the bottom of the window
  // TODO Do we need debounce so we don't spam the server with requests?
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
      if (!bottom) {
        setStartingIdx(startingIdx + 10);
      } else {
        console.log("reached bottom of the timeline");
        // Add something that shows you've reached the bottom
      }
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/*Invisible side bar*/}
        <div className="leftSideBar"></div>

        {/*Timeline middle bit*/}
        <div className="centerBar">
          <div className="homeHeader">Home</div>

          <WhatsHappening />
          <div id="timeline">
            <Timeline
              startingIdx={startingIdx}
              setStartingIdx={setStartingIdx}
              setBottom={setBottom}
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
            <TrendContainer />
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
