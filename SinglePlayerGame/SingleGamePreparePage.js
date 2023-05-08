import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";

import "styles/views/home/Lobby.scss";

const SingleGamePreparePage = () => {
    // use react-router-dom's hook to access the history
    const [roundNumber, setRoundNumber] = useState(1);
    const [totalRounds, setTotalRounds] = useState(1);
    const [secondsLeft, setSecondsLeft] = useState(10);
    const [gameId, setGameId] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const history = useHistory();

    

    //Counting Time
    useEffect(() => {
        setGameId(localStorage.getItem("gameId"));
        setTotalRounds(localStorage.getItem("totalRounds"));
        setRoundNumber(localStorage.getItem("roundNumber"));
        const intervalId = setInterval(() => {
            setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (secondsLeft === 0) {
            history.push(`/gamePage/${gameId}`);
        }
    }, [secondsLeft, intervalId]);
    
    const handleExitButtonClick = () => {
        history.push("/Home");
    };

    return (
        <div className="round countdown container">
            <div style={{ position: "fixed", top: 75, left: 75 }}>
                <Button
                    style={{ fontSize: "45px", height: "100px", width: "125%" }}
                    onClick={handleExitButtonClick}
                >
                    Exit
                </Button>
            </div>
            <div style={{ dislay: "flex" }}>
                <InformationContainer
                    className="lobby container_left"
                    id="information-container"
                >
                    <div style={{ fontSize: "40px" }}>
                        {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
                        Round {roundNumber} of {totalRounds} is starting soon...
                    </div>
                </InformationContainer>
                <div className="lobby layout" style={{ flexDirection: "row" }}>
                    <InformationContainer
                        className="lobby container_left"
                        id="information-container"
                    >
                        <div className="leader-board">
                            <p>Leaderboard:</p>
                            <p>You {localStorage.getItem("score")} Pts</p>
                        </div>
                    </InformationContainer>
                    <InformationContainer
                        className="lobby container_left round-down-count"
                        id="information-container"
                    >
                        <div style={{ fontSize: "40px" }}>{secondsLeft}</div>
                    </InformationContainer>
                </div>
            </div>
        </div>
    );
};
export default SingleGamePreparePage;
