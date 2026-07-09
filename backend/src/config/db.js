import mongoose, { Mongoose } from 'mongoose'

export async function ConDB(req, res) {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Sucessfully connected to DB")
    } catch (error) {
        console.error("Failed to connect to DB", error)
        process.exit(1)
    }
}