import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ApplicationListItem } from "./ApplicationListItem";

export function ApplicationList({ jobId }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applications = await api.get(`/applications/job/${jobId}`);
        setApplications(applications);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const handleAccept = async (applicationId, workerId) => {
    try {
      await api.post("/assignments/create", {
        job_id: jobId,
        worker_id: workerId,
      });
      const updatedApplications = applications.filter((app) => app.id !== applicationId);
      setApplications(updatedApplications);
      alert("Assignment created. The worker now needs to accept it.");
    } catch (error) {
      alert(`Error accepting application: ${error.message}`);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: "rejected",
      });
      const updatedApplications = applications.filter((app) => app.id !== applicationId);
      setApplications(updatedApplications);
    } catch (error) {
      alert(`Error rejecting application: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (applications.length === 0) {
    return <div>No applications for this job yet.</div>;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationListItem 
            key={application.id} 
            application={application} 
            onAccept={() => handleAccept(application.id, application.worker_id)}
            onReject={() => handleReject(application.id)}
        />
      ))}
    </div>
  );
}
