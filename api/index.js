import express from "express";
import user from "./controllers/user.js";
import team from "./controllers/team.js";

const router = express.Router();

router.use("/user", user);
router.use("/team", team);

export default router;
