import { useRouter } from "next/router";
import { createContext, useState } from "react";
import { useEffect, useCallback } from "react";
export const AuthContext = createContext({
  login: (user) => {},
  logout: () => {},

  user: null,
});
let us;
export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(us || null);

  useEffect(() => {
    us = localStorage.getItem("user");
    if (us) {
      setUser(JSON.parse(us));
    }
  }, []);
  const router = useRouter();

  const Logout = useCallback(() => {
    setUser(null);
    localStorage.clear();
  }, []);
  const Login = useCallback((user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        logout: Logout,
        login: Login,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
