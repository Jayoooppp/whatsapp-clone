import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa"
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";
function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
  const [contextMenyCordinates, setcontextMenyCordinates] = useState({
    x: 0,
    y: 0
  })
  const [grabImage, setgrabImage] = useState(false)
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)
  const [showCapturePhoto, setShowCapturePhoto] = useState(false)

  const photoPickerChange = async (e) => {
    // Converting image into base-64 to store it into database
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100)

  }



  const showContextMenu = (e) => {
    e.preventDefault();
    setcontextMenyCordinates({ x: e.pageX, y: e.pageY })
    setisContextMenuVisible(true);
  }

  useEffect(() => {
    // whenever upload image is clicked the input for image will get automatically clicked using this
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


  const contextMenuOptions = [{
    text: "Take photo",
    callback: () => {
      setShowCapturePhoto(true);
    }
  },
  {
    text: "Choose From Library",
    callback: () => {
      setShowPhotoLibrary(true);
    }
  }, {
    text: "Upload Photo",
    callback: () => {
      setgrabImage(true);
    }
  }, {
    text: "Remove Photo",
    callback: () => {
      setImage("/default_avatar.png")
    }
  }]
  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
              className={`${hover ? "visible" : "hidden"} z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2`}>
              <FaCamera className="text-2xl" onClick={(e) => showContextMenu(e)}

                id="context-opener" />
              <span
                onClick={(e) => showContextMenu(e)}
                id="context-opener"
              >change <br />profile <br /> picture</span>
            </div>
            <div className="h-60 w-60 flex items-center justify-center">
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {
        isContextMenuVisible &&
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenyCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setisContextMenuVisible}
        />
      }
      {
        grabImage && <PhotoPicker onChange={photoPickerChange} />
      }
      {
        showPhotoLibrary && <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      }
      {
        showCapturePhoto && <CapturePhoto
          setImage={setImage}
          hideCapturePhoto={setShowCapturePhoto}
        />
      }

    </>


  );
}

export default Avatar;
