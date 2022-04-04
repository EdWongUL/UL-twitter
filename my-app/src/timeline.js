import { useState, useEffect } from "react";

import Tweet from "./tweet.js";
import Footer from "./footer.js";

const makeTweet = async (tweetInfo, idx, startingIdx) => {
  return (
    <Tweet
      key={idx + startingIdx}
      // Add tweet id from db
      tweetDP={tweetInfo.dp}
      username={tweetInfo.userName}
      handle={tweetInfo.handle}
      verifiedBool={tweetInfo.verified}
      tweetTime={tweetInfo.timestamp}
      comment={tweetInfo.comment}
      retweet={tweetInfo.retweet}
      heart={tweetInfo.heart}
      content={tweetInfo.content}
    />
  );
};

function useDebounce(value, delay) {
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
}

export default function Timeline(props) {
  const [tweets, setTweets] = useState("");
  // number for debouncing the trackScrolling method
  // 0 for a reset, otherwise, for every trigger the scroll state is incremented.
  const [scroll, setScroll] = useState(0);

  // get a debounce hook for the scroll state
  const debouncedScroll = useDebounce(scroll, 1000);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // increment the scroll state everytime the scroll event is triggered
  const handleScroll = () => {
    setScroll(scroll + 1);
  };

  // everytime the debouncedScroll value changes, we call trackScrolling
  useEffect(() => {
    trackScrolling();
  }, [debouncedScroll]);

  const trackScrolling = () => {
    console.log("trackScrolling");
    const wrappedElement = document.getElementById("timeline");
    if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
      // only trigger this if bottom hasn't been reached AND we are NOT in the loading screen
      if ((!props.bottom && !props.loggingIn) || props.alreadyLoggedIn) {
        console.log("Updating starting idx");
        props.setStartingIdx(props.startingIdx + 10);
        props.setUpdate(true);
      } else if (props.bottom) {
        console.log("Reached bottom of the timeline.");
        // TODO Add something that shows you've reached the bottom
      } else if (props.loggingIn) {
        console.log("Ignoring while logging in.");
      }
    }
    setScroll(0);
  };

  useEffect(() => {
    if (props.update) {
      props.setUpdate(false);
      getTweets();
    }
  }, [props.update]);

  // need to change this if starting idx is not 0, then we append our results onto the current one
  const getTweets = async () => {
    const res = await fetch(
      `http://localhost:3000/tweets/${props.startingIdx}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const results = await res.json();
    if (results.length === 0) {
      props.setBottom(true);
    } else {
      const resultsComp = await Promise.all(
        results.map((result, idx) => makeTweet(result, idx, props.startingIdx))
      );
      if (props.startingIdx === 0) {
        setTweets(resultsComp);
      } else {
        // setTweets([...tweets, resultsComp]);
        setTweets(tweets.concat(resultsComp));
      }
    }
  };

  return (
    <div>
      {tweets}
      <Footer
        bottom={props.bottom}
      />
    </div>
  );
}
