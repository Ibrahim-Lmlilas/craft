import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { makeRequest } from '@/lib/axois';
import { Loader2, TrendingUp, Package, Gavel, DollarSign, ShoppingBag, Wallet, User, Settings } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatistics {
  summary: {
    total_products: number;
    active_products: number;
    total_auctions: number;
    active_auctions: number;
    ended_auctions: number;
    total_revenue: number;
    total_bids: number;
  };
  revenue_trend: Array<{
    date: string;
    revenue: number;
    auctions_count: number;
  }>;
  auctions_by_status: Array<{
    status: string;
    count: number;
  }>;
  bids_trend: Array<{
    date: string;
    bids_count: number;
  }>;
  products_by_status: Array<{
    status: string;
    count: number;
  }>;
}


const DashboardHomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isArtisan = user?.roles?.some(role => role.name === 'artisan');

  useEffect(() => {
    // Only fetch artisan statistics if user is an artisan
    if (!isArtisan) {
      setLoading(false);
      return;
    }

    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeRequest<DashboardStatistics>(
          api.get('/artisan/dashboard/statistics')
        );
        if (response.success && response.data) {
          setStatistics(response.data);
        } else {
          setError(response.error?.message || 'Failed to load dashboard statistics');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [isArtisan]);

  // Buyer Dashboard View
  if (!isArtisan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/my-bids')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">My Bids</p>
                  <p className="text-2xl font-bold text-gray-900">View All</p>
                  <p className="text-xs text-gray-500 mt-1">Track your bidding activity</p>
                </div>
                <ShoppingBag className="h-10 w-10 text-accent1" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/wallet')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Wallet</p>
                  <p className="text-2xl font-bold text-gray-900">Manage</p>
                  <p className="text-xs text-gray-500 mt-1">View balance & transactions</p>
                </div>
                <Wallet className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Profile</p>
                  <p className="text-2xl font-bold text-gray-900">Edit</p>
                  <p className="text-xs text-gray-500 mt-1">Manage your account</p>
                </div>
                <User className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Settings</p>
                  <p className="text-2xl font-bold text-gray-900">Configure</p>
                  <p className="text-xs text-gray-500 mt-1">Account preferences</p>
                </div>
                <Settings className="h-10 w-10 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/auctions')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Browse Auctions</p>
                  <p className="text-2xl font-bold text-gray-900">Explore</p>
                  <p className="text-xs text-gray-500 mt-1">Find items to bid on</p>
                </div>
                <Gavel className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/dashboard/my-bids')}
                className="bg-accent1 hover:bg-accent1/90 text-white rounded-xl"
              >
                View My Bids
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/wallet')}
                variant="outline"
                className="rounded-xl"
              >
                Go to Wallet
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/profile')}
                variant="outline"
                className="rounded-xl"
              >
                Edit Profile
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/settings')}
                variant="outline"
                className="rounded-xl"
              >
                Settings
              </Button>
              <Button 
                onClick={() => navigate('/auctions')}
                variant="outline"
                className="rounded-xl"
              >
                Browse Auctions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Artisan Dashboard View
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  // Format revenue trend data
  const revenueData = statistics.revenue_trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(item.revenue.toString()),
  }));

  // Format bids trend data
  const bidsData = statistics.bids_trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bids: item.bids_count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-blue-900">{statistics.summary.total_products}</p>
              <p className="text-xs text-blue-600 mt-1">{statistics.summary.active_products} active</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Total Auctions</p>
              <p className="text-3xl font-bold text-purple-900">{statistics.summary.total_auctions}</p>
              <p className="text-xs text-purple-600 mt-1">{statistics.summary.active_auctions} active</p>
            </div>
            <Gavel className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">{statistics.summary.total_revenue.toFixed(2)} DH</p>
              <p className="text-xs text-green-600 mt-1">From {statistics.summary.ended_auctions} ended auctions</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Total Bids</p>
              <p className="text-3xl font-bold text-orange-900">{statistics.summary.total_bids}</p>
              <p className="text-xs text-orange-600 mt-1">Received on all auctions</p>
            </div>
            <TrendingUp className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Revenue (DH)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bids Trend Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bids Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bidsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="bids" fill="#f97316" name="Bids Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
