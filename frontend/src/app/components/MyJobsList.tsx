import { useEffect, useState } from "react";
import { api } from "../services/api";
import { MyJobsListItem } from "./MyJobsListItem";

export function MyJobsList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await api.get("/users/me/jobs");
        setJobs(jobs);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <MyJobsListItem key={job.id} job={job} />
      ))}
    </div>
  );
}
