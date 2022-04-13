import { useState, useEffect } from "react";

export default function HandleSearch(props) {
  const [text, setText] = useState("");

  // useEffect(() => {
  //   console.log(props.handleResults);
  // });

  const useDebounce = (value, delay) => {
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
  };

  const debouncedSearchTerm = useDebounce(props.handles, 200);

  useEffect(async () => {
    await fetchResults();
  }, [debouncedSearchTerm]);

  const fetchResults = async () => {
    if (props.handles !== null) {
      const res = await fetch(`http://localhost:3000/private/findUsers/`, {
        method: "POST",
        body: JSON.stringify({
          handles: props.handles,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const ress = await res.json();
      console.log(ress);
      props.setHandleResults(ress.handles);
    } else {
      props.setHandleResults([]);
    }
  };

  const handleClick = (e) => {
    console.log("a results has been clicked");
    console.log(e.target.id);
  };

  return (
    <div
      className="handleSearch"
      style={{ left: props.xycoords[0] + "px", top: (props.xycoords[1]+30) + "px" }}
    >
      {props.handleResults.map((result) => (
        <div
          className="result"
          key={result.handle}
          id={result.handle}
          onClick={handleClick}
        >
          {result.handle}
        </div>
      ))}
    </div>
  );
}
