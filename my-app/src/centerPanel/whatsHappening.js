import { useState, useEffect } from "react";
import "./centerPanel.css";

export default function WhatsHappening(props) {
  const [text, setText] = useState("");

  const handleClick = async (e) => {
    console.log(e);
    if (text !== "") {
      const res = await fetch(`http://localhost:3000/private/`, {
        method: "POST",
        body: JSON.stringify({
          // What exactly should we send?
          content: text,
          handle: props.handle,
        }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      const ress = await res.json();
      console.log(ress);
      if (!ress.login) {
        window.location.reload(false);
      } else {
        setText("");
        props.setStartingIdx(0);
        props.setBottom(false);
        props.setUpdate(true);
        // .catch(console.log("FAILED TO SEND TO SERVER"));
        // add a loading icon here?
        console.log("SENDING POST");
      }
    } else {
      console.log("Not sending an empty tweet");
    }
  };

  const handleLogIn = () => {
    props.setLoggingIn(true);
  };

  useEffect(() => {
    // console.log(`Text set to: ${text}`);
    // TODO here we can update do the remaining characters thing
  }, [text]);

  const onChange = (e) => {
    setText(e.target.value);
    // check if there's an @ symbol- in which case bring up a list of users (fetch or cache?)
    if (e.target.value[e.target.value.length - 1] === "@"){
      console.log("@SYMBOL Detected")
      // TODO get users (use debounce so we can't spam)
    }
  };

  return (
    <div>
      <div
        className="whatsHappening"
        style={props.guest ? { display: "none" } : { display: "inline-grid" }}
      >
        <img className="DP myDP" src={props.displayPic} />
        <div className="whatsHappeningInput">
          <form>
            <textarea
              placeholder="What's happening?"
              className="whatsHappeningText"
              id="whatsHappeningText"
              value={text}
              onChange={onChange}
              maxLength="250"
            ></textarea>
          </form>
        </div>
        <div className="remainingCharacters">{}</div>
        <div className="whatsHappeningButton">
          <button className="tweetButton" onClick={(e) => handleClick(e)}>
            Tweet
          </button>
        </div>
      </div>
      <div
        style={!props.guest ? { display: "none" } : { display: "block" }}
        className="guestHeader"
      >
        Currently logged in as Guest.
        <div className="guestLogInButtonContainer">
          <input
            type="submit"
            className="guestLogInButton"
            value="Log into Account"
            onClick={handleLogIn}
          />
        </div>
      </div>
    </div>
  );
}
