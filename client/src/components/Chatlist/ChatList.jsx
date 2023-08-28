import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvier } from "@/context/StateContext";
import ContactsList from "./ContactsList";


function ChatList() {
  const [{ contactsPage }] = useStateProvier();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage === "all-contacts") {
      setPageType("all-contacts")
    } else if (contactsPage === "create-group") {
      setPageType("create-group")
    } else {
      setPageType("default")
    }
  }, [contactsPage])

  console.log(contactsPage)

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && (
        <>
          <ContactsList />
        </>
      )}
      {
        pageType === "create-group" && (
          <>
            <ContactsList />
          </>
        )
      }
    </div>
  )
}

export default ChatList;
