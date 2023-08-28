import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvier } from "@/context/StateContext";
import { BsChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs"
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";
function ChatListHeader() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvier();

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_CONTACTS_PAGE,
      page: "all-contacts"
    })
  }

  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
  const [contextMenyCordinates, setcontextMenyCordinates] = useState({
    x: 0,
    y: 0
  })


  const showContextMenu = (e) => {
    e.preventDefault();
    setcontextMenyCordinates({ x: e.pageX, y: e.pageY })
    setisContextMenuVisible(true);
  }


  const contextMenyOptions = [
    {
      text: "LogOut",
      callback: async () => {
        setisContextMenuVisible(false);
        router.push("/logout")

      }
    }
  ]

  return (
    <div div className="h-16 mx-4 py-3 flex justify-between items-center" >
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
            onClick={(e) => showContextMenu(e)}
            id="context-opener"
          />

          {isContextMenuVisible &&
            <ContextMenu
              options={contextMenyOptions}
              cordinates={contextMenyCordinates}
              contextMenu={isContextMenuVisible}
              setContextMenu={setisContextMenuVisible}
            />}
        </>
      </div>

    </div>
  )
}

export default ChatListHeader;
