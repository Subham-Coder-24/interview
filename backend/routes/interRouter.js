import express from "express";
const router = express.Router();
import {
  createInterview,
  getQuestion,
  setAnswer,
  getScore
} from "../controller/interController.js";
import { isAuthenticateduser } from "../middleware/auth.js";

router.post("/interview", isAuthenticateduser, createInterview);
router.get("/question/:interview_id", isAuthenticateduser, getQuestion); // This route is protected
router.post("/answer", isAuthenticateduser, setAnswer); // This route is protected
router.get("/scores/:interview_id", isAuthenticateduser, getScore); // This route is protected

export { router };