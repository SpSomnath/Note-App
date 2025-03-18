import React, { useState } from "react";

export default function Sidebar({ snapshotHistory }) {
  const [sidebarActive, setSidebarActive] = useState(false);

  function toggle() {
    setSidebarActive((prevState) => !prevState);
  }

  return (
    <>
      <div className="pageTitle">
        <div className="col sidebar-top">
          <p className="sidebar-title text-center">Note Title</p>
          <button className="sidebar-button" onClick={toggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="sidebar-icon"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6ZM5 7C5 6.44772 5.44772 6 6 6H9V18H6C5.44772 18 5 17.5523 5 17V7ZM11 18H18C18.5523 18 19 17.5523 19 17V7C19 6.44772 18.5523 6 18 6H11V18Z"
                fill="currentfill"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={`sidebar container-left ${sidebarActive ? 'active' : 'inactive'}`}>
        <div className="page-preview d-flex">
          {snapshotHistory.length > 0 && (
            <div className="page d-flex row">
              <button className="page-button">
                <img
                  src={snapshotHistory[0]}
                  alt="Latest Preview"
                  width="100"
                  height="100"
                />
              </button>
              <p>1</p> {/* Display as the first snapshot */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}




