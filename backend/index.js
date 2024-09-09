import express from "express";
// import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});
// Middleware
app.use(cors());
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());

// Routes
import { router as interRoutes } from "./routes/interRouter.js";

// Use Routes
app.use("/api", interRoutes);

// Function to process the raw data


app.get("/", async (req, res) => {
  // Make sure to include these imports:
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const destination = "web developer";
  const experience = "junior";
  const prompt = `give me five interview questions for ${destination} with for ${experience} 
  years of experience in a json format with question no like "1":"question"`;
  const result = await model.generateContent(prompt);
  const rawData = result.response.text();
  const cleanedData = rawData.replace(/```json\n|```|\n/g, "");
  const jsonData = JSON.parse(cleanedData);
  const questions = Object.values(jsonData);
  console.log(questions);
  return res.status(200).json(questions);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
