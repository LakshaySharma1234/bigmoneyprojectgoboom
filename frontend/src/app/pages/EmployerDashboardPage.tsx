import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../auth/session";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CreateJobForm } from "../components/CreateJobForm";
import { AdminOverviewPanel } from "../components/AdminOverviewPanel";
import { MyJobsList } from "../components/MyJobsList";
import { BookingList } from "../components/BookingList";
import { api } from "../services/api";

export default function EmployerDashboardPage() {
  const navigate = useNavigate();
  const [jobsVersion, setJobsVersion] = useState(0);

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  const handleCreateJob = async (jobData) => {
    try {
      await api.post("/jobs/", jobData);
      setJobsVersion((current) => current + 1);
      alert("Job created successfully!");
    } catch (error) {
      alert(`Error creating job: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Dashboard
          </h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="create-job">
            <TabsList>
              <TabsTrigger value="create-job">Create Job</TabsTrigger>
              <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="ops-overview">Ops Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="create-job">
              <div className="bg-white p-8 rounded-lg shadow">
                <CreateJobForm onSubmit={handleCreateJob} />
              </div>
            </TabsContent>
            <TabsContent value="my-jobs">
              <div className="bg-white p-8 rounded-lg shadow">
                <MyJobsList key={jobsVersion} />
              </div>
            </TabsContent>
            <TabsContent value="bookings">
              <div className="bg-white p-8 rounded-lg shadow">
                <BookingList />
              </div>
            </TabsContent>
            <TabsContent value="ops-overview">
              <div className="bg-white p-8 rounded-lg shadow">
                <AdminOverviewPanel />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
