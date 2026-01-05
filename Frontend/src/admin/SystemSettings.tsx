import { useState } from 'react';
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from '../dashboard/DashboardLayout';


import {
  Settings,
  Building,
  Clock,
  Shield,
  Bell,
  CreditCard,
  Users,
  Globe,
  Save,
  RotateCcw,
  ChevronRight,
  Upload,
  AlertTriangle,
  Check,
  Info
} from 'lucide-react';

type SettingsTab = 'general' | 'restaurant' | 'hours' | 'roles' | 'payment' | 'notifications' | 'security';

interface Role {
  id: string;
  name: string;
  viewOrders: boolean;
  updateOrderStatus: boolean;
  manageMenu: boolean;
  manageUsers: boolean;
  isReadOnly: boolean;
}

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // General Settings State
  const [systemName, setSystemName] = useState('Serve Smart');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [currency, setCurrency] = useState('USD');

  // Restaurant Info State
  const [restaurantName, setRestaurantName] = useState('The Grand Restaurant');
  const [address, setAddress] = useState('123 Main Street, New York, NY 10001');
  const [contactEmail, setContactEmail] = useState('contact@thegrand.com');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');

  // Operating Hours State
  const [operatingHours, setOperatingHours] = useState([
    { day: 'Monday', open: '09:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '09:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '09:00', close: '22:00', closed: false },
    { day: 'Friday', open: '09:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', closed: false }
  ]);

  // Roles & Permissions State
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'Admin', viewOrders: true, updateOrderStatus: true, manageMenu: true, manageUsers: true, isReadOnly: true },
    { id: '2', name: 'Manager', viewOrders: true, updateOrderStatus: true, manageMenu: true, manageUsers: false, isReadOnly: false },
    { id: '3', name: 'Chef', viewOrders: true, updateOrderStatus: true, manageMenu: false, manageUsers: false, isReadOnly: false },
    { id: '4', name: 'Waiter', viewOrders: true, updateOrderStatus: false, manageMenu: false, manageUsers: false, isReadOnly: false },
    { id: '5', name: 'Customer', viewOrders: true, updateOrderStatus: false, manageMenu: false, manageUsers: false, isReadOnly: false }
  ]);

  // Payment & Taxes State
  const [taxPercentage, setTaxPercentage] = useState('10');
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    creditCard: true,
    onlinePayment: false
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    orderStatus: true,
    email: true,
    sms: false,
    systemAlerts: true
  });

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState('30');

const { user } = useAuth()

if (!user) return null

  const navigate = useNavigate()
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/admin")
    },
    {
      label: 'System Settings',
      icon: <Settings className="w-5 h-5" />,
      active: true
    }
  ];

  const tabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: <Globe className="w-5 h-5" /> },
    { id: 'restaurant' as SettingsTab, label: 'Restaurant Info', icon: <Building className="w-5 h-5" /> },
    { id: 'hours' as SettingsTab, label: 'Operating Hours', icon: <Clock className="w-5 h-5" /> },
    { id: 'roles' as SettingsTab, label: 'Roles & Permissions', icon: <Users className="w-5 h-5" /> },
    { id: 'payment' as SettingsTab, label: 'Payment & Taxes', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'security' as SettingsTab, label: 'Security', icon: <Shield className="w-5 h-5" /> }
  ];

  const handleSave = () => {
    // Simulate save
    setShowSaveSuccess(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
    // Reset form values
  };

  const handleForceLogout = () => {
    setShowLogoutModal(false);
    // Implement force logout logic
    alert('All users have been logged out');
  };

  const toggleDayClosed = (index: number) => {
    const newHours = [...operatingHours];
    newHours[index].closed = !newHours[index].closed;
    setOperatingHours(newHours);
    setHasUnsavedChanges(true);
  };

  const updateRolePermission = (roleId: string, permission: keyof Role, value: boolean) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isReadOnly) return;

    setRoles(roles.map(r => 
      r.id === roleId ? { ...r, [permission]: value } : r
    ));
    setHasUnsavedChanges(true);
  };

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span>Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Settings</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-bold text-3xl text-slate-900 mb-2">System Settings</h1>
            <p className="text-slate-600">Manage global configuration of the restaurant system</p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSaveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Settings saved successfully!</p>
          </div>
        )}

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-amber-800">You have unsaved changes</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Tabs Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg p-2 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span className="flex-1 text-left">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">System Name</label>
                      <input
                        type="text"
                        value={systemName}
                        onChange={(e) => {
                          setSystemName(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <p className="text-sm text-slate-500 mt-1">This name appears throughout the application</p>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Default Language</label>
                      <select
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => {
                          setTimezone(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        <option value="JPY">JPY - Japanese Yen (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant Info */}
              {activeTab === 'restaurant' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Restaurant Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Restaurant Name</label>
                      <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => {
                          setRestaurantName(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-900 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => {
                            setContactEmail(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-900 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Restaurant Logo</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-900 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-500">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              {activeTab === 'hours' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Operating Hours</h2>
                  <div className="space-y-4">
                    {operatingHours.map((schedule, index) => (
                      <div key={schedule.day} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                        <div className="w-32">
                          <span className="font-medium text-slate-900">{schedule.day}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="time"
                            value={schedule.open}
                            disabled={schedule.closed}
                            onChange={(e) => {
                              const newHours = [...operatingHours];
                              newHours[index].open = e.target.value;
                              setOperatingHours(newHours);
                              setHasUnsavedChanges(true);
                            }}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                          />
                          <span className="text-slate-600">to</span>
                          <input
                            type="time"
                            value={schedule.close}
                            disabled={schedule.closed}
                            onChange={(e) => {
                              const newHours = [...operatingHours];
                              newHours[index].close = e.target.value;
                              setOperatingHours(newHours);
                              setHasUnsavedChanges(true);
                            }}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.closed}
                            onChange={() => toggleDayClosed(index)}
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-slate-600">Closed</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Special Holiday Hours</p>
                      <p className="text-sm text-blue-700">Configure holiday schedules and special closures in the Advanced Settings section</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Roles & Permissions */}
              {activeTab === 'roles' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Roles & Permissions</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Role</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">View Orders</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">Update Status</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">Manage Menu</th>
                          <th className="text-center py-3 px-4 font-medium text-slate-900">Manage Users</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map((role) => (
                          <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">{role.name}</span>
                                {role.isReadOnly && (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                    Read-only
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={role.viewOrders}
                                disabled={role.isReadOnly}
                                onChange={(e) => updateRolePermission(role.id, 'viewOrders', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={role.updateOrderStatus}
                                disabled={role.isReadOnly}
                                onChange={(e) => updateRolePermission(role.id, 'updateOrderStatus', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={role.manageMenu}
                                disabled={role.isReadOnly}
                                onChange={(e) => updateRolePermission(role.id, 'manageMenu', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={role.manageUsers}
                                disabled={role.isReadOnly}
                                onChange={(e) => updateRolePermission(role.id, 'manageUsers', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payment & Taxes */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Payment & Taxes</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Tax Percentage</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={taxPercentage}
                          onChange={(e) => {
                            setTaxPercentage(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">%</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Applied to all orders</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Service Charge</p>
                        <p className="text-sm text-slate-500">Add automatic service charge to bills</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceChargeEnabled}
                          onChange={(e) => {
                            setServiceChargeEnabled(e.target.checked);
                            setHasUnsavedChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 mb-4">Payment Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Cash</p>
                              <p className="text-sm text-slate-500">Accept cash payments</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={paymentMethods.cash}
                              onChange={(e) => {
                                setPaymentMethods({ ...paymentMethods, cash: e.target.checked });
                                setHasUnsavedChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Credit Card</p>
                              <p className="text-sm text-slate-500">Visa, Mastercard, Amex</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={paymentMethods.creditCard}
                              onChange={(e) => {
                                setPaymentMethods({ ...paymentMethods, creditCard: e.target.checked });
                                setHasUnsavedChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Online Payment</p>
                              <p className="text-sm text-slate-500">PayPal, Stripe integration</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={paymentMethods.onlinePayment}
                              onChange={(e) => {
                                setPaymentMethods({ ...paymentMethods, onlinePayment: e.target.checked });
                                setHasUnsavedChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Order Status Notifications</p>
                        <p className="text-sm text-slate-500">Notify users when order status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.orderStatus}
                          onChange={(e) => {
                            setNotifications({ ...notifications, orderStatus: e.target.checked });
                            setHasUnsavedChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-500">Send email updates to users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => {
                            setNotifications({ ...notifications, email: e.target.checked });
                            setHasUnsavedChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">SMS Notifications</p>
                        <p className="text-sm text-slate-500">Send text message alerts (requires SMS provider)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) => {
                            setNotifications({ ...notifications, sms: e.target.checked });
                            setHasUnsavedChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">System Alerts</p>
                        <p className="text-sm text-slate-500">Critical system notifications for admins</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.systemAlerts}
                          onChange={(e) => {
                            setNotifications({ ...notifications, systemAlerts: e.target.checked });
                            setHasUnsavedChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="font-bold text-xl text-slate-900 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-slate-900 mb-2">JWT Token Expiration</label>
                      <input
                        type="text"
                        value="24 hours"
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500"
                      />
                      <p className="text-sm text-slate-500 mt-1">Configured in backend environment</p>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-900 mb-2">Session Timeout</label>
                      <select
                        value={sessionTimeout}
                        onChange={(e) => {
                          setSessionTimeout(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                      <p className="text-sm text-slate-500 mt-1">Users will be logged out after this period of inactivity</p>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-medium text-slate-900 mb-2">Password Policy</h3>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          Minimum 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          At least one uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          At least one number
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          At least one special character
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-red-900 mb-1">Danger Zone</h3>
                          <p className="text-sm text-red-700">These actions cannot be undone and will affect all users</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Force Logout All Users
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Force Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">Force Logout All Users?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              This will immediately log out all users from the system. They will need to login again to continue. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleForceLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Force Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default SystemSettings;