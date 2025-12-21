import express from "express";
import {
  ChangeJobApplicationsStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

// Company Login
router.post("/login", loginCompany);

// Get company data
router.get("/company", protectCompany, getCompanyData);

// post a job
router.post("/post-job", protectCompany, postJob);

// Get Applicants data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// Get Company Job List
router.get("list-jobs", protectCompany, getCompanyPostedJobs);

// change Applications status
router.post("/change-status", protectCompany, ChangeJobApplicationsStatus);

// change applications visibility
router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
