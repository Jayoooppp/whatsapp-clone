import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_TOKEN } from "@/utils/ApiRoutes";
import dynamic from 'next/dynamic'; // If using Next.js, otherwise use your preferred dynamic import function
import axios from 'axios';
const DynamicAgoraUIKit = dynamic(() => import('agora-react-uikit'), { ssr: false });
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCall, MdOutlineCallEnd } from "react-icons/md";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvier();
  const [callAccepted, setCallAccepted] = useState(false)
  const [startCall, setStartCall] = useState(false);
  const [zegVar, setZegVar] = useState(undefined)
  const [localStream, setLocalStream] = useState(undefined)
  const [publishStream, setPublishStream] = useState(undefined)



  const [rtcProps, setRtcProps] = useState({
    appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    channel: undefined,  // your agora channel
    token: undefined// use null or skip if using app in testing mode
  })

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => {
        setCallAccepted(true);
      })
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data])


  useEffect(() => {
    const getToken = async () => {
      try {
        const { data: { token: returnedToken } } = await axios.get(`${GET_TOKEN}/${data.roomId}`);
        setRtcProps({ ...rtcProps, token: returnedToken, channel: data?.roomId?.toString() });
        setStartCall(true);
      } catch (error) {
        console.log("Eror")
      }
    }
    if (data) {
      getToken();
    }
  }, [callAccepted, data])

  console.log(data)

  const callbacks = {
    EndCall: () => {
      console.log("End call");
      if (data.callType === "voice") {

        socket.current.emit("reject-voice-call", {
          from: data?.id
        })

      } else {

        socket.current.emit("reject-video-call", {
          from: data?.id
        })

      }
      dispatch({
        type: reducerCases.END_CALL
      })
    },
  };
  // const endCall = () => {
  //   console.log("End call");
  //   if (data.callType === "voice") {

  //     socket.current.emit("reject-voice-call", {
  //       from: id
  //     })

  //   } else {

  //     socket.current.emit("reject-video-call", {
  //       from: id
  //     })

  //   }
  //   dispatch({
  //     type: reducerCases.END_CALL
  //   })
  // }

  return (
    <>
      {startCall ? (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
          <DynamicAgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      ) : (
        <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center">
          <div className="flex flex-col gap-3 items-center text-white">
            <span className="text-5xl">{data?.name}</span>
            <span className="text-lg">
              {callAccepted && data?.callType !== "video" ? "On going call" : "Calling"}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Container;
