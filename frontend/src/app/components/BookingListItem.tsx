export function BookingListItem({ booking }) {
  // In a real app, you would fetch job and worker details
  const jobTitle = `Job ID: ${booking.job_id}`;
  const workerName = `Worker ID: ${booking.worker_id}`;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{jobTitle}</h3>
      <p className="text-sm text-gray-600">Worker: {workerName}</p>
      <p className="text-sm text-gray-600">Status: {booking.status}</p>
      <p className="text-sm text-gray-600">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>
    </div>
  );
}
