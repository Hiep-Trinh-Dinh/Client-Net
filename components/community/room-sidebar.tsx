'use client'

import { useState } from 'react'
import { Hash, Lock, Plus, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Room, RoomType } from '@/types'
import { useCommunityStore } from '@/stores/community-store'

interface RoomSidebarProps {
  isOwnerOrAdmin: boolean
}

export function RoomSidebar({ isOwnerOrAdmin }: RoomSidebarProps) {
  const { activeCommunity, activeRoom, setActiveRoom, rooms, setRooms } = useCommunityStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomType, setNewRoomType] = useState<RoomType>('TEXT')
  const [newRoomPrivate, setNewRoomPrivate] = useState(false)

  const textRooms = rooms.filter((r) => r.roomType === 'TEXT')
  const voiceRooms = rooms.filter((r) => r.roomType === 'VOICE')

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim() || !activeCommunity) return

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      communityId: activeCommunity.id,
      name: newRoomName.trim().toLowerCase().replace(/\s+/g, '-'),
      roomType: newRoomType,
      isPrivate: newRoomPrivate,
      position: rooms.length,
      createdAt: new Date().toISOString(),
    }

    setRooms([...rooms, newRoom])
    setActiveRoom(newRoom)
    setNewRoomName('')
    setNewRoomPrivate(false)
    setModalOpen(false)
  }

  return (
    <aside className="w-60 shrink-0 border-r border-white/[0.08] bg-[#0d0d0f] flex flex-col h-full select-none">
      {/* Community Header summary */}
      <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {activeCommunity?.name ?? 'Community'}
          </h2>
          <p className="text-[11px] text-zinc-500">
            {activeCommunity?.memberCount ?? 1} thành viên
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* TEXT CHANNELS */}
        <div>
          <div className="mb-1.5 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <span>Kênh chat</span>
            {isOwnerOrAdmin && (
              <button
                onClick={() => {
                  setNewRoomType('TEXT')
                  setModalOpen(true)
                }}
                className="text-zinc-500 hover:text-white"
                title="Tạo kênh chat"
              >
                <Plus className="size-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {textRooms.map((room) => {
              const active = activeRoom?.id === room.id
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className={cn(
                    'group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200',
                  )}
                >
                  {room.isPrivate ? (
                    <Lock className="size-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-400" />
                  ) : (
                    <Hash className="size-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-400" />
                  )}
                  <span className="truncate">{room.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* VOICE CHANNELS */}
        <div>
          <div className="mb-1.5 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <span>Kênh thoại (Voice)</span>
            {isOwnerOrAdmin && (
              <button
                onClick={() => {
                  setNewRoomType('VOICE')
                  setModalOpen(true)
                }}
                className="text-zinc-500 hover:text-white"
                title="Tạo kênh thoại"
              >
                <Plus className="size-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {voiceRooms.map((room) => {
              const active = activeRoom?.id === room.id
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className={cn(
                    'group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200',
                  )}
                >
                  <Volume2 className={cn('size-3.5 shrink-0', active ? 'text-emerald-400' : 'text-zinc-500')} />
                  <span className="truncate">{room.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161619] p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Tạo kênh mới</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Trong cộng đồng <span className="text-white font-medium">{activeCommunity?.name}</span>
            </p>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Loại kênh</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRoomType('TEXT')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition',
                      newRoomType === 'TEXT'
                        ? 'border-white/30 bg-white/10 text-white'
                        : 'border-white/10 text-zinc-400 hover:bg-white/5',
                    )}
                  >
                    <Hash className="size-4" /> Kênh chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRoomType('VOICE')}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition',
                      newRoomType === 'VOICE'
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                        : 'border-white/10 text-zinc-400 hover:bg-white/5',
                    )}
                  >
                    <Volume2 className="size-4" /> Kênh thoại
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400">Tên kênh</label>
                <Input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="ví-dụ-thao-luan"
                  required
                  className="mt-1.5 border-white/10 bg-white/[0.04] text-white"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-zinc-400" />
                  <div>
                    <p className="text-xs font-medium text-white">Kênh riêng tư</p>
                    <p className="text-[10px] text-zinc-500">Chỉ vai trò được chỉ định mới thấy kênh này</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newRoomPrivate}
                  onChange={(e) => setNewRoomPrivate(e.target.checked)}
                  className="size-4 rounded accent-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="border-white/10 text-zinc-300"
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                  Tạo kênh
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  )
}
