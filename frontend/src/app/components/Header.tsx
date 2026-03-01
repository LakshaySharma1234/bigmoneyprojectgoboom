import { Menu, UserCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CaterStaff</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#jobs" className="text-gray-700 hover:text-orange-600 transition-colors">
              Find Jobs
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors">
              About
            </a>
            <a href="#employers" className="text-gray-700 hover:text-orange-600 transition-colors">
              For Employers
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden sm:flex items-center" asChild>
              <Link to="/signin">
                <UserCircle className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
              <Link to="/signup">Apply Now</Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}