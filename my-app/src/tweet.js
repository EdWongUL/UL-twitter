import { useState } from "react";

import comment from "./imgs/comment.svg";
import heart from "./imgs/heart.svg";
import retweet from "./imgs/retweet.svg";
import share from "./imgs/share.svg";
import verified from "./imgs/verified.svg";

export default function Tweet(props) {
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
        <div className="tweetTime">{props.tweetTime}</div>
      </div>

      <div className="tweetContent">{props.content}</div>

      <div className="tweetLinks">
        <div className="tweetLink">
          <button className="linkButton comment" onClick={props.handleLinkButton} />
          {props.comment}
        </div>
        <div className="tweetLink">
          <button className="linkButton retweet" onClick={props.handleLinkButton}/>
          {props.retweet}
        </div>
        <div className="tweetLink">
          <button className="linkButton heart" onClick={props.handleLinkButton}/>
          {props.heart}
        </div>
        <div className="tweetLink">
          <button className="linkButton share" onClick={props.handleLinkButton}/>
        </div>
      </div>
    </div>
  );
}
