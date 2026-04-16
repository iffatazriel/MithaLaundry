'use client';

import { ArrowUpRight, ShieldCheck, UserRound, Users } from 'lucide-react';
import { CustomerStats as CustomerStatsType } from '@/lib/types/customers';

interface CustomerOverviewStatsProps {
  stats: CustomerStatsType;
}

export default function CustomerOverviewStats({ stats }: CustomerOverviewStatsProps) {
  const membershipRatio =
    stats.totalCustomers > 0
      ? Math.round((stats.activeMembers / stats.totalCustomers) * 100)
      : 0;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users size={20} />
          </div>
          <span className="text-xs font-medium text-gray-400">Base</span>
        </div>
        <p className="text-sm text-gray-500">Total Customers</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {stats.totalCustomers.toLocaleString()}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600">
          <ArrowUpRight size={14} />
          +{stats.totalCustomersGrowth}% from last month
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xs font-medium text-indigo-600">Loyalty</span>
        </div>
        <p className="text-sm text-gray-500">Active Members</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
        <p className="mt-2 text-sm text-gray-500">Priority care program</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <UserRound size={20} />
          </div>
          <span className="text-xs font-medium text-amber-600">Walk-in</span>
        </div>
        <p className="text-sm text-gray-500">Guest Customers</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.guestCount}</p>
        <p className="mt-2 text-sm text-gray-500">
          Pelanggan non-member yang tetap aktif bertransaksi
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
        <p className="text-sm font-medium text-blue-100">Membership Ratio</p>
        <p className="mt-2 text-3xl font-bold">{membershipRatio}%</p>
        <p className="mt-2 text-sm text-blue-100">
          Dari total basis pelanggan saat ini
        </p>
      </div>
    </div>
  );
}
