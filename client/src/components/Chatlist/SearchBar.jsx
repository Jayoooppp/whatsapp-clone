import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi"
import { BsFilter } from "react-icons/bs"
function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvier();

  return (
    <div className="text-search-input-container-background-background flex py-3 pl-5 items-center gap-3 h-14 ">
      <div className="bg-panel-header-background flex items-center gap-3 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l " />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            onChange={(e) => {
              dispatch({
                type: reducerCases.SET_CONTACT_SEARCH,
                contactSearch: e.target.value
              })
            }}

          />
        </div>

      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon cursor-pointer text-l" />
      </div>
    </div>

  )
}

export default SearchBar;
