import expess from "express";
import { register } from "../controller/user.controller.js";
import { login } from "../controller/user.controller.js";
import { getLeaderboard } from "../controller/user.controller.js";
import { getProfile } from "../controller/user.controller.js";
import { deleteAccount } from "../controller/user.controller.js";
import { updateNameAndPass } from "../controller/user.controller.js";
import { isAuth } from "../middleware/isAuthenticated.js";
import { getAnalytics } from "../controller/user.controller.js";

const router = expess.Router();


router.route("/register").post(register)
router.route("/login").post(login)
router.route("/getLeaderboard").get(getLeaderboard)
router.route("/getProfile").get(isAuth,getProfile)
router.route("/deleteAccount").delete(isAuth,deleteAccount)
router.route("/updateNameAndPass").post(isAuth,updateNameAndPass)
router.route("/getAnalytics").post(isAuth,getAnalytics)



export default router;