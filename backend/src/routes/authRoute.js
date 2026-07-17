import express from 'express'

import {registerLimit, loginLimit} from '../middleware/ratelimit.js'


const router = express.Router()

router.post('/register',
    registerLimit,
    registerUser
)

router.post('/login',
    loginLimit,
    loginUser
)

router.post('/refresh', 
    refreshToken)

router.post('/logout', 
    logout)

export default router;