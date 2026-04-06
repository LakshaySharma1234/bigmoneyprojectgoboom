import { useEffect, useState } from "react";

import { api } from "../services/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function JobAssignmentsPanel({ jobId }) {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingDrafts, setRatingDrafts] = useState({});

  const fetchAssignments = async () => {
    try {
      const data = await api.get(`/jobs/${jobId}/assignments`);
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
  }, [jobId]);

  const updateAssignment = async (assignmentId, action) => {
    try {
      await api.post(`/assignments/${assignmentId}/${action}`, {});
      await fetchAssignments();
    } catch (requestError) {
      alert(`Unable to update assignment: ${requestError.message}`);
    }
  };

  const updateDraft = (assignmentId, field, value) => {
    setRatingDrafts((current) => ({
      ...current,
      [assignmentId]: {
        rating: current[assignmentId]?.rating ?? "5",
        feedback: current[assignmentId]?.feedback ?? "",
        [field]: value,
      },
    }));
  };

  const submitRating = async (assignment) => {
    const draft = ratingDrafts[assignment.id] ?? { rating: "5", feedback: "" };

    try {
      await api.post("/ratings/", {
        job_id: assignment.job_id,
        worker_id: assignment.worker_id,
        rating: Number(draft.rating),
        feedback: draft.feedback,
      });
      await fetchAssignments();
    } catch (requestError) {
      alert(`Unable to submit rating: ${requestError.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading assignments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (assignments.length === 0) {
    return <div>No assignments have been created for this job yet.</div>;
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const draft = ratingDrafts[assignment.id] ?? { rating: "5", feedback: "" };

        return (
          <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">
                  {assignment.worker_name ?? `Worker #${assignment.worker_id}`}
                </h4>
                <p className="text-sm text-slate-600">{assignment.worker_skills || "No skills listed"}</p>
                <p className="text-sm text-slate-600">
                  Rating {Number(assignment.worker_avg_rating ?? 0).toFixed(1)} / 5
                </p>
              </div>
              <div className="text-right text-sm">
                <div className="rounded-full bg-slate-100 px-3 py-1 font-semibold uppercase text-slate-700">
                  {assignment.status}
                </div>
                <div className="mt-2 text-slate-600">
                  Reliability {Number(assignment.worker_reliability_score ?? 0).toFixed(2)}
                </div>
              </div>
            </div>

            {assignment.status === "accepted" ? (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => updateAssignment(assignment.id, "complete")}>Mark Complete</Button>
                <Button variant="destructive" onClick={() => updateAssignment(assignment.id, "no-show")}>
                  Mark No-Show
                </Button>
              </div>
            ) : null}

            {assignment.status === "completed" && !assignment.has_rating ? (
              <div className="mt-4 space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <label className="block text-sm font-medium text-slate-700">
                  Rating
                  <select
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2"
                    value={draft.rating}
                    onChange={(event) => updateDraft(assignment.id, "rating", event.target.value)}
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>
                </label>
                <div>
                  <p className="mb-1 text-sm font-medium text-slate-700">Feedback</p>
                  <Textarea
                    value={draft.feedback}
                    onChange={(event) => updateDraft(assignment.id, "feedback", event.target.value)}
                    placeholder="Optional feedback for this worker"
                  />
                </div>
                <Button onClick={() => submitRating(assignment)}>Submit Rating</Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
