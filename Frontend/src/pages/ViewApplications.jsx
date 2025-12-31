
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ViewApplications = () => {
  const { backendUrl } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true); // Start loading
      const { data } = await axios.get(`${backendUrl}/api/applications`);
      if (data.success) {
        setApplications(data.applications);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      toast.error("Error fetching applications");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/applications/${id}/status`,
        { status: newStatus }
      );

      if (data.success) {
        toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[65vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-[65vh]">
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">User Name</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Status / Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={app._id} className="text-gray-700">
              <td className="py-2 px-4 border-b text-center">{index + 1}</td>
              <td className="py-2 px-4 border-b flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                  src={assets.person_icon}
                  alt=""
                />
                <span>{app.name}</span>
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {app.title || app.jobId?.title || "N/A"}
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {app.location || "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                <a
                  href={app.resume || "#"}
                  target="_blank"
                  className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                >
                  Resume <img src={assets.resume_download_icon} alt="" />
                </a>
              </td>
              <td className="py-2 px-4 border-b relative flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    app.status === "Accepted"
                      ? "bg-blue-100 text-blue-700"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
                {app.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Accepted")}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Rejected")}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No applications found.</p>
      )}
    </div>
  );
};

export default ViewApplications;
