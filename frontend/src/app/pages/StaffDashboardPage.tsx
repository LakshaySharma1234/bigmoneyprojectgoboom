import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../auth/session";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { JobList } from "../components/JobList";
import { WorkerApplicationsList } from "../components/WorkerApplicationsList";
import { BookingList } from "../components/BookingList";
import { WorkerProfileForm } from "../components/WorkerProfileForm";

export default function StaffDashboardPage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="browse-jobs">
            <TabsList>
              <TabsTrigger value="browse-jobs">Browse Jobs</TabsTrigger>
              <TabsTrigger value="my-applications">My Applications</TabsTrigger>
              <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="my-profile">My Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="browse-jobs">
              <div className="bg-white p-8 rounded-lg shadow">
                <JobList />
              </div>
            </TabsContent>
            <TabsContent value="my-applications">
              <div className="bg-white p-8 rounded-lg shadow">
                <WorkerApplicationsList />
              </div>
            </TabsContent>
            <TabsContent value="my-bookings">
              <div className="bg-white p-8 rounded-lg shadow">
                <BookingList
                  endpoint="/bookings/worker/me"
                  emptyMessage="You do not have any confirmed or pending bookings yet."
                />
              </div>
            </TabsContent>
            <TabsContent value="my-profile">
              <div className="bg-white p-8 rounded-lg shadow">
                <WorkerProfileForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
