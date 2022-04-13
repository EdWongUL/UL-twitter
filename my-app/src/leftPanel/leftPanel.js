import { useState, useEffect } from "react";
import "./leftPanel.css";
import { Routes, Route, Link, Outlet } from "react-router-dom";

// images
import birdy from "../imgs/birdy.svg";
import homeIcon from "../imgs/homeIcon.svg";
import exploreIcon from "../imgs/exploreIcon.svg";
import notificationsIcon from "../imgs/notificationsIcon.svg";
import messagesIcon from "../imgs/messagesIcon.svg";
import bookmarksIcon from "../imgs/bookmarksIcon.svg";
import listsIcon from "../imgs/listsIcon.svg";
import profileIcon from "../imgs/profileIcon.svg";
import moreIcon from "../imgs/moreIcon.svg";

export default function LeftPanel(props) {
  const [thing, setThing] = useState("");

  useEffect(() => {}, []);

  const focusTweet = () => {
    document.getElementById("whatsHappeningText").focus();
  };

  return (
    <div className="leftSideBar">
        <div className="nav birdy">
          <img className="icon" src={birdy} />
        </div>

        <Link to="/" className="nav home">
          <img className="icon" src={homeIcon} />
          <div className="navHeader">Home</div>
        </Link>

        <Link to="/" className="nav explore">
            <img className="icon" src={exploreIcon} />
            <div className="navHeader">Explore</div>
        </Link>

        <Link to="/" className="nav notifications">
          <img className="icon" src={notificationsIcon} />
          <div className="navHeader">Notifications</div>
        </Link>

        <Link to="/" className="nav messages">
          <img className="icon" src={messagesIcon} />
          <div className="navHeader">Messages</div>
        </Link>

        <Link to="/" className="nav bookmarks">
          <img className="icon" src={bookmarksIcon} />
          <div className="navHeader">Bookmarks</div>
        </Link>

        <Link to="/" className="nav lists">
          <img className="icon" src={listsIcon} />
          <div className="navHeader">Lists</div>
        </Link>

        <Link to="profile" className="nav profile">
          <img className="icon" src={profileIcon} />
          <div className="navHeader">Profile</div>
        </Link>

        <Link to="/" className="nav more">
          <img className="icon" src={moreIcon} />
          <div className="navHeader">More</div>
        </Link>

        <button className="nav tweet" onClick={focusTweet}>
          <div className="navHeader">Tweet</div>
        </button>

        <Outlet />

    </div>
  );
}
