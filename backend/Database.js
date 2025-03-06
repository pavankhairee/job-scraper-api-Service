
import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
    title: String,
    company: String,
    location: String,
    link: { type: String, unique: true },
    qualifications: String
})

export const JobModel = mongoose.model('Job', JobSchema)