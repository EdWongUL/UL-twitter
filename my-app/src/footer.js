import { useState, useEffect } from "react";

import Link from "./link.js";

export default function Footer(props) {
  const [text, setText] = useState("Scroll to get more tweets!");

  useEffect(() => {
    setText("Scroll to get more tweets!");
    if (props.bottom) {
      setText("You're all caught up!");
    }
  }, [props.bottom]);

  return (
    <div className="footerContainer">
      <div className="footer">{text}</div>
    </div>
  );
}
