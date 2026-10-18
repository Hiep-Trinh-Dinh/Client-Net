'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { ChatWidget } from '@/components/chat/chat-widget'
import { FeedView } from '@/components/post/feed-view'
import { CommunityView } from '@/components/community/community-view'
import { DiscoverView } from '@/components/discovery/discover-view'
import { FriendsView } from '@/components/friends/friends-view'
import { ProfileView } from '@/components/profile/profile-view'
import { SettingsView } from '@/components/settings/settings-view'
import { useAppStore } from '@/stores/app-store'
import { Profile } from '@/types'

export function PlatformShell() {
  const { view, setProfile } = useAppStore()

  useEffect(() => {
    const token = localStorage.getItem('social_network_access_token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401) throw new Error('expired')
        if (!response.ok) throw new Error('profile')
        setProfile((await response.json()) as Profile)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'expired') {
          localStorage.removeItem('social_network_access_token')
          localStorage.removeItem('social_network_refresh_token')
          window.location.href = '/login'
        }
      })
  }, [setProfile])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      <AppHeader />
      <AppSidebar />

      <main className="min-h-screen pt-16 lg:pl-64">
        {view === 'home' && <FeedView />}
        {view === 'discover' && <DiscoverView />}
        {view === 'friends' && <FriendsView />}
        {view === 'profile' && <ProfileView />}
        {view === 'settings' && <SettingsView />}
        {view === 'community' && <CommunityView />}
      </main>

      <ChatWidget />
    </div>
  )
}
