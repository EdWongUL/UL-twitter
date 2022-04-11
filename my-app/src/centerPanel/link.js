import { useState, useEffect } from "react";
import "./centerPanel.css";

export default function Link(props) {
  const [animated, setAnimated] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(()=> {
    setAnimated(props.userInteraction === 1)
  }, [props.userInteraction])

  // we await this so the user can't spam it right?
  // it thinks e is something different every other click
  // CHECK THIS
  const handleClick = async (e) => {
    console.log(e.target.className)
    const linkType = e.target.className.split(" ")[1];

    // trigger animation

    const res = await fetch("http://localhost:3000/private/link", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: linkType,
        tweetId: props.tweetId,
      }),
    });

    const resJ = await res.json();

    setValue(resJ.newTotal);
    // keep the links value as a state and update it when we make the change

    // once we have a response, double check that the state of the link button is correct.
    // manually set animate.
    setAnimated(resJ.inserted);
    // also need to update the numbers in this, should we just trigger update?
  };

  return (
    <div className="tweetLink">
      <button
        // className={"linkButton" }
        className={`linkButton ${props.linkType} ${animated ? "animated" : ""}`}
        onClick={(e) => {
          if (props.guest) {
            props.setLoggingIn(true)
            // if we are a guest and we are trying to click a link,
            // bring up the log in as guest screen
          } else if (props.linkType == "share") {
            setAnimated(!animated);
          } else {
            handleClick(e);
          }
        }}
      >
        <div className={`${animated ? "bubbles a" : ""}`} />
        <div className={`${animated ? "bubbles b" : ""}`} />
        <div className={`${animated ? "bubbles c" : ""}`} />
        <div className={`${animated ? "bubbles d" : ""}`} />
        <div className={`${animated ? "bubbles e" : ""}`} />
      </button>
      {value}
    </div>
  );
}
