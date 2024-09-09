import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./component/user";
import Interview from "./component/Interview";

import Sign from "./component/Sign";
import { useUser } from "@clerk/clerk-react";
import Question from "./component/Question";
import Score from "./component/Score";
import Demo from "./component/Demo";

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) {
    return "loading...";
  }
  return (
    <Router>
      <Routes>

        <Route path="/demo" element={<Demo />} />
        <Route path="/" element={isSignedIn ? <User /> : <Sign />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/question/:interview_id" element={<Question />} />
        <Route path="/score/:interview_id" element={<Score />} />
      </Routes>
    </Router>
  );
}

export default App;
