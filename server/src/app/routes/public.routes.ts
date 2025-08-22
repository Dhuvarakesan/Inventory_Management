import { Router } from "express";
import { authenticateUser, refreshAccessToken } from "../controllers/authentication.controller";

const publicRoutes = Router();
publicRoutes.use("/authenticate", authenticateUser);
publicRoutes.post("/refresh-token", refreshAccessToken);

export default publicRoutes;