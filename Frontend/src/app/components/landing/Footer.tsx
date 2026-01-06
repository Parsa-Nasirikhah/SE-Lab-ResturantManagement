import { UtensilsCrossed, Github, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 rounded-lg p-2">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">ServeSmart</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              A comprehensive restaurant management system with role-based access control, 
              real-time order tracking, and advanced analytics.
            </p>
            <a
              href="https://github.com/yourusername/restaurant-management"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-emerald-400 transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#login" className="hover:text-emerald-400 transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Roles</h3>
            <ul className="space-y-2">
              <li className="text-slate-400">Customer Dashboard</li>
              <li className="text-slate-400">Chef Dashboard</li>
              <li className="text-slate-400">Waiter Dashboard</li>
              <li className="text-slate-400">Manager Dashboard</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                info@restaurantpro.com
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                123 Business St, City
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400">
            © 2025 Restaurant Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#terms" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
