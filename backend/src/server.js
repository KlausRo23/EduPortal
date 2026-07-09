import express from 'express'
import { ConDB } from './config/db'


const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())

app.use(helmet())

app.use()

ConDB().then(app.listen(PORT, () => {
    console.log("Connected to PORT: ", PORT)
}))