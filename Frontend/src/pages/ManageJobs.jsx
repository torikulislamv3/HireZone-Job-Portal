
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ManageJobs = () => {
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  // Fetch company jobs
  const fetchCompanyJobs = async () => {
    try {
      setLoading(true); // Start loader
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobsData.reverse());
        console.log(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Change job visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyToken]);

  return (
    <div className="container p-4 max-w-5xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
                  <th className="py-2 px-4 border-b text-left">Job Title</th>
                  <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
                  <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
                  <th className="py-2 px-4 border-b text-center">Applicants</th>
                  <th className="py-2 px-4 border-b text-left">Visible</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr className="text-gray-700" key={index}>
                    <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{job.title}</td>
                    <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format("ll")}</td>
                    <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                    <td className="py-2 px-4 border-b text-center">{job.applicants}</td>
                    <td className="py-2 px-4 border-b">
                      <input
                        onChange={() => changeJobVisibility(job._id)}
                        className="scale-125 ml-4"
                        type="checkbox"
                        checked={job.visible}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate("/dashboard/add-job")}
              className="bg-black text-white py-2 px-4 rounded"
            >
              Add New Job
            </button>
          </div>
        </>
      )}

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ManageJobs;

