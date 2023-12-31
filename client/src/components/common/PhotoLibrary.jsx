import React from "react";
import { IoClose } from "react-icons/io5"
import Image from "next/image";
function PhotoLibrary({ setImage, hidePhotoLibrary }) {
  const photots = [
    "/avatars/11.jpg",
    "/avatars/12.jpg",
    "/avatars/13.jpg",
    "/avatars/14.jpg",
    "/avatars/15.jpg",
    "/avatars/16.jpg",
    "/avatars/17.jpg",
    "/avatars/18.jpg",
    "/avatars/19.jpg",
  ]
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] w-full h-full flex justify-center items-center">
      <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
        <div className="pt-2 pe-2 cursor-pointer flex justify-end items-end">
          <IoClose className="h-10 w-10" onClick={() => { hidePhotoLibrary(false) }} />
        </div>
        <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 w-full ">
          {photots?.map((photo, index) => (
            <div
              onClick={() => {
                setImage(photo)
                hidePhotoLibrary(false)
              }}
            >
              <div className="h-24 w-24 cursor-pointer relative">
                <Image src={photo} alt="avatar" fill className="rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhotoLibrary;
