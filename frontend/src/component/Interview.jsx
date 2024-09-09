import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const Interview = () => {
  const [destination, setDestination] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const experienceLevels = ["Junior", "Mid-Level", "Senior"];
  const destinationLevels = ["Web", "Android", "Crypto"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const interviewData = {
      destination,
      experience,
    };

    const token = await getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/interview",
        interviewData,
        config
      );

      navigate(`/question/${data.interview.id}`);
    } catch (error) {
      console.error("Error submitting the interview data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2>Interview Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="destination">Destination:</label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select Destination</option>
            {destinationLevels.map((level) => (
              <option key={level} value={level.toLowerCase()}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="experience">Experience:</label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="">Select Experience</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level.toLowerCase()}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {" "}
          {/* Disable button when loading */}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Interview;
