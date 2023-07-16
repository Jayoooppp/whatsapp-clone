import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GETALL_USERS } from "@/utils/ApiRoutes";
import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([])
  const [{ }, dispatch] = useStateProvier();

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
  return <div className="h-full flex flex-col">
    <div className="h-24 flex items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white">
        <BiArrowBack
          className="cursor-pointer text-xl"
          onClick={() => {
            dispatch({
              type: reducerCases.SET_ALL_CONTACTS_PAGE
            })
          }}
        />
        <span>New Chat</span>
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
                  <ChatLIstItem
                    data={contact}
                    isContactPage={true}
                    key={contact.id}

                  />
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
