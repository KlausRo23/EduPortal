import express from 'express'
import cookieparser from 'cookie-parser'

import { ConDB } from './config/db.js'
import {globalLimit} from './middleware/ratelimit.js'
import authRoute from './routes/authRoute.js'

dotenc.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app/use(cookieparser())

app.use(globalLimit)

app.use('auth/api/', authRoute)


ConDB().then(app.listen(PORT, () => {
    console.log("Connected to PORT: ", PORT)
}))