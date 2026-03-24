import { useEffect, useState } from "react";

import { api } from "../services/api";

export function WorkerApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.get("/applications/worker/me");
        setApplications(data);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (applications.length === 0) {
    return <div>You have not applied to any jobs yet.</div>;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">Job #{application.job_id}</h3>
              <p className="text-sm text-slate-600">
                Applied on {new Date(application.applied_at).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium uppercase text-orange-700">
              {application.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
