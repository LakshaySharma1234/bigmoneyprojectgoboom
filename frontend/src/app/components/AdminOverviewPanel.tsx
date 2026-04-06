import { useEffect, useState } from "react";

import { api } from "../services/api";

export function AdminOverviewPanel() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await api.get("/admin/overview");
        setOverview(data);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return <div>Loading operations overview...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">Total Jobs: {overview.total_jobs}</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">Open Jobs: {overview.open_jobs}</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">Filled Jobs: {overview.filled_jobs}</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          Pending Assignments: {overview.pending_assignments}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          Accepted Assignments: {overview.accepted_assignments}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          No-Shows: {overview.no_show_assignments}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Recent Assignments</h3>
        {overview.recent_assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  {assignment.worker_name ?? `Worker #${assignment.worker_id}`}
                </p>
                <p className="text-sm text-slate-600">
                  {assignment.job_title ?? `Job #${assignment.job_id}`}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
