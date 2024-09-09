import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Question = () => {
  const { interview_id } = useParams(); // Get the 'id' from the URL
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [answer, setAnswer] = useState(""); // State for the answer input
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Add submitting state
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Function to fetch the question by ID
  const fetchQuestion = async (interview_id) => {
    const token = await getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token for authorization
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/question/${interview_id}`,
        config
      );
      setQuestionId(data.id);
      setQuestion(data.question); // Assuming the API returns { question: "..." }
      setLoading(false);
      if (data.message === "finished") {
        navigate(`/score/${interview_id}`);
      }
    } catch (error) {
      console.error("Error fetching the question:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Start submitting

    const token = await getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token for authorization
      },
    };

    try {
      // Send the answer to the API
      await axios.post(
        `http://localhost:4000/api/answer`,
        { interview_id, answer, questionId }, // Send interview ID and answer
        config
      );
      window.location.reload(); // Reload page after successful submission
    } catch (error) {
      console.error("Error submitting the answer:", error);
      alert("Error submitting the answer");
    } finally {
      setSubmitting(false); // End submitting
    }
  };

  useEffect(() => {
    if (interview_id) {
      fetchQuestion(interview_id); // Fetch question when 'id' is available
    }
  }, [interview_id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Interview</h1>
          <p>Question: {question}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="answer">Answer:</label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {" "}
              {/* Disable button when submitting */}
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Question;
