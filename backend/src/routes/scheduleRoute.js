import express from 'express'
import { authenticate } from '../middleware/verifyToken'

const router = express.Router()

router.get("/schedule", 
    authenticate,
    getAllSchedule
)

router.get("/schedule/:id",
    authenticate,
    getScheduleDetails
)

export default router