import { useState, useEffect } from "react";

import Tweet from "./tweet.js";

const makeTweet = async (tweetInfo, idx, handleLinkButton, startingIdx) => {
  return (
    <Tweet
      key={idx + startingIdx}
      tweetDP={tweetInfo.dp}
      username={tweetInfo.userName}
      handle={tweetInfo.handle}
      verifiedBool={tweetInfo.verified}
      tweetTime={tweetInfo.timestamp}
      comment={tweetInfo.comment}
      retweet={tweetInfo.retweet}
      heart={tweetInfo.heart}
      content={tweetInfo.content}
      handleLinkButton={handleLinkButton}
    />
  );
};

export default function Timeline(props) {
  const [tweets, setTweets] = useState("");

  const handleLinkButton = async (e) => {
    const linkType = e.target.className.split(" ")[1];
    const res = await fetch(
      `http://localhost:3000/tweets/${props.startingIdx}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    // use fetch to post a number (+1 or -1) onto the link value.

    // the response will contain the new tweet's new numbers.

    // replace the tweet with that current one (maybe get an idx or something?)
  };

  useEffect(() => {
    if (props.update){
      props.setUpdate(false)
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
        results.map((result, idx) =>
          makeTweet(result, idx, handleLinkButton, props.startingIdx)
        )
      );
      if (props.startingIdx === 0) {
        setTweets(resultsComp);
      } else {
        // setTweets([...tweets, resultsComp]);
        setTweets(tweets.concat(resultsComp));
      }
    }
  };

  return tweets;
}
