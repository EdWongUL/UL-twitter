import { useState, useEffect } from "react";

export default function HandleSearch(props) {
  const [text, setText] = useState("");

  useEffect( ()=> {
    console.log(props.handleResults)
  })

  const handleClick = (e) => {
    console.log("a results has been clicked")
    console.log(e.target.id)
  }

  return (
    <div className="handleSearch">
      {props.handleResults.map((result) => (
        <div className="result" key={result.handle} id={result.handle} onClick={handleClick} >
          {result.handle}
        </div>
      ))}
    </div>
  );
}
