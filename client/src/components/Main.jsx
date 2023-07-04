import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { async } from "@firebase/util";
import { useRouter } from "next/router";
import { useStateProvier } from "@/context/StateContext";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvier();
  console.log(userInfo)
  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin])
  onAuthStateChanged(fireBaseAuth, async (currentUser) => {
    if (!currentUser) {
      console.log(currentUser)
      setRedirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      console.log()
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser?.email
      });
      if (!data.status) {
        router.push("/login");
      }
      if (data?.data) {
        const { id, name, email, profilePicture: profileImage, status } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id, name, email, profileImage, status
          }
        })
      }
    }
  })
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        <Empty />
      </div>
    </>
  );
}

export default Main;
