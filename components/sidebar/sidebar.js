import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Card from "../card/card";
import { LogoutIcon } from "@heroicons/react/outline";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/router";

function Sidebar({ channel }) {
  const auth = useContext(AuthContext);

  const router = useRouter();

  return (
    <div className="h-screen w-[365px] ">
      <div className="flex h-[100px] w-full items-center  justify-center rounded-b-[14px] bg-[#E3F6FC] p-2">
        <div className="flex h-[74px] w-[310px] items-center justify-center rounded-xl">
          <div className="flex h-[44px]  w-[280px]">
            <div className="relative h-[44px] w-[44px] rounded-full border-[2px] border-[#F3BA4A] ">
              <Image
                className="rounded-full "
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACCCAMAAAB1sQoZAAAAZlBMVEX///8AAACmpqb8/Pz29vbq6ur5+fmFhYXHx8fv7+99fX3d3d0kJCTT09OysrLm5uaenp5GRkZxcXHBwcGTk5NlZWVPT09cXFw9PT03Nze6uroNDQ1VVVUyMjIXFxeMjIwdHR0rKyuoVkDpAAAD3klEQVR4nO2c6XKqQBCFZVMW2VdRI7z/S143VAwyTPccTN3i/E1SfEXP9E5Wq0WLFi36r2VYfqC75XG3i5NIt0Pz60Chnuwa7an9scy89ReJ1kGuDamKwi8ROdFxkOiqjfcNJLv6THTWTzb7wbLKUaKrBet5keofIdJZJ2dGpGwK0VnlbPYzk4lImrad6agb7mQkTYvngZr+li5qrRmQpp6lTgX+oNeSSJrmopG8SU6gLx2LtBa7ygFho5+85S6CWs8aibpjQkaZiIakFTikNREJ+aICMlOOQqJduptQV8+jI2knEJNsVHnVAVQ3xAymBpMfeFsGEyjA+HsO0wbCRHWYN5UQpg2LqYWk5nL55S/9RSZEumkUC9MkJo7LBDH9xfP0J5lkyt/f2kJ8Ac+PY9Jfm8WEqV28Rvzkz4ogTKvxZqFAPoaJE4RjUCfDZzAlGKSVyYguINNxioQYNlqwyEzAdg81vDTAXh21dIF2xU4kpAra0jRIfhN26W5KCUjwJqu89Qr4gENisHETqFPQh9rJMaV4pLPnlIHazzTE8yQqGDCSEXV32jlMRbKxSHb7PBvradG4vM+k0iOGLbt2nx4ZbD0hEXbvTuDSB40M5URhd4TyLkyYoqzz0Fn6Ng+JVXd+0+dMo3qYwc9HGndxcM+YjOj+W4rt1+/VR4/8zP/kP4ug893OS6WqMDsw3p9cPd2gWSftO1D+shli9356UpVtDgUT9+VwWH7kltX2ot0hydLweZqt93I+VwO1HlyTafqbH4ZjXeT0Hxn8nonmKq6f8WnG0mTjF8kJBnPSg4L0buTGtyO7O2b2Kf7wJ1SCXkqsD+xfGeGHtag7FNN8qXB00BSbNHycI9MJ01PZjv9JxkIyRUR3HUt3c5FbTpoXBwwkqcUUGTHCDKUemCTGChKr3zQqcoOMPpEWi2g9Y3IySRBxmsfpgIlFK7B44zqRSLWxyRyvCHSkrI/xpr9iURynjkUixWKUD++0J/hN5hRKLIKLYk41xSIcKDgTYasGzkRw5Vj3RGNCRrurEvkcGH7vCNEF7Z8otkNmT1QmbKqikcoXB33xKK2fsbpRhSjJCvhA/VBqFwubQJH6BgbWeLRyCmq8PW1+ZrL2MQWirq8gKxfqumYIfFHUNoaBe1EludkawpgY4yramFysmI4kNz6UEGvMgWmLMXekObv1nxQzO7/c7dUB8b8THJ5tMFQp+CDPYXxBMiA1s0WlrtNVtZThq3IJhcJZp6MTPyjraReo3Vwxa24R6tqAnTqnPpVVK58R79uqzGzYco9peXatyymwPeub/9Bg0aJFi5ToH6w4OwT2VSu5AAAAAElFTkSuQmCC"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-grow flex-col pl-2">
              <h1 className=" text-[14px] font-semibold text-black ">
                {auth.user?.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="p-1"></div>
      <div className=" h-[754px]  overflow-y-scroll  rounded-t-[14px] bg-[#E3F6FC]  py-4 pl-2   scrollbar">
        {channel.map((channel) => {
          if (router.query.channel === channel.id) {
            return (
              <div
                key={channel.id}
                onClick={() =>
                  router.push({
                    pathname: "/",
                    query: {
                      channel: channel.id,
                    },
                  })
                }
              >
                <Card
                  channel={channel.id}
                  name={
                    channel.data().members[0] === auth?.user?.username
                      ? channel.data().username[1]
                      : channel.data().username[0]
                  }
                  active
                  lastActive={channel?.data().recentActivity?.toDate()}
                  lastMessage={channel.data()?.message || "No messages"}
                ></Card>
              </div>
            );
          } else {
            return (
              <div
                key={channel.id}
                onClick={() =>
                  router.push({
                    pathname: "/",
                    query: {
                      channel: channel.id,
                    },
                  })
                }
              >
                <Card
                  channel={channel.id}
                  name={
                    channel.data().members[0] === auth.user?.username
                      ? channel.data().username[1]
                      : channel.data().username[0]
                  }
                  lastActive={channel?.data().recentActivity?.toDate()}
                  lastMessage={channel.data()?.message || "No messages"}
                ></Card>
              </div>
            );
          }
        })}
      </div>
      <div className="border-t-[1px] border-[#D0D9DF]">
        <div className="flex h-[80px] w-full items-center rounded-b-[14px] bg-[#E3F6FC] pl-1">
          <div
            onClick={() => {
              auth.logout();
              router.push("/signin");
            }}
          >
            <LogoutIcon className="h-10 rotate-180  text-[#6588DE]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
