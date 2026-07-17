import express from "express";
import { authenticate } from "../middleware/verifyToken";
import authorize from "../middleware/verifyRoles";

const router = express.Router()


router.get("/works",
    authenticate,
    authorize("teacher"),
    viewAllWork
)

router.get("/work/:id",
    authenticate,
    authorize("teacher"),
    viewWork
)

router.post("/score",
    authenticate,
    submitWork
)

router.post("/score/:id",
    authenticate,
    authorize("teacher"),
    giveScore
)

router.put("/score/:id",
    authenticate,
    authorize("teacher"),
    editScore
)

router.put("/:id",
    authenticate,
    editSubmit
)

router.delete("/:id",
    authenticate,
    deleteSubmittedWork
)

export default router