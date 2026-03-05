import { useNavigate } from "react-router";
import { clearAuthSession } from "../auth/session";
import { Button } from "../components/ui/button";

export default function EmployerDashboardPage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Employer Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Employer pages are protected under `/employer/*`. This section can be expanded when employer
          features are ready.
        </p>
        <Button onClick={handleSignOut} className="bg-orange-500 hover:bg-orange-600 text-white">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
