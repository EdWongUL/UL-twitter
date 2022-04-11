import { useState, useEffect } from "react";

import Trend from "./trend.js";

const makeTrend = (trendInfo, idx) => {
  return (
    <Trend
      key={idx}
      trendTitle={trendInfo.trendTitle}
      population={trendInfo.population}
    />
  );
};

export default function TrendContainer(props) {
  const [trends, setTrends] = useState("");

  useEffect(() => {
    if (props.update) {
      getTrends();
      props.setUpdate(false);
    }
  }, [props.update]);

  const getTrends = async () => {
    const res = await fetch("http://localhost:3000/trends", {
      method: "GET",
    });
    const results = await res.json();
    const resultsComp = results.map((result, idx) => makeTrend(result, idx));
    setTrends(resultsComp);
  };

  return trends;
}
