import React, { useContext, useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import Message from "../message/message";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../context/authContext";

function Chat({ channel, channels }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (router.query.channel) {
      onSnapshot(
        query(
          collection(db, "channels", channel, "message"),
          orderBy("timestamp", "asc")
        ),

        (snapshot) => {
          setMessages(snapshot.docs);
        }
      );
    }
  }, [router.query]);
  const handleMessage = async (event) => {
    event.preventDefault();

    await addDoc(collection(db, "channels", channel, "message"), {
      message,
      name: auth.user?.name,
      timestamp: serverTimestamp(),
      username: auth.user?.username,
    });
    const channelRef = doc(db, "channels", channel);
    await updateDoc(channelRef, {
      recentActivity: serverTimestamp(),
    });
    setMessage("");
  };

  return (
    <>
      <div className=" w-full">
        <div className="   h-[95vh] overflow-y-auto bg-[#FFFFFF] p-12">
          <div className="grid w-full place-items-center p-5">
            <div className=" flex h-[26px] w-[114px] items-center justify-center rounded-[14px] bg-[#6588DE] text-[12px] text-white ">
              <Moment format="DD/MM/YYYY">
                {messages[0]?.data().timestamp?.toDate()}
              </Moment>
            </div>
          </div>
          <div className=" mb-6 space-y-5">
            {messages.map((message) => {
              if (message.data().username === auth.user?.username) {
                return (
                  <Message
                    timestamp={message.data().timestamp?.toDate()}
                    name={message.data().name}
                    message={message.data().message}
                    reciever
                    key={message.id}
                  />
                );
              } else {
                return (
                  <Message
                    timestamp={message.data().timestamp?.toDate()}
                    name={message.data().name}
                    message={message.data().message}
                    key={message.id}
                  />
                );
              }
            })}
          </div>
        </div>
        <form
          onSubmit={handleMessage}
          className="flex items-center justify-center "
        >
          <div className="relative flex h-[40px] w-[1450px] rounded-xl border-[1px] border-[#96A9BA]">
            <input
              className=" flex h-full w-full rounded-xl px-4 outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>

            <button
              type="submit"
              className="text-10px absolute right-0 flex h-full w-[140px] items-center justify-center rounded-xl bg-[#6588DE] text-white"
            >
              Submit{" "}
              <span className="pl-2">
                <PaperAirplaneIcon className="h-4 rotate-90 text-base" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Chat;
