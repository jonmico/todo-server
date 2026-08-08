import { Router } from "express";
import { createTag, getTags } from "../controllers/tags";
import { authenticate } from "../middleware/authenticate";

export const tagsRouter = Router();

tagsRouter.post("/create", authenticate, createTag);
tagsRouter.get("/", authenticate, getTags);
