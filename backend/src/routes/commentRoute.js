import express from 'express'
import { authenticate } from '../middleware/verifyToken'

const router = express.router()

router.post('/:announcementId/comment',
    authenticate,
    commentAnnouncement
)

router.get('/:announcementId/comments',
    authenticate,
    getAllAnnouncementComment
)

router.put('/:announcementId/:id',
    authenticate,
    editComment
)

router.delete('/:announcementId/:id',
    authenticate,
    deleteAnnouncementComment
)

router.get('/:classWorkId/comment',
    authenticate,
    commentClassWork
)

router.post('/:classWorkId/post',
    authenticate,
    postCommentClassWork
)

router.put('/:classWorkId/:id',
    authenticate,
    editClassWorkComment
)

router.delete("/:classWorkId/:id",
    authenticate,
    deleteClassWorkComment
)

export default router