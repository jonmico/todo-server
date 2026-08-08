import { Router } from "express";
import { createTag } from "../controllers/tags";
import { authenticate } from "../middleware/authenticate";

export const tagsRouter = Router();

tagsRouter.post("/create", authenticate, createTag);
