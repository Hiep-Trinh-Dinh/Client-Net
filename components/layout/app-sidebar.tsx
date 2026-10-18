'use client'

import { CircleHelp, Compass, Home, MoreHorizontal, Plus, Settings, UserRound, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/app-store'

export function AppSidebar() {
  const { view, setView, mobileNav, setMobileNav } = useAppStore()

  return (
    <aside
      className={cn(
        'fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-white/[0.08] bg-[#0a0a0a] px-3 py-5 transition-transform lg:translate-x-0',
        mobileNav ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <nav className="flex flex-col gap-1">
        <NavItem
          active={view === 'home'}
          icon={<Home />}
          label="Home"
          onClick={() => {
            setView('home')
            setMobileNav(false)
          }}
        />
        <NavItem
          active={view === 'discover'}
          icon={<Compass />}
          label="Discover"
          onClick={() => {
            setView('discover')
            setMobileNav(false)
          }}
        />
        <NavItem
          active={view === 'friends'}
          icon={<Users />}
          label="Friends"
          onClick={() => {
            setView('friends')
            setMobileNav(false)
          }}
        />
        <NavItem
          active={view === 'profile'}
          icon={<UserRound />}
          label="Your profile"
          onClick={() => {
            setView('profile')
            setMobileNav(false)
          }}
        />
      </nav>

      <Separator className="my-5 bg-white/[0.08]" />

      <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
        <span>Your communities</span>
        <button
          onClick={() => setView('community')}
          className="text-zinc-500 hover:text-white"
        >
          <Plus />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <CommunityItem
          active={view === 'community'}
          initials="CO"
          label="Communities"
          onClick={() => setView('community')}
        />
      </div>

      <Separator className="my-5 bg-white/[0.08]" />

      <nav className="flex flex-col gap-1">
        <NavItem
          active={view === 'settings'}
          icon={<Settings />}
          label="Settings"
          onClick={() => setView('settings')}
        />
        <NavItem icon={<CircleHelp />} label="Help center" onClick={() => undefined} />
      </nav>

      <div className="absolute inset-x-3 bottom-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-white" />
          <span className="text-xs font-medium">You&apos;re online</span>
          <MoreHorizontal className="ml-auto text-zinc-600" />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
          Share what you&apos;re working on with your communities.
        </p>
      </div>
    </aside>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
        active ? 'bg-white font-medium text-black' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function CommunityItem({
  initials,
  label,
  badge,
  active,
  onClick,
}: {
  initials: string
  label: string
  badge?: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      <span className="grid size-7 place-items-center rounded-md border border-white/10 bg-zinc-800 text-[10px] font-bold text-zinc-300">
        {initials}
      </span>
      <span className="truncate">{label}</span>
      {badge && (
        <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-white text-[10px] text-black">
          {badge}
        </Badge>
      )}
    </button>
  )
}
