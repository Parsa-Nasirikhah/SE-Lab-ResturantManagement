import { ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';


export function CallToAction() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-bold text-4xl lg:text-5xl text-white mb-6">
          Ready to streamline your restaurant operations?
        </h2>
        <p className="text-xl text-emerald-50 mb-10 leading-relaxed">
          Join restaurants that trust our platform for efficient management, 
          real-time order tracking, and seamless customer experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/registerpage">
          <button className="flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium text-lg shadow-lg">
            Create an Account
            <ArrowRight className="w-5 h-5" />
          </button>
          </Link>
          <Link to="/loginpage">
          <button className="flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium text-lg border-2 border-emerald-500">
            <LogIn className="w-5 h-5" />
            Login to Dashboard
          </button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-500/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="font-bold text-3xl mb-2">500+</div>
              <div className="text-emerald-100">Active Users</div>
            </div>
            <div>
              <div className="font-bold text-3xl mb-2">10K+</div>
              <div className="text-emerald-100">Orders Processed</div>
            </div>
            <div>
              <div className="font-bold text-3xl mb-2">99.9%</div>
              <div className="text-emerald-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
