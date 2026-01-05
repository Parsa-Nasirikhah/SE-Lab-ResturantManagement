import { ShoppingCart, ChefHat, Users, BarChart3 } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: ShoppingCart,
      role: 'Customer',
      title: 'Browse & Order',
      description: 'Browse menu, place orders, track order status in real-time, and pay online securely.',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: ChefHat,
      role: 'Chef',
      title: 'Kitchen Management',
      description: 'View preparing orders, update order status in real-time, and manage kitchen workflow efficiently.',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      icon: Users,
      role: 'Waiter',
      title: 'Service Management',
      description: 'Manage ready orders, serve tables efficiently, and communicate with kitchen staff seamlessly.',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: BarChart3,
      role: 'Manager',
      title: 'Analytics & Control',
      description: 'Monitor orders, revenue, restaurant performance, and make data-driven decisions.',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Role-Based Access
          </div>
          <h2 className="font-bold text-4xl text-slate-900 mb-4">
            Built for Every Role
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tailored dashboards and features for customers, chefs, waiters, and managers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`${feature.lightColor} rounded-lg p-3 w-fit mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.textColor}`} />
                </div>
                
                <div className="mb-3">
                  <span className={`${feature.textColor} text-sm font-semibold uppercase tracking-wide`}>
                    {feature.role}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
