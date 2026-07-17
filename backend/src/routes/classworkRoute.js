import express from 'express'
import { authenticate } from '../middleware/verifyToken'
import authorize from '../middleware/verifyRoles'

const router = express.Router()

router.post('/post',
    authenticate,
    authorize("teacher"),
    postClassWork
)

router.get('/classworks',
    authenticate,
    viewAllClassWork
)

router.get("/clasworks/:id",
    authenticate,
    viewClassWork
)

router.put('/classwork/:id',
    authenticate,
    authorize("teacher"),
    editClassWork
)

router.delete('/classwork/:id',
    authenticate,
    authorize('teacher'),
    deleteClassWork
)

export default router