import React, { useEffect, useRef } from "react";

function ContextMenu({ options, cordinates, contextMenu, setContextMenu }) {
  const contextMenyRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "context-opener") {
        if (contextMenyRef.current && !contextMenyRef.current.contains(event.target)) {
          setContextMenu(false);
        }
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, [])

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  }
  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
      ref={contextMenyRef}
      style={{
        top: cordinates.y,
        left: cordinates.x
      }}
    >
      <ul>
        {
          options.map(({ text, callback }) => (
            <li
              onClick={(e) => handleClick(e, callback)}
              className="px-5 py-2 cursor-pointer hover:bg-black"
            >
              <span className="text-white">{text}</span>
            </li>
          ))
        }
      </ul>

    </div>
  )
}

export default ContextMenu;
