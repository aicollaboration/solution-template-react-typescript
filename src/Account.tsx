import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { getClient } from './SupabaseClient'

type Props = {
    session?: Session
}

export function Account(props: Props) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState<string>("")
    const [website, setWebsite] = useState<string>("")
    const [avatar_url, setAvatarUrl] = useState<string>("")

    useEffect(() => {
        getProfile()
    }, [props.session])

    async function getProfile() {
        try {
            setLoading(true)
            const user = getClient().auth.user()
            if (user) {
                let { data, error, status } = await getClient()
                    .from('profiles')
                    .select(`username, website, avatar_url`)
                    .eq('id', user.id)
                    .single()

                if (error && status !== 406) {
                    throw error
                }

                if (data) {
                    setUsername(data.username)
                    setWebsite(data.website)
                    setAvatarUrl(data.avatar_url)
                }
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile(user: any) {
        try {
            setLoading(true)
            const user = getClient().auth.user()

            if (user) {
                const updates = {
                    id: user.id,
                    username,
                    website,
                    avatar_url,
                    updated_at: new Date(),
                }

                let { error } = await getClient().from('profiles').upsert(updates, {
                    returning: 'minimal', // Don't return the value after inserting
                })

                if (error) {
                    throw error
                }
            }

        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={props.session?.user?.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="website"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button block primary"
                    onClick={() => updateProfile({ username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" onClick={() => getClient().auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}