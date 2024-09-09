import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

export const createInterview = async (req, res) => {
  const { destination, experience } = req.body;

  try {
    // Step 1: Create a new interview for the user
    const newInterview = await prisma.interview.create({
      data: {
        destination,
        experience,
        user_id: req.user_id,
      },
    });

    // Step 2: Fetch AI-generated questions
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `give me five interview questions for ${destination} with for 
    ${experience} years of experience in a json format with question no like "1":"question"`;
    const result = await model.generateContent(prompt);
    const rawData = result.response.text();
    const cleanedData = rawData.replace(/```json\n|```|\n/g, "");
    const jsonData = JSON.parse(cleanedData);
    const questions = Object.values(jsonData);

    // Step 3: Create multiple questions in the Question table
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((question) => ({
        question, // Set the question text from AI
        interview_id: newInterview.id, // Associate it with the newly created interview
      })),
    });

    return res.status(201).json({
      message: "success",
      interview: newInterview,
      createdQuestions: createdQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestion = async (req, res) => {
  const { interview_id } = req.params;

  try {
    const questions = await prisma.question.findMany({
      where: {
        interview_id: parseInt(interview_id),
        answer: null,
      },
    });
    if (questions.length === 0) {
      return res.status(200).json({ message: "finished" });
    }

    const randomIndex = Math.floor(Math.random() * questions.length);

    res.json(questions[randomIndex]);
  } catch (error) {
    console.error("Error fetching the question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const setAnswer = async (req, res) => {
  const { interview_id, answer, questionId } = req.body; // Get the 'id' from the URL parameters

  try {
    const getQes = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId), // Fetch the question by its ID
      },
    });
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `I have a candidate’s answer to a specific interview question, and I need to determine how accurate it is. Please review the provided answer and evaluate it based on the correctness and completeness of the response. Provide a percentage score reflecting how much of the answer is correct or relevant. Here is the question and the candidate's answer:
      Question: ${getQes.question}
      Candidate's Answer: ${answer}
      Give me only percentage score.`;
    const result = await model.generateContent(prompt);
    const rawData = result.response.text();
    const score = parseInt(rawData);

    // Update the question with the provided answer
    const updatedQuestion = await prisma.question.update({
      where: {
        id: parseInt(questionId), // Use questionId to find the specific question
      },
      data: {
        answer: answer, // Set the answer field
        score: score,
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching the question:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getScore = async (req, res) => {
  const { interview_id } = req.params; // Get interview_id from URL params

  try {
    const id = parseInt(interview_id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid interview ID" });
    }

    const scores = await prisma.question.findMany({
      where: { interview_id: id },
    });
    let averageScore = 0;
    for (var i = 0; i < scores.length; i++) {
      averageScore = averageScore + scores[i].score;
    }

    if (scores.length === 0) {
      return res
        .status(404)
        .json({ message: "No scores found for this interview ID" });
    }
    return res.status(200).json({ averageScore, questions: scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
