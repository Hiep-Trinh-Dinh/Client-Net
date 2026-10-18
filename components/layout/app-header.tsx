'use client'

import { Bell, ChevronDown, Layers3, Menu, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAssetUrl, getInitials } from '@/lib/api'
import { useAppStore } from '@/stores/app-store'

export function AppHeader() {
  const { profile, mobileNav, setMobileNav } = useAppStore()

  async function handleLogout() {
    const refreshToken = localStorage.getItem('social_network_refresh_token')
    try {
      if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } finally {
      localStorage.removeItem('social_network_access_token')
      localStorage.removeItem('social_network_refresh_token')
      window.location.href = '/login'
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-white/[0.08] bg-[#0a0a0a]/95 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex w-64 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="rounded-md p-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white lg:hidden"
          onClick={() => setMobileNav(!mobileNav)}
        >
          <Menu />
        </button>
        <div className="grid size-8 place-items-center rounded-lg bg-white text-black">
          <Layers3 />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">orbit</span>
      </div>

      <div className="hidden max-w-xl flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" />
          <Input
            placeholder="Search Orbit"
            className="h-9 border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-white/[0.08] hover:text-white md:hidden">
          <Search />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-white/[0.08] hover:text-white">
          <Bell />
        </Button>

        <Avatar className="ml-2 size-8 border border-white/10">
          {profile?.avatarUrl && <AvatarImage src={getAssetUrl(profile.avatarUrl)} alt="" />}
          <AvatarFallback className="bg-zinc-800 text-xs">
            {getInitials(profile?.displayName ?? profile?.username ?? 'U')}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="ml-1 text-zinc-500" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="ml-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
        >
          Log out
        </Button>
      </div>
    </header>
  )
}
