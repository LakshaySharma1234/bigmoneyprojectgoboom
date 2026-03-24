import { Button } from "./ui/button";
import { api } from "../services/api";

export function JobListItem({ job }) {
  const handleApply = async () => {
    try {
      await api.post("/applications/", {
        job_id: job.id,
      });
      alert("Successfully applied for the job!");
    } catch (error) {
      alert(`Error applying for job: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.location}</p>
      <p className="text-sm text-gray-600">Pay: ${job.pay_per_hour}/hour</p>
      <p className="text-sm text-gray-600">Staff needed: {job.staff_count}</p>
      <p className="mt-2">{job.description}</p>
      <div className="mt-4">
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}
