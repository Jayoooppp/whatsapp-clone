import React, { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
function login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvier();

  useEffect(() => {
    if (userInfo?.id && !newUser) {
      router.push("/")
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();

    // storing displayname in name .......
    const { user: { displayName: name, email, photoURL: profilImage } } = await signInWithPopup(fireBaseAuth, provider);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        if (!data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true })
          dispatch({
            type: reducerCases.SET_USRE_INFO,
            userInfo: {
              name,
              email,
              profilImage,
              status: "",
            }
          })

          router.push("/onboarding");
        } else {
          const { id, name, email, profilePicture: profileImage, status } = data;
          dispatch({
            type: reducerCases.SET_NEW_USER,
            userInfo: {
              id, name, email, profileImage, status
            }
          })
          router.push("/")
        }

      } else {

      }

    } catch (err) {
      console.log(err)
    }


  }
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg">
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>

    </div>
  )
}

export default login;
