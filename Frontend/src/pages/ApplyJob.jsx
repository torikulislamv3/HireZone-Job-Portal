
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [applicantName, setApplicantName] = useState("");

  const { jobs, backendUrl } = useContext(AppContext);

  // Fetch single job
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // Apply handler
  const applyHandler = async () => {
    try {
      if (!applicantName.trim()) return toast.error("Name is required!");

      const { data } = await axios.post(`${backendUrl}/api/applications`, {
        userId: null,
        jobId: jobData._id,
        title: jobData.title,                  // title from jobData
        location: jobData.location,            // location from jobData
        company: jobData.companyId.name,       // company from jobData
        companyId: jobData.companyId._id,
        name: applicantName,
        status: "Pending",
        resume: "",
        date: Date.now(),
      });

      if (data.success) {
        toast.success("Application submitted successfully!");
        setOpenModal(false);
        navigate("/applications");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!jobData) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Job Header */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 border"
                src={jobData.companyId.image}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-center md:text-end">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 hover:bg-blue-700 transition px-10 py-2.5 text-white rounded-lg"
              >
                Apply Now
              </button>
              <p className="mt-2 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-10 mt-10">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 hover:bg-blue-700 transition px-10 py-2.5 text-white rounded-lg mt-10"
              >
                Apply Now
              </button>
            </div>

            {/* More Jobs */}
            <div className="w-full lg:w-1/3 space-y-5">
              <h2 className="font-semibold">
                More Jobs From {jobData.companyId.name}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id
                )
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Confirm Application
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobData.title}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={jobData.companyId.name}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={jobData.location}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                />
              </div>

              <button
                onClick={applyHandler}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-medium"
              >
                Confirm Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ApplyJob;
