import { useEffect, useState } from "react";

import { api } from "../services/api";
import { Button } from "./ui/button";

export function WorkerAssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      const data = await api.get("/assignments/worker/me");
      setAssignments(data);
      setError(null);
    } catch (fetchError) {
      setError(fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const updateAssignment = async (assignmentId, action) => {
    try {
      await api.post(`/assignments/${assignmentId}/${action}`, {});
      await fetchAssignments();
    } catch (requestError) {
      alert(`Unable to ${action} assignment: ${requestError.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading assignments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (assignments.length === 0) {
    return <div>You do not have any assignments yet.</div>;
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                {assignment.job_title ?? `Job #${assignment.job_id}`}
              </h3>
              <p className="text-sm text-slate-600">{assignment.job_location ?? "Location pending"}</p>
              <p className="text-sm text-slate-600">
                Status: <span className="font-medium uppercase">{assignment.status}</span>
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              Reliability {Number(assignment.worker_reliability_score ?? 0).toFixed(2)}
            </div>
          </div>
          {assignment.status === "pending" ? (
            <div className="mt-4 flex gap-2">
              <Button onClick={() => updateAssignment(assignment.id, "accept")}>Accept</Button>
              <Button variant="destructive" onClick={() => updateAssignment(assignment.id, "reject")}>
                Reject
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
