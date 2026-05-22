'use client';

import { FormEvent, useState } from 'react';
import { X, UserPlus, Loader2, Mail, Phone, User } from 'lucide-react';
import { Customer } from '@/lib/types/customers';
import { unwrapApiData } from '@/lib/api-client';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated?: (customer: Customer) => void;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerCreated
}: AddCustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'guest' as 'member' | 'guest'
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          status: formData.status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const newCustomer = unwrapApiData<Customer>(await response.json(), {} as Customer);
      const createdCustomer: Customer = {
        ...newCustomer,
        avatar: newCustomer.name
          .split(' ')
          .map((part: string) => part.charAt(0))
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        avatarColor: 'bg-indigo-500',
        joinDate: new Date().toISOString().split('T')[0],
        totalSpent: 0
      };

      onCustomerCreated?.(createdCustomer);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'guest'
      });
      setErrors({});

      onClose();

    } catch (error) {
      console.error(error);
      setErrors({ general: 'Failed to create customer. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 overflow-hidden">
        
        {/* Mobile Drag Handle Indicator */}
        <div className="w-full flex justify-center pt-3 pb-2 sm:hidden bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header - Sticky Top */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Add Customer
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">Create new customer profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 bg-white/50 hover:bg-white rounded-xl transition-all duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-5">
            
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in zoom-in-95">
                <p className="text-sm text-red-800 font-medium">{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-base sm:text-sm ${
                  errors.name 
                    ? 'border-red-300 bg-red-50/50 text-red-900 placeholder-red-300' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-900'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <span>•</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-base sm:text-sm ${
                  errors.email 
                    ? 'border-red-300 bg-red-50/50 text-red-900 placeholder-red-300' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-900'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <span>•</span> {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-base sm:text-sm ${
                  errors.phone 
                    ? 'border-red-300 bg-red-50/50 text-red-900 placeholder-red-300' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-900'
                }`}
                placeholder="+62 812 3456 7890"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <span>•</span> {errors.phone}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['guest', 'member'] as const).map((status) => (
                  <label
                    key={status}
                    className={`relative p-3.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group flex items-center justify-center ${
                      formData.status === status
                        ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={status}
                      checked={formData.status === status}
                      onChange={() => setFormData({ ...formData, status })}
                      className="absolute opacity-0 w-0 h-0 peer"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full border-2 transition-all flex items-center justify-center ${
                        formData.status === status
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 group-hover:border-gray-400 bg-white'
                      }`}>
                        {formData.status === status && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className={`text-base sm:text-sm font-semibold capitalize ${
                        formData.status === status ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Ruang kosong untuk padding bawah yang nyaman saat scroll */}
            <div className="h-2" />
          </form>
        </div>

        {/* Sticky Action Buttons Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 sm:rounded-b-3xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 sm:py-2.5 px-6 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200 text-base sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              form="customer-form"
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 sm:py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-base sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 sm:w-4 sm:h-4" />
                  Add Customer
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}