import { useState } from "react";
import Timeline from "./centerPanel/timeline.js";
import { Route, Routes, Link } from "react-router-dom";
import ProfileHeader from "./profileHeader.js";
import ProfileLikes from "./profileLikes.js";

export default function Profile(props) {
  return (
    <div className="centerBar">
      <ProfileHeader />

      <nav>
        <ul>
          <Link to="">
            <li> Timeline </li>
          </Link>
          <Link to="profileLikes">
            <li> Profile Likes </li>
          </Link>
        </ul>
      </nav>
      <Routes>
        <Route
          index
          element={
            // <p>fhgus</p>
            <Timeline
              id = "profileTimeline"
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
          }
        />
        <Route path="profileLikes" element={<ProfileLikes />} />
      </Routes>
    </div>
  );
}
