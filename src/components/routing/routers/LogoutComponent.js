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
      localStorage.removeItem("gameId");
      localStorage.removeItem("category");
      localStorage.removeItem("citynames");
      localStorage.removeItem("survival");
      localStorage.removeItem("score");
      localStorage.removeItem("myScore");
      localStorage.removeItem("correctOption");
      localStorage.removeItem("roundNumber");
      localStorage.removeItem("isServer");
      localStorage.removeItem("totalRounds");
      localStorage.removeItem("PictureUrl");


    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default LogoutComponent;