import express from 'express'
import { authenticate } from '../middleware/verifyToken'
import authorize from '../middleware/verifyRoles'

const router = express.Router()

router.post('/create',
    authenticate,
    authorize("admin"),
    createAnnouncement
)

router.get("/view",
    authenticate,
    viewAnnouncement
)

router.delete("/remove/:id",
    authenticate,
    authorize("admin"),
    deleteAnnouncement
)

router.put('/update/:id',
    authenticate,
    authorize("admin"),
    updateAnnouncement
)

router.delete('/:id/like',
    authenticate,
    unlikeAnnouncement
)

router.put('/:id/like',
    authenticate,
    likeAnnouncement
)

export default router

