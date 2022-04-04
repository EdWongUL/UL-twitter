import { useState, useEffect } from "react";

export default function LogIn(props) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      body: JSON.stringify({
        // What exactly should we send?
        username: e.target.username.value,
        password: e.target.password.value,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 500) {
      setMessage("Error connecting to server")
      console.log("no connection to server");
      setTimeout(() => setMessage(""), 5000)
    } else {
      const loginRes = await res.json();
      if (loginRes.login) {
        console.log("Server accepted username and password");
        props.setLoggingIn(false);
        props.setUpdate(true);
        props.setDisplayPic(loginRes.dp)
      } else {
        setMessage("Incorrect username/password.")
        console.log("Incorrect username/password.");
        setTimeout(() => setMessage(""), 5000)
      }
      console.log(loginRes);
    }
  };

  return (
    <div className="logInRel">
      <form onSubmit={handleSubmit}>
        <div className="logInAbs">
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
