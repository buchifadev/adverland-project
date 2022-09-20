import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = ({ balance, showDashboard }) => {
  return (
    <div className="nav">
      <div className="blink">
        <div className="content-area">
          <div className="nav-title">
            <div>AdverLand</div>
            <div className="title-sub">
              Adverts made more accessible on the blockchain
            </div>
          </div>
          <div className="nav-links">
            <Link to="/new-advert">
              <div className="link">New Advert</div>
            </Link>
            {showDashboard && (
              <Link to="/dashboard">
                <div className="link">
                  Dashboard
                </div>
              </Link>
            )}
            <div className="link balance">
              Bal <span>{balance} Celo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
