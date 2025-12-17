import express from "express";
import {
  createDailyCheckIn,
  getTodayCheckIn,
} from "../../controllers/personal/dailyCheckIn.js";


const router = express.Router();

router.route("/").post( createDailyCheckIn);

router.route("/today").get( getTodayCheckIn);

export default router;
