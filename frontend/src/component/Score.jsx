import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams for URL parameters

const Score = () => {
  const { interview_id } = useParams(); // Get interview_id from URL params
  const [averageScore, setAverageScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth(); // Hook to get the token
  console.log(questions);

  useEffect(() => {
    // Function to fetch the average score
    const fetchAverageScore = async () => {
      try {
        const token = await getToken(); // Get the token
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token for authorization
          },
        };
        const { data } = await axios.get(
          `http://localhost:4000/api/scores/${interview_id}`,
          config
        );
        setQuestions(data.questions);
        setAverageScore(data.averageScore); // Assuming API response contains averageScore
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageScore();
  }, [interview_id]); // Dependency array includes interview_id

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Average Score</h1>
      {averageScore !== null ? (
        <p>{averageScore}</p>
      ) : (
        <p>No score available</p>
      )}
      {questions.map((question) => (
        <div key={question.id}>
          <div>Questions: {question.question}</div>
          <div>Score: {question.score}</div>
        </div>
      ))}
    </div>
  );
};

export default Score;
