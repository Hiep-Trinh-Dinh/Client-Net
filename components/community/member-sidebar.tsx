'use client'

import { useState } from 'react'
import { ShieldAlert, UserMinus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAssetUrl, getInitials } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CommunityMember } from '@/types'
import { useCommunityStore } from '@/stores/community-store'

interface MemberSidebarProps {
  isOwnerOrAdmin: boolean
}

export function MemberSidebar({ isOwnerOrAdmin }: MemberSidebarProps) {
  const { members, setMembers, roles } = useCommunityStore()
  const [search, setSearch] = useState('')

  const filteredMembers = members.filter(
    (m) =>
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      (m.displayName && m.displayName.toLowerCase().includes(search.toLowerCase())),
  )

  const handleRoleChange = (userId: string, roleName: string) => {
    const roleObj = roles.find((r) => r.name === roleName)
    if (!roleObj) return

    setMembers(
      members.map((m) =>
        m.userId === userId
          ? {
              ...m,
              roles: [roleObj],
            }
          : m,
      ),
    )
  }

  const handleKickMember = (userId: string) => {
    if (!window.confirm('Bạn có chắc muốn kick thành viên này khỏi cộng đồng?')) return
    setMembers(members.filter((m) => m.userId !== userId))
  }

  return (
    <aside className="w-64 shrink-0 border-l border-white/[0.08] bg-[#0d0d0f] flex flex-col h-full select-none">
      <div className="p-3 border-b border-white/[0.08]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm thành viên..."
          className="h-8 border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-zinc-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Thành viên ({filteredMembers.length})
          </div>

          <div className="space-y-1.5">
            {filteredMembers.map((member) => {
              const primaryRole = member.roles[0]?.name ?? 'Thành viên'
              return (
                <div
                  key={member.userId}
                  className="group flex items-center justify-between rounded-xl p-2 transition hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar className="size-8">
                        {member.avatarUrl && <AvatarImage src={getAssetUrl(member.avatarUrl)} />}
                        <AvatarFallback className="bg-zinc-800 text-[10px]">
                          {getInitials(member.displayName || member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          'absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0d0d0f]',
                          member.status === 'online' ? 'bg-emerald-400' : 'bg-zinc-500',
                        )}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-white">
                        {member.displayName || member.username}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-0.5 text-[9px] border-white/10 px-1 py-0 text-zinc-400"
                      >
                        {primaryRole}
                      </Badge>
                    </div>
                  </div>

                  {isOwnerOrAdmin && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
                      <select
                        value={primaryRole}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                        className="h-6 rounded bg-[#1f1f22] border border-white/10 px-1 text-[10px] text-zinc-300 outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name} className="bg-[#1f1f22]">
                            {r.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleKickMember(member.userId)}
                        className="size-6 text-zinc-500 hover:text-rose-400"
                        title="Kick thành viên"
                      >
                        <UserMinus className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
