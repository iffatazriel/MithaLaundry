'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Image from 'next/image'

type SplashScreenProps = {
  redirectTo: string
  pwaOnly?: boolean
}

function isPwaDisplayMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    ('standalone' in navigator && navigator.standalone === true)
  )
}

function subscribeToPwaDisplayMode(onStoreChange: () => void) {
  const mediaQueries = [
    window.matchMedia('(display-mode: standalone)'),
    window.matchMedia('(display-mode: fullscreen)'),
  ]

  mediaQueries.forEach((mediaQuery) => {
    mediaQuery.addEventListener('change', onStoreChange)
  })

  return () => {
    mediaQueries.forEach((mediaQuery) => {
      mediaQuery.removeEventListener('change', onStoreChange)
    })
  }
}

function getPwaDisplayModeSnapshot() {
  return isPwaDisplayMode()
}

function getServerPwaDisplayModeSnapshot() {
  return false
}

export default function SplashScreen({
  redirectTo,
  pwaOnly = false,
}: SplashScreenProps) {
  const isPwa = useSyncExternalStore(
    subscribeToPwaDisplayMode,
    getPwaDisplayModeSnapshot,
    getServerPwaDisplayModeSnapshot
  )
  const shouldShowSplash = !pwaOnly || isPwa

  useEffect(() => {
    if (!pwaOnly || isPwa) {
      return
    }

    window.location.replace(redirectTo)
  }, [isPwa, pwaOnly, redirectTo])

  useEffect(() => {
    if (!shouldShowSplash) {
      return
    }

    const timer = window.setTimeout(() => {
      window.location.replace(redirectTo)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [redirectTo, shouldShowSplash])

  if (!shouldShowSplash) {
    return null
  }

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-300/5 to-purple-400/10" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 h-32 w-32 animate-float rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 blur-2xl" />
      <div className="absolute bottom-32 right-16 h-40 w-40 animate-float-delayed rounded-full bg-gradient-to-br from-purple-400/20 to-blue-500/20 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10">
        {/* Logo with pulse animation */}
        <div className="group relative">
          <div className="absolute inset-0 animate-pulse-slow rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 opacity-20 blur-xl" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-blue-50 p-5 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-100 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/icons/screen.png"
              alt="Mitha Laundry"
              width={96}
              height={96}
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Text with fade-in animation */}
        <div className="space-y-3 text-center animate-fade-in">
          <h1 className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-4xl font-black text-transparent">
            Mitha Laundry
          </h1>
          <p className="text-sm font-semibold tracking-wide text-gray-500">
            Premium Laundry Service
          </p>
        </div>

        {/* Progress bar with glow effect */}
        <div className="mt-4 w-full max-w-[220px] space-y-4">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="splash-progress absolute inset-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 shadow-lg shadow-blue-500/50" />
          </div>
          <p className="text-center text-xs font-medium text-gray-400 animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .splash-progress {
          animation: progress 1.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
