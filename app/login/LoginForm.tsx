'use client'

import { useActionState } from 'react'
import type { AuthFormState } from '@/app/actions/auth'
import { login, setupInitialAdmin } from '@/app/actions/auth'

type LoginFormProps = {
  hasUsers: boolean
  nextPath?: string
}

const INITIAL_STATE: AuthFormState = {}

export default function LoginForm({ hasUsers, nextPath = '/dashboard' }: LoginFormProps) {
  const [state, loginAction, loginPending] = useActionState(login, INITIAL_STATE)
  const [setupState, setupAction, setupPending] = useActionState(
    setupInitialAdmin,
    INITIAL_STATE
  )

  if (hasUsers) {
    return (
      <form action={loginAction} className="space-y-5">
        <input type="hidden" name="next" value={nextPath} />
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="admin@mithalaundry.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Masukkan password"
          />
        </div>

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <button
          type="submit"
          disabled={loginPending}
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loginPending ? 'Masuk...' : 'Masuk ke Dashboard'}
        </button>
      </form>
    )
  }

  return (
    <form action={setupAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nama Admin
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Nama lengkap admin"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Login
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="owner@mithalaundry.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Ulangi password"
          />
        </div>
      </div>

      {setupState.error ? <p className="text-sm text-red-600">{setupState.error}</p> : null}

      <button
        type="submit"
        disabled={setupPending}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {setupPending ? 'Menyiapkan...' : 'Buat Admin Pertama'}
      </button>
    </form>
  )
}
