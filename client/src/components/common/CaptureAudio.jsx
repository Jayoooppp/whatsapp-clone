import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO } from "@/utils/ApiRoutes";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";


function CaptureAudio({ hide }) {

  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvier();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setrecordedAudio] = useState(null); //represent recorded audio
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);


  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        })
      }, 1000)
    }
    return () => {
      clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    // setting the wavesurfer instance as soon as the instance is loaded
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    }
  }, [])


  useEffect(() => {
    if (waveForm) {
      handleStartRecording();
    }
  }, [waveForm])

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}.${seconds.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setrecordedAudio(null);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setrecordedAudio(audio);
        waveForm.load(audioURL)
      }
      mediaRecorder.start();
    })
      .catch((error) => {
        console.log("Error Accessing Microphone")
      })
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      })

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      })
    }

  }


  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setCurrentPlayBackTime(recordedAudio.currentTime);
      }
      recordedAudio.addEventListener("timeupdate", updatePlayBackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBackTime)
      }
    }
  }, [recordedAudio])

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  }


  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  }

  const sendRecording = async () => {

    // Converting image into base-64 to store it into database
    try {
      hide();
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const response = await axios.post(ADD_AUDIO, formData, {
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

  return <div className="flex text-2xl w-full justify-end items-center">
    <div className="pt-1">
      <FaTrash className="text-panel-header-icon cursor-pointer" onClick={() => hide()} />

    </div>
    <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
      {
        isRecording ? (
          <div className="text-red-500 animate-pulse text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <>
            <div>
              {
                recordedAudio &&
                <>
                  {!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaStop onClick={handlePauseRecording} />}
                </>
              }

            </div>

          </>
        )
      }
      <div className="w-60" ref={waveFormRef} hidden={isRecording} />
      {
        recordedAudio && isPlaying && (<span>{formatTime(currentPlayBackTime)}</span>)
      }
      {
        recordedAudio && !isPlaying && (<span>{formatTime(totalDuration)}</span>)
      }
      <audio ref={audioRef} hidden />
    </div>

    <div className="mr-4">
      {!isRecording ? <FaMicrophone onClick={handleStartRecording} className="text-red-500 cursor-pointer" /> : <FaPauseCircle onClick={handleStopRecording} className="text-red-500" />}

    </div>
    <div>
      <MdSend
        className="text-panel-header-icon cursor-pointer mr-4"
        title="send"
        onClick={sendRecording}
      />
    </div>
  </div>;
}

export default CaptureAudio;
