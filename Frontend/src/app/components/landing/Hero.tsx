import { ArrowRight, PlayCircle } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
              Professional Restaurant Management
            </div>
            <h1 className="font-bold text-5xl lg:text-6xl text-slate-900 mb-6 leading-tight">
              ServeSmart Management System
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Order, manage, and serve efficiently with role-based dashboards. 
              Streamline your restaurant operations with our comprehensive management platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-colors font-medium">
                <PlayCircle className="w-5 h-5" />
                View Menu
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <span className="font-bold text-lg">Dashboard Overview</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Live
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Active Orders</p>
                    <p className="font-bold text-2xl text-slate-900">24</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Tables</p>
                    <p className="font-bold text-2xl text-slate-900">12/20</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Revenue</p>
                    <p className="font-bold text-2xl text-slate-900">$2.4K</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Staff</p>
                    <p className="font-bold text-2xl text-slate-900">8/12</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Order Status</span>
                    <span className="text-sm font-medium text-emerald-600">75%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
