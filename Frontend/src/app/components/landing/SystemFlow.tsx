import { LogIn, UserCircle, LayoutDashboard, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';

export function SystemFlow() {
  const steps = [
    {
      icon: LogIn,
      title: 'Login',
      description: 'Secure JWT authentication'
    },
    {
      icon: UserCircle,
      title: 'Select Role',
      description: 'Choose your dashboard'
    },
    {
      icon: LayoutDashboard,
      title: 'View Dashboard',
      description: 'Role-specific interface'
    },
    {
      icon: ShoppingBag,
      title: 'Manage Orders',
      description: 'Track and update'
    },
    {
      icon: CreditCard,
      title: 'Payment',
      description: 'Secure transactions'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="font-bold text-4xl text-slate-900 mb-4">
            Simple & Efficient Workflow
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From login to payment, experience a seamless restaurant management process
          </p>
        </div>

        <div className="relative">
          {/* Desktop view */}
          <div className="hidden lg:flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-emerald-100 rounded-full p-4 mb-4">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 text-center max-w-[120px]">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-emerald-600 mx-4 mt-[-60px]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile view */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index}>
                  <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-6">
                    <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-0.5 h-8 bg-emerald-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
