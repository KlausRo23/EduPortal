import express from 'express'
import { authenticate } from '../middleware/verifyToken'
import authorize from '../middleware/verifyRoles'

const router = express.Router()

router.get("/courses",
    authenticate,
    viewAllCourses
)

router.get("/courses/:id",
    authenticate,
    checkCourse
)

router.get("/students",
    authenticate,
    viewStudentList
)

router.post("/create",
    authenticate,
    authorize("teacher"),
    createCourse
)

router.post("/add",
    authenticate,
    authorize("teacher"),
    addStudent
)

router.put("/:id",
    authenticate,
    authorize("teacher"),
    editCourse
)

router.delete("/:id",
    authenticate,
    authorize("teacher"),
    deleteCourse
)

router.delete('/:courseId/students',
    authenticate,
    authorize("teacher"),
    kickStudent
)

export default router