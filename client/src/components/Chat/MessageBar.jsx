import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE, ADD_MESSAGE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im"
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";

const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), { ssr: false });


function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvier();
  const [message, setMessage] = useState("")
  const emojiPickerRef = useRef(null)
  const [grabImage, setgrabImage] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const photoPickerChange = async (e) => {
    // Converting image into base-64 to store it into database
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id
        }
      })
      if (response.status === 201) {
        socket.current.emit("send-message", {
          to: currentChatUser.id,
          from: userInfo.id,
          message: response.data.message

        })

        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...response.data.message }
        })

      }

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    // wheneverc upload image is clicked the input for image will get automatically clicked using this
    if (grabImage) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setgrabImage(false);
        }, 1000);
      }
    }
  }, [grabImage])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, [])

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }



  const handleEmojiClick = (emoji) => {
    setMessage((previous) => (previous += emoji.emoji))
  }

  const sendMessage = async () => {
    try {
      setMessage("");
      const { data } = await axios.post(ADD_MESSAGE, {
        to: currentChatUser.id,
        from: userInfo.id,
        message
      })
      socket.current.emit("send-message", {
        to: currentChatUser.id,
        from: userInfo.id,
        message: data.message

      })

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: { ...data.message }
      })

    } catch (error) {
      console.log(error)
    }
  }

  return <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
    {
      !showAudioRecorder && (

        <>
          <div className="flex gap-6">
            <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}

            />
            {
              showEmojiPicker && (
                <div
                  className="absolute bottom-24 left-16 z-40"
                  ref={emojiPickerRef}>
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                  />
                </div>

              )
            }
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach file"
              onClick={() => { setgrabImage(true) }}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="bg-input-background text-sm text-white focus:outline-none px-5 h-10 rounded-lg py-4 w-full"
              autoFocus={true}
              onChange={(e) => { setMessage(e.target.value) }}
              value={message}
              onKeyUpCapture={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}


            />
          </div>
          <div className="flex  items-center justify-center">
            <button>
              {message.length ? (
                <MdSend className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => { setShowAudioRecorder(true) }}
                />
              )}
            </button>
          </div>
        </>
      )}
    {
      grabImage && <PhotoPicker onChange={photoPickerChange} />
    }

    {
      showAudioRecorder && (
        <>
          <CaptureAudio hide={setShowAudioRecorder} />
        </>
      )
    }

  </div>;
}

export default MessageBar;
