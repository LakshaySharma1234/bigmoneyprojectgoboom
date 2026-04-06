import { useEffect, useState } from "react";

import { api } from "../services/api";

export function MatchingSuggestions({ jobId }) {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await api.get(`/jobs/${jobId}/matches`);
        setWorkers(data);
      } catch (fetchError) {
        setError(fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [jobId]);

  if (isLoading) {
    return <div>Loading matching suggestions...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (workers.length === 0) {
    return <div>No suggested workers yet.</div>;
  }

  return (
    <div className="space-y-3">
      {workers.map((worker) => (
        <div key={worker.user_id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">
                {[worker.first_name, worker.last_name].filter(Boolean).join(" ") || `Worker #${worker.user_id}`}
              </h4>
              <p className="text-sm text-slate-600">{worker.skills || "No skills listed"}</p>
              <p className="text-sm text-slate-600">{worker.match_reason}</p>
            </div>
            <div className="text-sm font-medium text-slate-700">
              <div>Rating: {Number(worker.avg_rating ?? 0).toFixed(1)} / 5</div>
              <div>Reliability: {Number(worker.reliability_score ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
