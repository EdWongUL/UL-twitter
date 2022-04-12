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

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(handles, 200);

  useEffect(async () => {
    await fetchResults();
  }, [debouncedSearchTerm]);

  const fetchResults = async () => {
    if (handles !== null) {
      // console.log("fetching with searchHandle: " + handles);
      const res = await fetch(`http://localhost:3000/private/findUsers/`, {
        method: "POST",
        body: JSON.stringify({
          handles: handles,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const ress = await res.json();
      console.log(ress);
      setHandleResults(ress.handles);
    } else {
      setHandleResults([]);
    }
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
    const length = text.length;
    setRemainingChars(maxLength - length);
    // TODO here we can update do the remaining characters thing
  }, [text]);

  const findSearchHandle = (inString, currentSelection) => {
    // splitting between any not alphanumeric or @
    const inStringSplit = inString.split(/[^a-zA-Z\d@]/g);

    // FIND THE FIRST CHARACTER OF THE WORD WE ARE CURRENTLY IN.
    let cumulativeTotal = 0;
    for (let i = 0; i < inStringSplit.length; i++) {
      const currentLength = inStringSplit[i].length;
      if (currentLength + cumulativeTotal >= currentSelection) {
        // TODO change this to return the full word as opposed to just the first letter
        // ONLY IF it's the @ symbol thing
        if (inStringSplit[i][0] === "@") {
          return inStringSplit[i].slice(1);
        } else {
          return null;
        }
      } else {
        cumulativeTotal += currentLength + 1;
      }
    }
  };

  const onChange = (e) => {
    setText(e.target.value);

    // currentSelection is the position of the cursor when the latest key was pressed
    const currentSelection = e.target.selectionStart;
    // console.log(currentSelection);

    // get current word
    const inString = e.target.value;

    const searchHandle = findSearchHandle(inString, currentSelection);
    setHandles(searchHandle);
  };

  return (
    <div>
      <div
        className="whatsHappening"
        style={props.guest ? { display: "none" } : { display: "inline-grid" }}
      >
        <img className="DP myDP" src={props.displayPic} />
        <div className="whatsHappeningInput">
          <HandleSearch handleResults={handleResults} />
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
