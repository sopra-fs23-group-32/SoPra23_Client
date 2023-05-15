import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import "styles/views/home/ScoreBoard.scss";

const ScoreBoard = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [userRanking, setUserRanking] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("WORLD");

    const goProfile = (profileId) => {
        localStorage.setItem("profileId", profileId);
        history.push("/home/profile");
    };

    useEffect(() => {
        async function fetchData() {
            try {
                let urlCategory;
                if (selectedCategory === "WORLD") {
                    urlCategory = "/users/ranking";
                } else {
                    urlCategory = "/users/ranking?category=" + selectedCategory;
                }
                const response = await api.get(urlCategory);
                // This is just a fake async call, so that the spinner can be displayed
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Get the returned users and update the state.
                setUserRanking(response.data);
                console.log(response);
            } catch (error) {
                console.error(
                    `An error occurs while fetching the userRanking: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert("Something went wrong while fetching the userRanking.");
            }
        }
        fetchData();
    }, [selectedCategory]);

    const UserRanking = ({ userRanking }) => (
        <>
            <TableContainer
                component={Paper}
                sx={{ backgroundColor: "transparent" }}
            >
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                    className="score-table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">UserNme</TableCell>
                            <TableCell align="center">
                                Overall Ranking
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userRanking.map((user, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.rank}.
                                </TableCell>
                                <TableCell align="center">
                                    <p onClick={() => goProfile(user.userId)}>
                                        {user.username}
                                    </p>
                                </TableCell>
                                <TableCell align="center">
                                    {user.score} Points
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
    UserRanking.propTypes = {
        user: PropTypes.object,
    };

    let sortedUserList = <Spinner />;

    if (userRanking) {
        sortedUserList = <UserRanking userRanking={userRanking} />;
    }

    return (
        <div className="scoreboard container">
            <div className="headerrow">
                <h2>Rank</h2>
            </div>
            <div className="scoreboard scorelist">
                <div>{sortedUserList}</div>
                <div className="scoreboard">
                    <InputLabel className="scoreboard label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        className="scoreboard category"
                        label="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        inputProps={{
                            MenuProps: {
                                sx: {
                                    borderRadius: "10px",
                                },
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: "#1979b8",
                                        color: "white",
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="WORLD">All</MenuItem>
                        <MenuItem value="AFRICA">Africa</MenuItem>
                        <MenuItem value="ASIA">Asia</MenuItem>
                        <MenuItem value="EUROPE">Europe</MenuItem>
                        <MenuItem value="NORTH_AMERICA">North America</MenuItem>
                        <MenuItem value="OCEANIA">Oceania</MenuItem>
                        <MenuItem value="SOUTH_AMERICA">South America</MenuItem>
                    </Select>
                </div>
            </div>

            <div className="scoreboard button-container">
                <Button width="300%" onClick={() => history.push("/home")}>
                    Return to Home
                </Button>
            </div>
        </div>
    );
};

export default ScoreBoard;
