'use client'

import { useEffect, useState } from "react"
import { Search, X, ChevronRight } from "lucide-react" 

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (customer: any) => void
}

export default function SelectCustomerModal({
  isOpen,
  onClose,
  onSelect
}: Props) {
  const [customers, setCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md mx-4 max-h-[90vh] rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              Select Customer
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-2">
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">No customers found</p>
                <p className="text-sm mt-1">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      onSelect(customer)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group border border-transparent hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                      <span className="text-white font-semibold text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {customer.phone}
                      </p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                onClose()
                setSearchTerm("")
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}