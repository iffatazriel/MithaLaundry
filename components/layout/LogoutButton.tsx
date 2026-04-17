'use client'

import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

type LogoutButtonProps = {
  collapsed?: boolean
  onClick?: () => void
}

export default function LogoutButton({ collapsed = false, onClick }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <button
        type="submit"
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 transition-all hover:bg-gray-50 hover:text-red-600 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <LogOut size={20} className="text-gray-400" />
        {!collapsed && <span>Logout</span>}
      </button>
    </form>
  )
}
