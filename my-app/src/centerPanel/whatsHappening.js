import { useState, useEffect } from "react";
import "./centerPanel.css";
import HandleSearch from "./handleSearch.js";

// maximum length of a tweet (reduce it for testing).
const maxLength = 100;

export default function WhatsHappening(props) {
  const [text, setText] = useState("");
  const [handles, setHandles] = useState(null);
  const [handleResults, setHandleResults] = useState([]);
  const [recentHandleIdx, setRecentHandleIdx] = useState(-1);
  const [remainingChars, setRemainingChars] = useState(100);
  const [xycoords, setXycoords] = useState([0, 0]);

  useEffect(() => {
    const length = text.length;
    setRemainingChars(maxLength - length);
    // TODO here we can update do the remaining characters thing
  }, [text]);

  const handleLogIn = () => {
    props.setLoggingIn(true);
    props.setLogInBackground(true);
    props.setScrollTrack(false);
  };

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
        console.log("SENDING POST");
      }
    } else {
      console.log("Not sending an empty tweet");
    }
  };

  const createCopy = (textArea) => {
    var copy = document.createElement("div");
    copy.textContent = textArea.value;
    var style = getComputedStyle(textArea);
    [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "wordWrap",
      "whiteSpace",
      "borderLeftWidth",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
    ].forEach(function (key) {
      copy.style[key] = style[key];
    });
    copy.style.overflow = "auto";
    copy.style.width = textArea.offsetWidth + "px";
    copy.style.height = textArea.offsetHeight + "px";
    copy.style.position = "absolute";
    copy.style.left = textArea.offsetLeft + "px";
    copy.style.top = textArea.offsetTop + "px";
    document.body.appendChild(copy);
    return copy;
  };

  const findSearchHandle = (inString, currentSelection) => {
    // splitting between any not alphanumeric or @
    const inStringSplit = inString.split(/[^a-zA-Z\d@]/g);

    // FIND THE FIRST CHARACTER OF THE WORD WE ARE CURRENTLY IN.
    let cumulativeTotal = 0;
    for (let i = 0; i < inStringSplit.length; i++) {
      const currentLength = inStringSplit[i].length;
      if (currentLength + cumulativeTotal >= currentSelection) {
        if (inStringSplit[i][0] === "@") {
          // i is the ith string in the input
          // 0 is the first character of that string

          const input = document.getElementById("whatsHappeningText");

          const start = input.selectionStart;
          const end = input.selectionEnd;
          const copy = createCopy(input);

          console.log(input);
          const range = document.createRange();
          range.setStart(copy.firstChild, cumulativeTotal - 1);
          range.setEnd(copy.firstChild, cumulativeTotal);
          console.log(range);
          const selection = document.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          console.log(selection);
          const rect = range.getBoundingClientRect();
          document.body.removeChild(copy);
          input.selectionStart = start;
          input.selectionEnd = end;
          input.focus();

          console.log(rect);
          return [
            inStringSplit[i].slice(1),
            [rect.left - input.scrollLeft, rect.top - input.scrollTop],
          ];
        } else {
          return [null, [0, 0]];
        }
      } else {
        cumulativeTotal += currentLength + 1;
      }
    }
  };

  const onChange = (e) => {
    setText(e.target.value);

    console.log(e);

    // currentSelection is the position of the cursor when the latest key was pressed
    const currentSelection = e.target.selectionStart;

    // get current word
    const inString = e.target.value;

    const [searchHandle, newcoords] = findSearchHandle(
      inString,
      currentSelection
    );
    setHandles(searchHandle);

    // set new position of the @ symbol thing in setXycoords
    setXycoords(newcoords);
  };

  return (
    <div>
      <div
        className="whatsHappening"
        style={props.guest ? { display: "none" } : { display: "inline-grid" }}
      >
        <img className="DP myDP" src={props.displayPic} />
        <div className="whatsHappeningInput">
          <HandleSearch
            handleResults={handleResults}
            handles={handles}
            setHandleResults={setHandleResults}
            xycoords={xycoords}
          />
          <form>
            <textarea
              placeholder="What's happening?"
              className="whatsHappeningText"
              id="whatsHappeningText"
              value={text}
              onChange={onChange}
              maxLength={"" + maxLength}
            ></textarea>
          </form>
        </div>
        <div className="remainingCharacters">
          {remainingChars < 0.2 * maxLength
            ? `Remaining characters: ${remainingChars}`
            : ""}
        </div>
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
