
import JobApplication from "../models/JobApplication.js";

// Create a new job application
export const createApplication = async (req, res) => {
  try {
    const {
      userId,
      jobId,
      companyId,
      title,
      location,
      company,
      name,
      status,
      resume,
      date,
    } = req.body;

    // Validate required fields
    if (!jobId || !companyId || !title || !location || !company || !name || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check duplicate
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId: userId || null,
      name,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Save new application
    const newApplication = new JobApplication({
      userId: userId || null,
      jobId,
      companyId,
      title,
      location,
      company,
      name,
      status: status || "Pending",
      resume: resume || "",
      date,
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Create Application Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating application",
    });
  }
};

// Get all applications
export const getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobId", "title")
      .populate("companyId", "name");

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status",
    });
  }
};
