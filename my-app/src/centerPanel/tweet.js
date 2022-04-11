import { useState } from "react";
import "./centerPanel.css";

import comment from "../imgs/comment.svg";
import heart from "../imgs/heart.svg";
import retweet from "../imgs/retweet.svg";
import share from "../imgs/share.svg";
import verified from "../imgs/verified.svg";

import Link from "./link.js";

export default function Tweet(props) {
  const tweetTimeLocal = new Date(props.tweetTime + " UTC");

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
        <img
          src={verified}
          style={
            props.verifiedBool === 0
              ? { display: "block" }
              : { display: "none" }
          }
        />
        <h4>@{props.authorHandle}</h4>
        <p className="grey">&middot;</p>
        <div className="tweetTime" title={tweetTimeLocal}>
          {getTimeSince(tweetTimeLocal)}
        </div>
      </div>

      <div className="tweetContent">{props.content}</div>

      <div className="tweetLinks">
        <Link
          value={props.comment}
          linkType={"comments"}
          tweetId={props.id}
          handle={props.handle}
          setLoggingIn={props.setLoggingIn}
          guest={props.guest}
          userInteraction={props.userCommentsInteraction}
        />
        <Link
          value={props.retweet}
          linkType={"retweet"}
          tweetId={props.id}
          handle={props.handle}
          setLoggingIn={props.setLoggingIn}
          guest={props.guest}
          userInteraction={props.userRetweetInteraction}
        />
        <Link
          value={props.heart}
          linkType={"likes"}
          tweetId={props.id}
          handle={props.handle}
          setLoggingIn={props.setLoggingIn}
          guest={props.guest}
          userInteraction={props.userLikeInteraction}
        />
        <Link
          value={props.share}
          linkType={"share"}
          tweetId={props.id}
          handle={props.handle}
          setLoggingIn={props.setLoggingIn}
          guest={props.guest}
        />
      </div>
    </div>
  );
}
