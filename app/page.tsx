import { getSession } from '@/lib/auth/server'
import SplashScreen from '@/components/SplashScreen'

export default async function HomePage() {
  const session = await getSession()

  return <SplashScreen redirectTo={session ? '/dashboard' : '/login'} pwaOnly />
}
