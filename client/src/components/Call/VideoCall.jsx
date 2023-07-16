import { useStateProvier } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React from "react";
const Container = dynamic(() => import("./Container"), { ssr: false });


function VideoCall() {
  const [{ videoCall, socket, userInfo }] = useStateProvier();
  return <Container data={videoCall} />;
}

export default VideoCall;
