import express from 'express'

import { authenticate } from '../middleware/verifyToken'
import authorize from '../middleware/verifyRoles'



const router = express.Router()

router.get("/view",
    authenticate,
    viewAttendance
)

router.post("/attendance",
    authenticate,
    authorize("teacher"),
    postAttendance
)

router.delete('/delete/:id',
    authenticate,
    authorize("teacher"),
    deleteAttendnace
)

router.post('/update/:id',
    authenticate,
    authorize("teacher"),
    updateAttendance
)

export default router