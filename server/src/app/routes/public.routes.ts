import { Router } from "express";
import { authenticateUser, refreshAccessToken } from "../controllers/authentication.controller";

const publicRoutes = Router();
publicRoutes.use("/authenticate", authenticateUser);
publicRoutes.post("/refreshToken", refreshAccessToken);

export default publicRoutes;