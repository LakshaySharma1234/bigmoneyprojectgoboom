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
import { JobAssignmentsPanel } from "./JobAssignmentsPanel";
import { MatchingSuggestions } from "./MatchingSuggestions";

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
            Review applications, create assignments, and track worker outcomes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Matching Suggestions
            </h4>
            <MatchingSuggestions jobId={job.id} />
          </section>
          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Applications
            </h4>
            <ApplicationList jobId={job.id} />
          </section>
          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assignments
            </h4>
            <JobAssignmentsPanel jobId={job.id} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
