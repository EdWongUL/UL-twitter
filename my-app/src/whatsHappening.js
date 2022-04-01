import { useState, useEffect } from "react";
// import myDP from "./imgs/DP1.png";

// function autoGrow(element) {
//   console.log(element);
//   element.style.height = 'auto';
//   element.style.height = element.scrollHeight + "px";
// }

export default function WhatsHappening(props) {
  const [text, setText] = useState("");

  const handleClick = async (e) => {
    if (text !== "") {
      // TODO add in an error checking thing with res
      const res = await fetch(`http://localhost:3000/`, {
        method: "POST",
        body: JSON.stringify({
          // What exactly should we send?
          content: text,
          handle: "newUser6969",
        }),
        headers: { "Content-Type": "application/json" },
      });
      setText("");
      props.setStartingIdx(0);
      props.setBottom(false);
      props.setUpdate(true);
      // .catch(console.log("FAILED TO SEND TO SERVER"));
      // add a loading icon here?
      console.log("SENDING POST");
    } else {
      console.log("Not sending an empty tweet");
    }
  };

  useEffect(() => {
    // console.log(`Text set to: ${text}`);
    // TODO here we can update do the remaining characters thing
  }, [text]);

  return (
    <div className="whatsHappening">
      <img className="DP myDP" src={"https://i.imgur.com/xOLdUTa.jpeg"} />
      <div className="whatsHappeningInput">
        <form>
          <textarea
            placeholder="What's happening?"
            className="whatsHappeningText"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // autoGrow(e.target);
            }}
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
  );
}
