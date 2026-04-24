import { redirect } from 'next/navigation'
import LoginForm from '@/app/login/LoginForm'
import { countAuthUsers } from '@/lib/auth/repository'
import { getSession } from '@/lib/auth/server'

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDf_rIVvM7oglHCdIvg_nPkPQWtozW3FByITrMG-gWcNPQPrV7hlJ_iw46CaYr-2pvNC0OBSeFfWWb_L2M4hF-0k1osPuANb4rUTAPemgFPk2Q3CZLnhLFr9uq8AaZkArE-J4kDn733KL7gX6HctGcVEqz2iaISNBo5QsePScySiRwqyPovBjkXrJwaIJXHgd9Sgu69HbQH1zsjuQbf0g6Q0wY51HPLwuTEWSLLu70Fgi-5PsW_7KGb3gm1UMkmKNw_Z79bXCek6c'

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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f5f7fa] text-[#191c1e]">
      <main className="flex min-h-0 flex-1 lg:flex-row">
        <section
          className="relative hidden min-h-0 overflow-hidden lg:flex lg:w-[54%]"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#003b73]/80 via-[#0058aa]/35 to-transparent" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 xl:p-10">
            <p className="text-2xl font-black tracking-tight text-white xl:text-3xl">
              Mitha Laundry
            </p>

            <div className="max-w-sm rounded-[24px] border border-white/20 bg-white/10 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-lg xl:p-6">
              <p className="text-xl font-extrabold leading-snug text-white xl:text-2xl">
                Bisnis lebih tertata, operasional lebih tenang.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Satu dashboard untuk memantau transaksi, pelanggan, dan performa laundry
                dengan lebih sederhana.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 w-full items-center justify-center px-5 py-5 sm:px-8 lg:w-[46%] lg:px-10 xl:px-14">
          <div className="w-full max-w-[380px]">
            <div className="mb-6 lg:hidden">
              <span className="text-2xl font-black tracking-tight text-[#00488d]">
                Mitha Laundry
              </span>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#61707c] sm:text-xs">
                {hasUsers ? 'Secure Login' : 'Initial Setup'}
              </p>

              <h1 className="text-2xl font-extrabold text-[#191c1e] sm:text-3xl">
                {hasUsers ? 'Welcome Back' : 'Create Admin Account'}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#4b5560]">
                {hasUsers
                  ? 'Masuk untuk mengakses dashboard laundry Anda.'
                  : 'Lakukan pengaturan awal untuk mengaktifkan dashboard.'}
              </p>
            </div>

            <LoginForm hasUsers={hasUsers} nextPath={nextPath} />
          </div>
        </section>
      </main>

      {/* <footer className="shrink-0 border-t border-[#e3e8ee] bg-[#f5f7fa] px-5 py-3 sm:px-8 lg:px-10 xl:px-14">
        <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <p className="text-xs text-[#74808b]">
            © 2026 Mitha Laundry
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#74808b]">
            <span className="cursor-pointer transition-colors hover:text-[#00488d]">
              Terms
            </span>
            <span className="cursor-pointer transition-colors hover:text-[#00488d]">
              Privacy
            </span>
            <span className="cursor-pointer transition-colors hover:text-[#00488d]">
              Support
            </span>
          </div>
        </div>
      </footer> */}
    </div>
  )
}