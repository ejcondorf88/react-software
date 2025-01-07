import { Activity, Users, DollarSign, ShoppingCart, BarChart3, TrendingUp, Calendar, Bell } from 'lucide-react';
import { Header } from "../Header/Header";
import { Footer } from "../foo/Footer";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const StatCard = ({ icon: Icon, title, value, trend }) => (

  
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </div>
);

const Chart = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Revenue Overview</h3>
      <select className="text-sm border rounded-md px-2 py-1">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
    </div>
    <div className="h-64 flex items-end justify-between space-x-2">
      {[65, 45, 75, 55, 80, 60, 70].map((height, i) => (
        <div key={i} className="w-full">
          <div 
            className="bg-blue-100 rounded-t hover:bg-blue-200 transition-colors"
            style={{ height: `${height}%` }}
          ></div>
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2 text-sm text-gray-500">
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thu</span>
      <span>Fri</span>
      <span>Sat</span>
      <span>Sun</span>
    </div>
  </div>
);

export const Dashboard = () => {
    const location = useLocation();
    const user = location.state?.user;
    
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={DollarSign}
            title="Total Revenue"
            value="$54,375"
            trend={12.5}
          />
          <StatCard 
            icon={Users}
            title="Active Users"
            value="2,345"
            trend={8.1}
          />
          <StatCard 
            icon={ShoppingCart}
            title="New Orders"
            value="456"
            trend={-3.2}
          />
          <StatCard 
            icon={Activity}
            title="Conversion Rate"
            value="3.27%"
            trend={1.2}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Chart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: TrendingUp, text: "New sale: $435.50", time: "2m ago" },
                { icon: Users, text: "New user registration", time: "15m ago" },
                { icon: ShoppingCart, text: "New order #53421", time: "1h ago" },
                { icon: BarChart3, text: "Monthly report ready", time: "3h ago" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <item.icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};