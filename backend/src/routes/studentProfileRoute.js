import express from 'express'
import authorize from '../middleware/verifyRoles'
import { authenticate } from '../middleware/verifyToken'
import User from '../model/User'

const router = express.Router()

router.get("/user/profile",
    authenticate,
    authorize("admin"),
    getProfiile
)

router.get("/account",
    authenticate,
    getAccountProfile
)

router.post("/profile", 
    authenticate,
    postProfile
)

router.put("/profile/:id",
    authenticate,
    editProfile
)

export default router