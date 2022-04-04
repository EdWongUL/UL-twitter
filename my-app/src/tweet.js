import { useState } from "react";

import comment from "./imgs/comment.svg";
import heart from "./imgs/heart.svg";
import retweet from "./imgs/retweet.svg";
import share from "./imgs/share.svg";
import verified from "./imgs/verified.svg";

import Link from "./link.js";

export default function Tweet(props) {
  const tweetTimeLocal = new Date(props.tweetTime + " UTC");

  const handleClick = async (e) => {
    const linkType = e.target.className.split(" ")[1];
    console.log(linkType);
    console.log(e.target);

    if ("heart" === linkType) {
      // trigger heart animation

      const res = await fetch(
        `http://localhost:3000/tweets/${props.startingIdx}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
    }

    // use fetch to post a number (+1 or -1) onto the link value.

    // the response will contain the new tweet's new numbers.

    // replace the tweet with that current one (maybe get an idx or something?)
  };

  const getTimeSince = (tweetTime) => {
    const then = Date.parse(tweetTime);
    const now = Date.now();
    const timeSince = now - then;

    // Think about this properly later
    if (timeSince < 1000 * 60) {
      return "" + Math.floor(timeSince / 1000) + "s";
    } else if (timeSince < 1000 * 60 * 60) {
      return "" + Math.floor(timeSince / (1000 * 60)) + "min";
    } else if (timeSince < 1000 * 60 * 60 * 24) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60)) + "hr";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24)) + "d";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7 * 28) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7)) + "wk";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7 * 28 * 12) {
      return (
        "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7 * 28)) + "mth"
      );
    } else {
      return (
        "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7 * 28 * 12)) + "yr"
      );
    }
  };

  return (
    <div className="newTweet" key="testTweet1">
      <div className="tweetDP">
        <img className="DP" src={props.tweetDP} />
      </div>

      <div className="tweetHeader">
        <h3>{props.username}</h3>
        <img src={props.verifiedBool === 0 ? verified : undefined} />
        <h4>@{props.handle}</h4>
        &middot;
        <div className="tweetTime" title={tweetTimeLocal}>
          {getTimeSince(tweetTimeLocal)}
        </div>
      </div>

      <div className="tweetContent">{props.content}</div>

      <div className="tweetLinks">
        <Link value={props.comment} linkType={'comment'}/>
        <Link value={props.retweet} linkType={'retweet'}/>
        <Link value={props.heart} linkType={'heart'}/>
        <Link value={props.share} linkType={'share'}/>
      </div>
    </div>
  );
}
