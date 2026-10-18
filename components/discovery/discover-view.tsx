'use client'

import { ChevronRight, MessageCircle, Search, SlidersHorizontal, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/stores/app-store'

export function DiscoverView() {
  const { setView } = useAppStore()

  const communities = [
    {
      initials: 'LC',
      name: 'Launch Club',
      desc: 'A focused space for founders, builders, and people shipping useful things.',
      members: '12.8k',
      joined: true,
    },
    {
      initials: 'DS',
      name: 'Design Systems',
      desc: 'The craft, code, and culture behind thoughtful product interfaces.',
      members: '8.4k',
    },
    {
      initials: 'WM',
      name: 'Weekend Makers',
      desc: 'Make time for the side projects you keep thinking about.',
      members: '5.2k',
    },
    {
      initials: 'OT',
      name: 'Open Table',
      desc: 'Long-form conversations about work, culture, and the world around us.',
      members: '3.1k',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Explore</p>
        <h1 className="text-3xl font-semibold tracking-tight">Find your people</h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">
          Communities are spaces to go deeper — share work, learn in public, and build together.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-zinc-500" />
          <Input
            placeholder="Search communities"
            className="border-white/[0.08] bg-[#141414] pl-9 text-white placeholder:text-zinc-600"
          />
        </div>
        <Button variant="outline" className="border-white/10 text-zinc-300">
          <SlidersHorizontal data-icon="inline-start" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {communities.map((c) => (
          <button
            key={c.name}
            onClick={() => setView('community')}
            className="group rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left transition hover:border-white/25 hover:bg-[#191919]"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-white text-sm font-bold text-black">
                {c.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{c.name}</h2>
                  {c.joined && <Badge className="bg-white/[0.1] text-[10px] text-zinc-300">Joined</Badge>}
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{c.desc}</p>
              </div>
              <ChevronRight className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <div className="mt-5 flex items-center gap-4 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {c.members} members
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" />
                Active today
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
