import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvier } from "@/context/StateContext";
import { BsChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs"

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvier();

  return (
    <div div className="h-16 mx-4 py-3 flex justify-between items-center" >
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" />
        <>
          <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu" />
        </>
      </div>

    </div>
  )
}

export default ChatListHeader;
