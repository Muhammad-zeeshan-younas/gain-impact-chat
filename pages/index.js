import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Sidebar from "../components/sidebar/sidebar";
import Chat from "../components/chat/chat";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useRouter } from "next/router";
const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  useEffect(() => {
    setLoading(true);
    if (!auth.user) {
      router.replace("/signin");
    }
  }, []);
  const [channel, setChannel] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (auth.user) {
        onSnapshot(
          query(
            collection(db, "channels"),

            where("members", "array-contains", auth.user.username)
          ),
          (snapshot) => {
            setChannel(
              snapshot.docs.sort(function (x, y) {
                return y.data().recentActivity - x.data().recentActivity;
              })
            );
          }
        );
      }
    };
    getData();
  }, [db]);

  if (!router.query.channel) {
    router.query.channel = channel[0]?.id;
  }
  return (
    <div className="flex">
      <Sidebar channel={channel} />
      {router.query.channel && (
        <Chat channel={router.query.channel} channels={channel} />
      )}
    </div>
  );
};

export default Home;
