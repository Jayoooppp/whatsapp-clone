import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvier } from "@/context/StateContext";

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvier();

  return (
    <div div className="h-16 mx-4 py-3 flex justify-between items-center" >
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div>

      </div>

    </div>
  )
}

export default ChatListHeader;
