
import { api } from "helpers/api";

export const fetchQuestions = async (gameId) => {
    const response = await api.get(
        `/games/${gameId}/questions`
    );

    console.log("Response: ", response);
    const question = response.data;

    setLocalStorageItems(question);
    console.log("Questions: ", question);
}

export const setLocalStorageItems = (question) => {
    const cityNamesString = JSON.stringify([
        question.option1,
        question.option2,
        question.option3,
        question.option4,
    ]);
    localStorage.setItem("citynames2", cityNamesString);
    localStorage.setItem("PictureUrl", question.pictureUrl);
    localStorage.setItem("CorrectOption", question.correctOption);
};