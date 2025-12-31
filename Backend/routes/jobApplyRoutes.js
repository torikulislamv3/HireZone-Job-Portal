// import express from "express";
// import { createApplication, getApplications } from "../controllers/jobApplyController.js";

// const router = express.Router();

// // POST /api/applications
// router.post("/", createApplication);

// // GET /api/applications
// router.get("/", getApplications);

// export default router;


import express from "express";
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
} from "../controllers/jobApplyController.js";

const router = express.Router();

// Create application
router.post("/", createApplication);

// Get all applications
router.get("/", getApplications);

// Update status (Accept / Reject)
router.patch("/:id/status", updateApplicationStatus);

export default router;
