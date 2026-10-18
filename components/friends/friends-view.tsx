'use client'

import { MessageSquare, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FriendsView() {
  const friends = [
    { initials: 'MC', name: 'Maya Chen', role: 'Founder · Launch Club', status: 'online' },
    { initials: 'RP', name: 'Ravi Patel', role: 'Moderator · Design', status: 'online' },
    { initials: 'SK', name: 'Sofia Kim', role: 'Product designer', status: 'away' },
    { initials: 'JL', name: 'Jordan Lee', role: 'Community host', status: 'online' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Connections</p>
          <h1 className="text-3xl font-semibold tracking-tight">Friends & Network</h1>
          <p className="mt-2 text-sm text-zinc-500">Những người bạn đã kết nối và các lời mời đang chờ.</p>
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200">
          <UserPlus data-icon="inline-start" />
          Add friend
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {friends.map((f) => (
          <div
            key={f.name}
            className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#141414] p-4 transition hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-xl bg-zinc-800 font-bold text-white">
                  {f.initials}
                </span>
                <span
                  className={cn(
                    'absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#141414]',
                    f.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400',
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">{f.name}</h3>
                <p className="text-xs text-zinc-500">{f.role}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <MessageSquare className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
