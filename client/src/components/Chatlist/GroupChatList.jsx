import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvier } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaImage, FaMicrophone } from "react-icons/fa";

function GroupChatList({ data, groupUserChanges }) {
    const [{ userInfo, currentChatUser, messages }, dispatch] = useStateProvier();

    return <div
        onClick={() => {
            groupUserChanges(data.id)
        }}
        className={`flex cursor-pointer items-center ${currentChatUser?.id !== undefined && ((data?.senderId === currentChatUser?.id) !== (data?.receiverId === currentChatUser?.id)) ? 'bg-background-default-hover ' : ''}hover:bg-background-default-hover`}
    >
        <div className="min-w-fit px-5 pt-3 pb-1">
            <Avatar type="lg" image={data?.profilePicture} />
        </div>
        <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
            <div className="flex justify-between">
                <div>
                    <span className="text-white">{data?.name}</span>
                </div>
            </div>
            <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
                <div className="flex justify-between w-full ">
                    <span className="text-secondary line-clamp-1 text-sm">{data?.about}</span>
                </div>
            </div>
        </div>

    </div>;
}

export default GroupChatList;
