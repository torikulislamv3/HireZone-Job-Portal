import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: false },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true }, // added name field
  status: { type: String, default: 'Pending' },
  resume: { type: String, default: '' }, // optional: if you want to save resume
  date: { type: Date, default: Date.now },
  title: {type: String,required: true},
  location : {type : String,required: true},
  company: {type : String,required: true}
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;
