import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GETALL_USERS } from "@/utils/ApiRoutes";
import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import GroupChatList from "./GroupChatList";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([])
  const [{ contactsPage }, dispatch] = useStateProvier();
  const [groupUsers, setGroupUsers] = useState([]);




  useEffect(() => {

    if (searchTerm.length > 0) {

      const filteredData = {};

      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      });
      setSearchContacts(filteredData);


    } else {
      setSearchContacts(allContacts);
    }

  }, [searchTerm])


  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users } } = await axios.get(GETALL_USERS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (error) {
        console.log(error);
      }
    }
    getContacts();

  }, [])

  const groupUserChanges = (userId) => {

    if (groupUsers?.includes(userId)) {
      console.log("already in group")
    } else {
      console.log("Added in group")
      setGroupUsers([...groupUsers, userId]);
    }



  }

  return <div className="h-full flex flex-col">
    <div className="h-24 flex items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white">
        <BiArrowBack
          className="cursor-pointer text-xl"
          onClick={() => {
            dispatch({
              type: reducerCases.SET_CONTACTS_PAGE,
              page: contactsPage === "all-contacts" ? "default" : "all-contacts"
            })
          }}
        />
        <span>{contactsPage === "all-contacts" ? "New Chat" : "Add Members"}</span>
      </div>
    </div>

    <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
      <div className="flex py-3 items-center gap-3 h-14">
        <div className="bg-panel-header-background flex items-center gap-3 px-3 py-1 rounded-lg flex-grow mx-4">
          <div>
            <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l " />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Contacts"
              className="bg-transparent text-sm focus:outline-none text-white w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {
        contactsPage === "all-contacts" && (
          <div className="bg-search-input-container-background flex-auto overflow-auto custom-scrollbar">
            <div className="min-h-full flex flex-col justify-center mt-3 px-3 w-full text-center ">
              <button
                className="bg-icon-green p-5 rounded-xl flex flex-row gap-2 items-center justify-center"
                onClick={() => {
                  dispatch({
                    type: reducerCases.SET_CONTACTS_PAGE,
                    page: "create-group"
                  })
                }}
              >
                <AiOutlineUsergroupAdd className="h-7 w-7" />
                <span className="text-white text-lg">Create Group</span>
              </button>
            </div>
          </div>
        )
      }

      {
        <div className="grid grid-cols-3 gap-4 mt-2">
          <span class="px-1 py-2 flex items-center text-base rounded-full text-indigo-500 border border-indigo-500 undefined ">
            <svg width="20" fill="currentColor" height="20" class="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
              </path>
            </svg>
            Jhon Wick
            <button class="bg-transparent hover">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="ml-2" viewBox="0 0 1792 1792">
                <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z">
                </path>
              </svg>
            </button>
          </span>
        </div>
      }





      {
        Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              {
                userList.length > 0 && (
                  <div className="text-teal-light pl-10 py-5">
                    {initialLetter}
                  </div>
                )
              }
              {
                userList.map((contact) => (

                  contactsPage === "all-contacts" ? (
                    <ChatLIstItem
                      data={contact}
                      isContactPage={true}
                      key={contact.id}

                    />
                  ) : (

                    !groupUsers.includes(contact.id) && (
                      <GroupChatList
                        data={contact}
                        key={contact.id}
                        groupUserChanges={groupUserChanges}
                      />
                    )


                  )
                ))
              }
            </div>
          )
        })
      }
    </div>
  </div>;
}

export default ContactsList;
