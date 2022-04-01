import { useState } from "react";

import comment from "./imgs/comment.svg";
import heart from "./imgs/heart.svg";
import retweet from "./imgs/retweet.svg";
import share from "./imgs/share.svg";
import verified from "./imgs/verified.svg";

export default function Tweet(props) {
  const tweetTimeLocal = new Date(props.tweetTime + ' UTC');

  const getTimeSince = (tweetTime) => {
    const then = Date.parse(tweetTime);
    const now = Date.now();
    const timeSince = now - then;

    // Think about this properly later
    if        (timeSince < 1000 * 60) {
      return "" + Math.floor(timeSince / 1000) + "s";
    } else if (timeSince < 1000 * 60 * 60) {
      return "" + Math.floor(timeSince / (1000 * 60)) + "min";
    } else if (timeSince < (1000 * 60 * 60 * 24)) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60)) + "hr";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24)) + "d";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7 * 28) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7)) + "wk";
    } else if (timeSince < 1000 * 60 * 60 * 24 * 7 * 28 * 12) {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7 * 28 )) + "mth";
    } else {
      return "" + Math.floor(timeSince / (1000 * 60 * 60 * 24 * 7 * 28 * 12)) + "yr";
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
        <div className="tweetLink">
          <button
            className="linkButton comment"
            onClick={props.handleLinkButton}
          />
          {props.comment}
        </div>
        <div className="tweetLink">
          <button
            className="linkButton retweet"
            onClick={props.handleLinkButton}
          />
          {props.retweet}
        </div>
        <div className="tweetLink">
          <button
            className="linkButton heart"
            onClick={props.handleLinkButton}
          />
          {props.heart}
        </div>
        <div className="tweetLink">
          <button
            className="linkButton share"
            onClick={props.handleLinkButton}
          />
        </div>
      </div>
    </div>
  );
}
