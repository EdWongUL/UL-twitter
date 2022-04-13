import { useState, useEffect } from "react";
import "./login.css";

import birdyBlue from "../imgs/birdyBlue.svg";

export default function LogIn(props) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // true if the guest button was pressed
    const guestBool = e.target.value !== undefined;
    let username;
    let password;
    if (guestBool) {
      username = "";
      password = "";
    } else {
      username = e.target.username.value;
      password = e.target.password.value;
    }

    const res = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        guest: guestBool,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 500) {
      setMessage("Error connecting to server");
      console.log("no connection to server");
      setTimeout(() => setMessage(""), 5000);
    } else {
      const loginRes = await res.json();
      console.log(loginRes);
      if (loginRes.login) {
        console.log("Server accepted username and password");
        props.setLoggingIn(false);
        // props.setUpdate(true);
        props.setLogInBackground(false);
        props.setGuest(false);
        props.setHandle(loginRes.handle);
        props.setDisplayPic(loginRes.dp);
        props.setScrollTrack(true);
      } else if (loginRes.guest) {
        console.log("Logging in as guest");
        props.setLoggingIn(false);
        props.setUpdate(true);
        props.setGuest(true);
        props.setLogInBackground(false);
        props.setScrollTrack(true);
      } else {
        setMessage("Incorrect username/password.");
        console.log("Incorrect username/password.");
        setTimeout(() => setMessage(""), 5000);
      }
    }
  };

  return (
    <div
      className="logInContainer"
      style={
        props.loggingIn
          ? { animation: "fadeIn 1s forwards", display: "block" }
          : { display: "none" }
      }
    >
      <div className="logInRel">
        <div className="guestButtonContainer">
          <input
            type="submit"
            className="guestButton"
            value="X"
            onClick={handleSubmit}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="logInAbs">
            <div className="birdyBlue">
              <img src={birdyBlue} />
            </div>
            <div className="logInHeader">Sign in to Twotter</div>
            <input
              type="text"
              id="username"
              name="username"
              className="username"
              placeholder="Username"
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              className="password"
              placeholder="Password"
              required
            />
            <div className="logInButtonContainer">
              <input type="submit" className="logInButton" value="Log In" />
            </div>
            <div className="logInMessage">{message}</div>
          </div>
        </form>
      </div>
    </div>
  );
}
