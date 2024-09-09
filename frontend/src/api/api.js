import axios from "axios";
import { getConfig } from "./apiConfig"; // Adjust the path as necessary

export const submitInterviewData = async (interviewData) => {
  const config = await getConfig(); // Fetch the config with token

  try {
    // Submit the form data to the API
    const { data } = await axios.post(
      "http://localhost:4000/api/interview",
      interviewData,
      config
    );

    return data;
  } catch (error) {
    console.error("Error submitting the interview data:", error);
    throw error;
  }
};

export const getQuestion = async (interview_id) => {
  try {
    // Submit the form data to the API
    const { data } = await axios.get(
      `http://localhost:5000/api/question/${interview_id}`,
      getConfig
    );
    return data;
  } catch (error) {
    console.error("Error submitting the interview data:", error);
    throw error;
  }
};
