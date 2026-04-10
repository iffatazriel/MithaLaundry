'use client';
 
import { Customer } from '@/lib/types/customers';
 
interface CustomerTableRowProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}
 
export default function CustomerTableRow({
  customer,
  onEdit,
  onDelete
}: CustomerTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`${customer.avatarColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm`}>
            {customer.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {customer.name}
            </p>
            <p className="text-sm text-gray-500">
              {customer.email}
            </p>
          </div>
        </div>
      </td>
 
      <td className="px-6 py-4 text-gray-700">
        {customer.phone}
      </td>
 
      <td className="px-6 py-4">
        <span className="font-semibold text-blue-600 text-lg">
          {customer.totalOrders}
        </span>
      </td>
 
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          customer.status === 'member'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 ${customer.status === 'member' ? 'bg-blue-500' : 'bg-gray-400'}"></span>
          {customer.status.toUpperCase()}
        </span>
      </td>
 
      <td className="px-6 py-4">
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}