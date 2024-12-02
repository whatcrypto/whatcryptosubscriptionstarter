import { useGlobalDataContext } from "@/contexts/GlobalDataContext";
import { USER } from "@/types/user";
import { useEffect, useState } from "react";

const defaultUserObj: USER = {
  isLoggedIn: false,
  isGuest: true,
  userName: "",
  loading: false,
  name: "",
  plans: "",
  userID: "",
  theme: "light",
  user: {} as USER["user"],
  currency: null,
  user_hash: "",
};

export default function useUser() {
  const { user: defaultUser } = useGlobalDataContext();

  const [user, setUser] = useState<USER>(() => {
    // Set initial user state with default theme
    const theme =
      typeof window !== "undefined"
        ? window.localStorage.getItem("theme") || "light"
        : "light";
    return { ...defaultUserObj, theme };
  });

  useEffect(() => {
    // Get the theme from localStorage
    const theme =
      typeof window !== "undefined"
        ? window.localStorage.getItem("theme") || "light"
        : "light";

    // Only update the user state if the user data has changed
    if (
      defaultUser &&
      Object.keys(defaultUser).length > 0 &&
      defaultUser.user
    ) {
      const updatedUser = { ...defaultUser, theme };
      if (JSON.stringify(user) !== JSON.stringify(updatedUser)) {
        setUser(updatedUser);
      }
    } else if (
      JSON.stringify(user) !== JSON.stringify({ ...defaultUserObj, theme })
    ) {
      setUser({ ...defaultUserObj, theme });
    }
  }, [defaultUser]);

  return user;
}
