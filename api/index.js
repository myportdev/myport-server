import express from "express";
import user from "./controllers/user.js";
import team from "./controllers/team.js";
import profile from "./controllers/profile.js";

const router = express.Router();

router.use("/user", user);
router.use("/team", team);
router.use("/profile", profile);

export default router;
