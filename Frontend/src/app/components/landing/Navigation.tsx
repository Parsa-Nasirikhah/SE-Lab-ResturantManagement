import { UtensilsCrossed } from 'lucide-react';

import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 rounded-lg p-2">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">ServeSmart</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Home
            </Link>
            {/* <a href="#menu" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Menu
            </a> */}
            <a href="#features" className="text-slate-700 hover:text-emerald-600 transition-colors">
              Features
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/loginpage">
            <button className="px-4 py-2 bg-transparent text-slate-700 hover:text-emerald-600 transition-colors">
              Login
            </button>
            </Link>
            <Link to="/registerpage">
              <button className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Register
            </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
