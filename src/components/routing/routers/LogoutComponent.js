import { useEffect } from "react";

const LogoutComponent = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("sameCoundownTime");
      localStorage.removeItem("gamePlayer");
      localStorage.removeItem("players_local");
      localStorage.removeItem("id");
      localStorage.removeItem("newTimeLeft");
      localStorage.removeItem("targetPlayerNumber");
      localStorage.removeItem("players");
      localStorage.removeItem("gameId")
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Return your logout UI or null if you don't need a visible logout component
  return null;
};

export default LogoutComponent;