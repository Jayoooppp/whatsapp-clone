import { useStateProvier } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvier();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveFormRef = useRef(null);
  const waveForm = useRef(null);



  useEffect(() => {
    // setting the wavesurfer instance as soon as the instance is loaded
    if (waveForm.current === null) {

      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true
      });

      waveForm.current.on("finish", () => {
        setIsPlaying(false);
      });

    }
    return () => {
      waveForm.current.destroy();
    }
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setCurrentAudio(audio);
    console.log(audioURL);
    waveForm?.current?.load(audioURL);
    console.log(waveForm?.current?.getDuration());
    waveForm?.current?.on("ready", () => {
      setTotalDuration(waveForm.current.getDuration());
    })
  }, [message])




  useEffect(() => {
    if (currentAudio) {
      const updatePlayBackTime = () => {
        setCurrentPlayBackTime(currentAudio.currentTime);
      }
      currentAudio.addEventListener("timeupdate", updatePlayBackTime);
      return () => {
        currentAudio.removeEventListener("timeupdate", updatePlayBackTime)
      }
    }
  }, [currentAudio])

  const handlePlayRecording = () => {
    if (currentAudio) {
      waveForm.current.stop();
      waveForm.current.play();
      currentAudio.play();
      setIsPlaying(true);
    }
  }


  const handlePauseRecording = () => {
    waveForm.current.stop();
    currentAudio.pause();
    setIsPlaying(false);
  }


  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}.${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={`m-1 -mr-0 flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm  rounded-md
     ${message.senderId === currentChatUser ?
        "bg-incoming-background" : "bg-outgoing-background"}  `}>
      <div>
        <Avatar type="lg" image={currentChatUser?.profilePicture} />
      </div>
      <div className="cursor-pointer text-xl">
        {
          !isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaPause onClick={handlePauseRecording} />
        }
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>{formatTime(isPlaying ? currentPlayBackTime : totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {

              message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />
            }
          </div>

        </div>

      </div>



    </div>
  )
}

export default VoiceMessage;
