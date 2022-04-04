import { useState } from "react";

export default function Link(props) {
  const [animated, setAnimated] = useState(false);

  // we await this so the user can't spam it right?
  const handleClick = async (e) => {
    const linkType = e.target.className.split(" ")[1];
    console.log(linkType);
    console.log(e.target);
    setAnimated(!animated);

    // trigger animation

    const res = await fetch(
      `http://localhost:3000/tweets/${props.startingIdx}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  };

  return (
    <div className="tweetLink">
      <button
        className={"linkButton"}
        onClick={async (e) => {
          await handleClick(e);
        }}
      >
        <img
          className={`linkImg ${props.linkType} ${animated ? "animated" : ""}`}
        />
        <div className={`${animated ? "bubbles a" : ""}`}/>
        <div className={`${animated ? "bubbles b" : ""}`}/>
        <div className={`${animated ? "bubbles c" : ""}`}/>
        <div className={`${animated ? "bubbles d" : ""}`}/>
        <div className={`${animated ? "bubbles e" : ""}`}/>
      </button>
      {props.value}
    </div>
  );
}
