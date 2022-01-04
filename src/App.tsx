import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Account } from './Account'
import { Auth } from './Auth'
import './index.css'
import { getClient } from './SupabaseClient'

export default function Home() {
  const [session, setSession] = useState<Session>()

  useEffect(() => {
    const session = getClient().auth.session()
    if (session) {
      setSession(session)
    }

    getClient().auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        setSession(session)
      }
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user?.id} session={session} />}
    </div>
  )
}