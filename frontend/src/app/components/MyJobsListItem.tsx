import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ApplicationList } from "./ApplicationList";

export function MyJobsListItem({ job }) {
  return (
    <Dialog>
      <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.location}</p>
          <p className="text-sm text-gray-600">Status: {job.status}</p>
        </div>
        <DialogTrigger asChild>
          <Button>View Applications</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Applications for {job.title}</DialogTitle>
          <DialogDescription>
            Review the applications for this job and choose the best candidates.
          </DialogDescription>
        </DialogHeader>
        <ApplicationList jobId={job.id} />
      </DialogContent>
    </Dialog>
  );
}
