import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { async } from "@firebase/util";
import { useRouter } from "next/router";
import { useStateProvier } from "@/context/StateContext";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES, HOST } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const router = useRouter();
  const [{ userInfo, currentChatUser, messageSearch }, dispatch] = useStateProvier();
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false)

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          }
        })
      })


      setSocketEvent(true);
    }
  }, [socket.current])

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket })
    }

  }, [userInfo])

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

  useEffect(() => {
    const getMessages = async () => {
      const { data: { messages } } = await axios.get(`${GET_MESSAGES}/${userInfo?.id}/${currentChatUser?.id}`)
      dispatch({ type: reducerCases.SET_MESSAGES, messages })
    }
    if (currentChatUser?.id) {
      getMessages();
    }

  }, [currentChatUser])

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {
          currentChatUser ? (
            <>
              <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
                <Chat />
                {
                  messageSearch && <SearchMessages />
                }
              </div>
            </>
          ) : (
            <>
              <Empty />
            </>
          )
        }
      </div>
    </>
  );
}

export default Main;
