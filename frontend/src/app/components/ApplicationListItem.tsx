import { Button } from "./ui/button";

export function ApplicationListItem({ application, onAccept, onReject }) {
  // In a real application, you would fetch the worker's details here
  const workerName = `Worker ID: ${application.worker_id}`;

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{workerName}</h4>
        <p className="text-sm text-gray-600">Applied on: {new Date(application.applied_at).toLocaleDateString()}</p>
      </div>
      <div className="space-x-2">
        <Button onClick={onAccept} size="sm">Accept</Button>
        <Button onClick={onReject} size="sm" variant="destructive">Reject</Button>
      </div>
    </div>
  );
}
