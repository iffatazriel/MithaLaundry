'use client';
 
import { ArrowUpRight, ShieldCheck, UserRound, Users } from 'lucide-react';
import { CustomerStats as CustomerStatsType } from '@/lib/types/customers';
 
interface CustomerStatsProps {
  stats: CustomerStatsType;
}
 
export default function CustomerStats({ stats }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">
          TOTAL CUSTOMER BASE
        </p>
        <p className="text-4xl font-bold text-gray-900 mb-2">
          {stats.totalCustomers.toLocaleString()}
        </p>
        <p className="text-sm text-green-600 font-medium flex items-center gap-1">
          <span>↗</span> +{stats.totalCustomersGrowth}% from last month
        </p>
      </div>
 
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-blue-100 mb-2">
          ACTIVE MEMBERS
        </p>
        <p className="text-4xl font-bold mb-2">
          {stats.activeMembers}
        </p>
        <p className="text-sm text-blue-100">
          Priority care program
        </p>
      </div>
    </div>
  );
}
