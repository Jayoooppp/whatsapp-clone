import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5"

function CapturePhoto({ setImage, hideCapturePhoto }) {

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef?.current?.srcObject?.getTracks().forEach((track) => track.stop());
      }
    }
  }, [])

  const capturePhoto = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    const canvas = document.createElement("canvas")
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150);
    setImage(canvas.toDataURL("image/jpeg"))
    hideCapturePhoto(false)
  }
  return (
    <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full items-center justify-center">
        <div className="pt-2 pr-2 cursor-pointer flex justify-end items-end">
          <IoClose className="h-10 w-10" onClick={() => { hideCapturePhoto(false) }} />
        </div>
        <div className="flex justify-center">
          <video id="video" width={400} autoPlay ref={videoRef} />
        </div>
        <button
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
          onClick={capturePhoto}
        />

      </div>
    </div>
  )
}

export default CapturePhoto;
