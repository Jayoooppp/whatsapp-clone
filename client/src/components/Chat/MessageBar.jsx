import { useStateProvier } from "@/context/StateContext";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im"
import { MdSend } from "react-icons/md";
function MessageBar() {
  const [{ userInfo, currentChatUser }] = useStateProvier();
  const [message, setMessage] = useState("")
  const sendMessage = () => {
    alert("Hllo e")
  }

  return <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
    <>
      <div className="flex gap-6">
        <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl"
          title="Emoji"
        />
        <ImAttachment className="text-panel-header-icon cursor-pointer text-xl"
          title="Attach file"
        />
      </div>
      <div className="w-full rounded-lg h-10 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-input-background text-sm text-white focus:outline-none px-5 h-10 rounded-lg py-4 w-full"
          onChange={(e) => { setMessage(e.target.value) }}
          value={message}
        />
      </div>
      <div className="flex  items-center justify-center gap-6">
        <MdSend className="text-panel-header-icon cursor-pointer text-xl"
          title="Send Message"
          onClick={sendMessage}
        />
        <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl"
          title="Record"
        />
      </div>
    </>

  </div>;
}

export default MessageBar;
