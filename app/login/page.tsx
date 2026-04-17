import { redirect } from 'next/navigation'
import LoginForm from '@/app/login/LoginForm'
import { countAuthUsers } from '@/lib/auth/repository'
import { getSession } from '@/lib/auth/server'

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  const hasUsers = (await countAuthUsers()) > 0
  const resolvedSearchParams = await searchParams
  const nextPath = resolvedSearchParams.next?.startsWith('/')
    ? resolvedSearchParams.next
    : '/dashboard'

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#dbeafe,_transparent_35%),linear-gradient(135deg,_#f8fafc,_#eff6ff_45%,_#ffffff)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(59,130,246,0.06)_45%,transparent_100%)]" />
      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-blue-600 px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-50">
              Mitha Laundry
            </p>
            <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-4xl">
              {hasUsers ? 'Masuk untuk mengelola operasional laundry.' : 'Aktifkan dashboard dengan admin pertama.'}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
              {hasUsers
                ? 'Akses dashboard, data pelanggan, pesanan, dan laporan dengan session yang aman untuk tim internal.'
                : 'Setup ini hanya muncul sekali. Setelah admin pertama dibuat, halaman ini otomatis berubah menjadi login biasa.'}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Session</p>
                <p className="mt-2 text-sm font-semibold">Cookie `httpOnly` dengan masa aktif 7 hari</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Password</p>
                <p className="mt-2 text-sm font-semibold">Disimpan sebagai hash, bukan plain text</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                {hasUsers ? 'Secure Login' : 'Initial Setup'}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">
                {hasUsers ? 'Welcome back' : 'Buat akun admin utama'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {hasUsers
                  ? 'Gunakan email dan password admin untuk masuk ke aplikasi.'
                  : 'Masukkan data admin yang akan dipakai untuk login berikutnya.'}
              </p>
            </div>

            <LoginForm hasUsers={hasUsers} nextPath={nextPath} />
          </div>
        </div>
      </section>
    </main>
  )
}
