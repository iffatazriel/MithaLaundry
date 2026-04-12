'use client';

import { FormEvent, useState } from 'react';
import { X, UserPlus, Loader2, Mail, Phone, User } from 'lucide-react';
import { Customer } from '@/lib/types/customers';

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

      const newCustomer = await response.json();
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md mx-4 max-h-[90vh] rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Add Customer
                </h2>
                <p className="text-sm text-gray-500">Create new customer profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800 font-medium">{errors.general}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                errors.name 
                  ? 'border-red-300 bg-red-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>•</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                errors.email 
                  ? 'border-red-300 bg-red-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                errors.phone 
                  ? 'border-red-300 bg-red-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="+62 812 3456 7890"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>•</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['guest', 'member'] as const).map((status) => (
                <label
                  key={status}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:shadow-md hover:-translate-y-0.5 ${
                    formData.status === status
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={status}
                    checked={formData.status === status}
                    onChange={() => setFormData({ ...formData, status })}
                    className="absolute opacity-0 w-0 h-0 peer"
                  />
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                      formData.status === status
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-400 group-hover:border-gray-500'
                    }`}></div>
                    <span className={`font-medium capitalize ${
                      formData.status === status ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {status}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}