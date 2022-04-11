import { useState } from "react";
import trendSettings from "../imgs/trendSettings.svg";

export default function Trend(props) {
  return (
    <div className="trends">
      <div className="hashtag">#{props.trendTitle}</div>
      <button className="trendElipsis" />
      <div className="trendPopulation">{props.population} Tweets</div>
    </div>
  );
}
