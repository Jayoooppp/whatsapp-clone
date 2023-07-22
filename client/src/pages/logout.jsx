import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {

  const [{ socket, userInfo }, dispatch] = useStateProvier()
  const router = useRouter();
  useEffect(() => {
    socket.current.emit("signout", userInfo.id)
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined })
    signOut(fireBaseAuth);
    router.push("/login")
  }, [socket])

  return <div className="bg-conversation-panel-background"></div>;
}

export default logout;
