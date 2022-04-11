import { useState, useEffect } from "react";
import "./centerPanel.css";

import Tweet from "./tweet.js";
import Footer from "./footer.js";

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
  const [tweets, setTweets] = useState([]);
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
    const wrappedElement = document.getElementById("timeline");
    if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
      // only trigger this if bottom hasn't been reached AND we are NOT in the loading screen
      if (!props.bottom && !props.loggingIn) {
        props.setStartingIdx(props.startingIdx + 10);
        props.setUpdate(true);
      } else if (props.bottom) {
        // TODO Add something that shows you've reached the bottom
      } else if (props.loggingIn) {
      }
    }
    setScroll(0);
  };

  useEffect(() => {
    console.log("UPDATE EFFECT")
    console.log(props.update)
    if (props.update) {
      props.setUpdate(false);
      getTweets();
    }
  }, [props.update]);

  // need to change this if starting idx is not 0, then we append our results onto the current one
  const getTweets = async () => {
    console.log("GETTING TWEEEEEEEETS");
    const res = await fetch(
      `http://localhost:3000/tweets/${props.startingIdx}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const results = await res.json();
    console.log(results);
    if (results.length === 0) {
      props.setBottom(true);
    } else {
      if (props.startingIdx === 0) {
        setTweets(results);
      } else {
        setTweets(tweets.concat(results));
      }
    }
  };

  return (
    <div>
      {tweets.map((tweetInfo) => {
        return (
          <Tweet
            key={tweetInfo.tweetIdOG}
            id={tweetInfo.tweetIdOG}
            tweetDP={tweetInfo.dp}
            username={tweetInfo.userName}
            authorHandle={tweetInfo.handle} //handle of tweet
            verifiedBool={tweetInfo.verified}
            tweetTime={tweetInfo.timestamp}
            comment={tweetInfo.totalComments}
            retweet={tweetInfo.totalRetweets}
            heart={tweetInfo.totalLikes}
            content={tweetInfo.content}
            handle={props.handle} // handle of client
            setLoggingIn={props.setLoggingIn}
            guest={props.guest}
            userCommentsInteraction={tweetInfo.userCommentsInteraction}
            userLikeInteraction={tweetInfo.userLikeInteraction}
            userRetweetInteraction={tweetInfo.userRetweetInteraction}
          />
        );
      })}
      <Footer bottom={props.bottom} />
    </div>
  );
}
