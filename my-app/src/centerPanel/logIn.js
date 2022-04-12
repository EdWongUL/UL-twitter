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
        props.setUpdate(true);
        props.setGuest(false);
        props.setHandle(loginRes.handle);
        props.setDisplayPic(loginRes.dp);
      } else if (loginRes.guest) {
        console.log("Logging in as guest");
        props.setLoggingIn(false);
        props.setUpdate(true);
        props.setGuest(true);
      } else {
        setMessage("Incorrect username/password.");
        console.log("Incorrect username/password.");
        setTimeout(() => setMessage(""), 5000);
      }
    }
  };

  const guestHandle = async (e) => {
    e.preventDefault();
    console.log("clicked Guest handle");
    const res = await fetch(`http://localhost:3000/guest`, {
      method: "POST",
      body: JSON.stringify({
        // What exactly should we send?
        guest: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 500) {
      setMessage("Error connecting to server");
      console.log("no connection to server");
      setTimeout(() => setMessage(""), 5000);
    } else {
      const loginRes = await res.json();
      console.log("Logged in as guest");
      props.setLoggingIn(false);
      props.setUpdate(true);
      console.log(loginRes);
    }
  };

  return (
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
  );
}
