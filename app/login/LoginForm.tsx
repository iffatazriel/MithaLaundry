'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react'
import type { AuthFormState } from '@/app/actions/auth'
import { login, setupInitialAdmin } from '@/app/actions/auth'

type LoginFormProps = {
  hasUsers: boolean
  nextPath?: string
}

const INITIAL_STATE: AuthFormState = {}

function Field({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className="space-y-2">
      <label className="block font-['Inter',_sans-serif] text-sm font-semibold text-[#4d616c]">
        {label}
      </label>
      {children}
    </div>
  )
}

function InputShell({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#727783]">
        {icon}
      </div>
      {children}
    </div>
  )
}

function FormInput({
  autoComplete,
  id,
  name,
  placeholder,
  type,
  rightSlot,
}: {
  autoComplete?: string
  id: string
  name: string
  placeholder: string
  type: string
  rightSlot?: React.ReactNode
}) {
  return (
    <>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-[3.35rem] w-full rounded-2xl border-none bg-[#e6e8ea] pl-12 pr-12 font-['Inter',_sans-serif] text-sm text-[#191c1e] outline-none transition-all duration-200 placeholder:text-[#727783]/70 focus:bg-[#e0e3e5] focus:ring-2 focus:ring-[#a8c8ff]"
      />
      {rightSlot}
    </>
  )
}

export default function LoginForm({ hasUsers, nextPath = '/dashboard' }: LoginFormProps) {
  const [state, loginAction, loginPending] = useActionState(login, INITIAL_STATE)
  const [setupState, setupAction, setupPending] = useActionState(
    setupInitialAdmin,
    INITIAL_STATE
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (hasUsers) {
    return (
      <form action={loginAction} className="space-y-5">
        <input type="hidden" name="next" value={nextPath} />

        <Field label="Email Address">
          <InputShell icon={<Mail size={18} />}>
            <FormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
            />
          </InputShell>
        </Field>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="block font-['Inter',_sans-serif] text-sm font-semibold text-[#4d616c]"
            >
              Password
            </label>
            <span className="font-['Inter',_sans-serif] text-[0.76rem] font-bold text-[#00488d] transition-opacity hover:opacity-80">
              Forgot Password?
            </span>
          </div>
          <InputShell icon={<Lock size={18} />}>
            <FormInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="********"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#727783] transition hover:text-[#00488d]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </InputShell>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="remember"
            type="checkbox"
            className="h-5 w-5 rounded-md border-none bg-[#e6e8ea] text-[#00488d] focus:ring-0"
          />
          <label
            htmlFor="remember"
            className="cursor-pointer font-['Inter',_sans-serif] text-sm font-medium text-[#424752]"
          >
            Remember me for 30 days
          </label>
        </div>

        {state.error ? (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 font-['Inter',_sans-serif] text-sm text-[#93000a]">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loginPending}
          className="w-full rounded-2xl bg-gradient-to-r from-[#00488d] to-[#005fb8] px-4 py-[0.95rem] text-center font-['Manrope',_'Inter',_sans-serif] text-[1rem] font-extrabold tracking-[-0.02em] text-white shadow-[0_18px_32px_rgba(0,72,141,0.22)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(0,72,141,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loginPending ? 'Signing In...' : 'Sign In to Dashboard'}
        </button>

        <div className="pt-2 text-center">
          <p className="font-['Inter',_sans-serif] text-sm text-[#727783]">
            Don&apos;t have an account yet?
            <span className="ml-1 font-bold text-[#00488d]">Create Account</span>
          </p>
        </div>
      </form>
    )
  }

  return (
    <form action={setupAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div className="rounded-2xl border border-[#d6e3ff] bg-[#f2f7ff] px-4 py-3 font-['Inter',_sans-serif] text-sm leading-6 text-[#00468b]">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <ShieldCheck size={16} />
          Initial Setup
        </div>
        This account will become the first administrator for your laundry dashboard.
      </div>

      <Field label="Admin Name">
        <InputShell icon={<UserRound size={18} />}>
          <FormInput
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Nama lengkap admin"
          />
        </InputShell>
      </Field>

      <Field label="Email Address">
        <InputShell icon={<Mail size={18} />}>
          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="owner@mithalaundry.com"
          />
        </InputShell>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block font-['Inter',_sans-serif] text-sm font-semibold text-[#4d616c]"
          >
            Password
          </label>
          <InputShell icon={<Lock size={18} />}>
            <FormInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#727783] transition hover:text-[#00488d]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </InputShell>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block font-['Inter',_sans-serif] text-sm font-semibold text-[#4d616c]"
          >
            Confirm Password
          </label>
          <InputShell icon={<Lock size={18} />}>
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Ulangi password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#727783] transition hover:text-[#00488d]"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </InputShell>
        </div>
      </div>

      {setupState.error ? (
        <div className="rounded-2xl border border-[#ffdad6] bg-[#fff1ef] px-4 py-3 font-['Inter',_sans-serif] text-sm text-[#93000a]">
          {setupState.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={setupPending}
        className="w-full rounded-2xl bg-gradient-to-r from-[#00488d] to-[#005fb8] px-4 py-[0.95rem] text-center font-['Manrope',_'Inter',_sans-serif] text-[1rem] font-extrabold tracking-[-0.02em] text-white shadow-[0_18px_32px_rgba(0,72,141,0.22)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(0,72,141,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {setupPending ? 'Creating Account...' : 'Create Admin Account'}
      </button>
    </form>
  )
}
