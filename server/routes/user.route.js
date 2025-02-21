import expess from "express";
import { bmi, register, saveExerciseSession } from "../controller/user.controller.js";
import { login } from "../controller/user.controller.js";
import { getLeaderboard } from "../controller/user.controller.js";
import { getProfile } from "../controller/user.controller.js";
import { deleteAccount } from "../controller/user.controller.js";
import { updateNameAndPass } from "../controller/user.controller.js";
import { isAuth } from "../middleware/isAuthenticated.js";
import { getAnalytics } from "../controller/user.controller.js";
import { verifyToken } from "../controller/user.controller.js";
import { updateExerciseCount } from "../controller/user.controller.js";

import { getExerciseHistory } from "../controller/user.controller.js";

const router = expess.Router();

router.route("/verifyToken").get(verifyToken);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getLeaderboard").get(getLeaderboard);
router.route("/getProfile").get(isAuth, getProfile);
router.route("/deleteAccount").delete(isAuth, deleteAccount);
router.route("/updateNameAndPass").post(isAuth, updateNameAndPass);
router.route("/getAnalytics").get(isAuth, getAnalytics);
router.route("/updateExerciseCount").post(isAuth, updateExerciseCount);
router.route("/getExerciseHistory").get(isAuth, getExerciseHistory);
router.route("/bmi").get(isAuth, bmi);
router.route("/saveExerciseSession").get(isAuth,saveExerciseSession);


export default router;
