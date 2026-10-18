'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Hash,
  Lock,
  MessageCircle,
  MoreVertical,
  PanelRightClose,
  Plus,
  Send,
  Settings,
  Shield,
  Smile,
  Users,
  Volume2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { apiFetch, getAssetUrl, getInitials } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Community, CommunityMember, CommunityRole, Room } from '@/types'
import { useAppStore } from '@/stores/app-store'
import { useCommunityStore } from '@/stores/community-store'
import { RoomSidebar } from './room-sidebar'
import { MemberSidebar } from './member-sidebar'
import { RoleMatrixModal } from './role-matrix-modal'

export function CommunityView() {
  const { profile } = useAppStore()
  const {
    activeCommunity,
    setActiveCommunity,
    activeRoom,
    setActiveRoom,
    rooms,
    setRooms,
    roles,
    setRoles,
    members,
    setMembers,
    showMemberSidebar,
    setShowMemberSidebar,
  } = useCommunityStore()

  const [communities, setCommunities] = useState<Community[]>([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  // Chat/Room state
  const [chatMessage, setChatMessage] = useState('')
  const [channelMessages, setChannelMessages] = useState<
    { sender: string; avatar?: string; text: string; time: string }[]
  >([
    {
      sender: 'Maya Chen',
      text: 'Chào mừng mọi người đến với kênh chính của cộng đồng!',
      time: '10:15 AM',
    },
    {
      sender: 'Alex Rivera',
      text: 'Không gian này đã được chia tách thành các Rooms rất tiện lợi.',
      time: '10:20 AM',
    },
  ])

  // Voice session mock state
  const [inVoice, setInVoice] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  async function load() {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/communities${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      setCommunities(await response.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải cộng đồng.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [search])

  // Khi chọn một community -> Khởi tạo default Rooms, Roles, Members nếu chưa có
  const handleSelectCommunity = (community: Community) => {
    setActiveCommunity(community)

    // Khởi tạo các Room mẫu
    const defaultRooms: Room[] = [
      {
        id: `room-1-${community.id}`,
        communityId: community.id,
        name: 'chung',
        roomType: 'TEXT',
        isPrivate: false,
        position: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: `room-2-${community.id}`,
        communityId: community.id,
        name: 'thong-bao',
        roomType: 'TEXT',
        isPrivate: true,
        position: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: `room-3-${community.id}`,
        communityId: community.id,
        name: 'Phòng Hội Thoại 1',
        roomType: 'VOICE',
        isPrivate: false,
        position: 2,
        createdAt: new Date().toISOString(),
      },
    ]
    setRooms(defaultRooms)
    setActiveRoom(defaultRooms[0])

    // Khởi tạo các Vai trò mẫu
    const defaultRoles: CommunityRole[] = [
      {
        id: 'role-owner',
        communityId: community.id,
        name: 'Trưởng nhóm',
        priority: 1,
        isDefault: false,
        createdAt: new Date().toISOString(),
        permissions: ['MANAGE_COMMUNITY', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'KICK_MEMBERS', 'SEND_MESSAGES', 'ATTACH_FILES', 'DELETE_MESSAGES', 'CONNECT_VOICE', 'SPEAK_VOICE', 'MUTE_MEMBERS'],
      },
      {
        id: 'role-mod',
        communityId: community.id,
        name: 'Điều hành viên',
        priority: 2,
        isDefault: false,
        createdAt: new Date().toISOString(),
        permissions: ['MANAGE_CHANNELS', 'KICK_MEMBERS', 'SEND_MESSAGES', 'ATTACH_FILES', 'DELETE_MESSAGES', 'CONNECT_VOICE', 'SPEAK_VOICE'],
      },
      {
        id: 'role-member',
        communityId: community.id,
        name: 'Thành viên',
        priority: 3,
        isDefault: true,
        createdAt: new Date().toISOString(),
        permissions: ['SEND_MESSAGES', 'ATTACH_FILES', 'CONNECT_VOICE', 'SPEAK_VOICE'],
      },
    ]
    setRoles(defaultRoles)

    // Khởi tạo Members mẫu
    const defaultMembers: CommunityMember[] = [
      {
        communityId: community.id,
        userId: community.ownerId,
        username: profile?.username ?? 'owner',
        displayName: profile?.displayName ?? 'Chủ cộng đồng',
        avatarUrl: profile?.avatarUrl,
        status: 'online',
        roles: [defaultRoles[0]],
        joinedAt: new Date().toISOString(),
      },
      {
        communityId: community.id,
        userId: 'u2',
        username: 'mayachen',
        displayName: 'Maya Chen',
        status: 'online',
        roles: [defaultRoles[1]],
        joinedAt: new Date().toISOString(),
      },
      {
        communityId: community.id,
        userId: 'u3',
        username: 'alexr',
        displayName: 'Alex Rivera',
        status: 'offline',
        roles: [defaultRoles[2]],
        joinedAt: new Date().toISOString(),
      },
    ]
    setMembers(defaultMembers)
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    setChannelMessages([
      ...channelMessages,
      {
        sender: profile?.displayName || profile?.username || 'Tôi',
        avatar: profile?.avatarUrl ?? undefined,
        text: chatMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setChatMessage('')
  }

  const isOwnerOrAdmin = activeCommunity?.ownerId === profile?.userId || true

  // 1. GIAO DIỆN KHÔNG GIAN BÊN TRONG CỘNG ĐỒNG (KHI ĐÃ CHỌN 1 COMMUNITY)
  if (activeCommunity) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0e0e11]">
        {/* ROOMS SIDEBAR (CHANNELS) */}
        <RoomSidebar isOwnerOrAdmin={isOwnerOrAdmin} />

        {/* MAIN ROOM CONTENT AREA */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#121215]">
          {/* Room Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCommunity(null)}
                className="h-8 gap-1.5 text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline text-xs">Cộng đồng</span>
              </Button>
              <Separator orientation="vertical" className="h-4 bg-white/10" />

              <div className="flex items-center gap-2 truncate">
                {activeRoom?.roomType === 'VOICE' ? (
                  <Volume2 className="size-4 text-emerald-400 shrink-0" />
                ) : activeRoom?.isPrivate ? (
                  <Lock className="size-4 text-zinc-400 shrink-0" />
                ) : (
                  <Hash className="size-4 text-zinc-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-white truncate">
                  {activeRoom?.name ?? 'Kênh chat'}
                </span>
                {activeRoom?.description && (
                  <span className="hidden md:inline text-xs text-zinc-500 truncate">
                    — {activeRoom.description}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isOwnerOrAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRoleModalOpen(true)}
                  className="h-8 gap-1.5 border border-white/10 bg-white/5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  <Shield className="size-3.5 text-white" />
                  <span className="hidden md:inline">Phân quyền vai trò</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMemberSidebar((prev) => !prev)}
                className={cn('size-8 text-zinc-400 hover:text-white', showMemberSidebar && 'text-white bg-white/10')}
                title="Bật/tắt danh sách thành viên"
              >
                <Users className="size-4" />
              </Button>
            </div>
          </div>

          {/* Room Body: TEXT ROOM HOẶC VOICE ROOM */}
          {activeRoom?.roomType === 'VOICE' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#121215] to-[#0a0a0c]">
              <div className="size-24 rounded-full border border-emerald-500/20 bg-emerald-500/10 grid place-items-center mb-6">
                <Volume2 className="size-12 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white">{activeRoom.name}</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-sm">
                Phòng thoại âm thanh thời gian thực. Bấm &quot;Kết nối Voice&quot; để tham gia thảo luận.
              </p>

              {inVoice ? (
                <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#19191d] p-3 shadow-xl">
                  <div className="flex items-center gap-2 px-3">
                    <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-medium text-emerald-300">Đã kết nối</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn('text-xs border-white/10', isMuted ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-300')}
                  >
                    {isMuted ? 'Bỏ tắt mic' : 'Tắt mic'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setInVoice(false)}
                    className="bg-rose-500 text-white hover:bg-rose-600 text-xs"
                  >
                    Rời phòng
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setInVoice(true)}
                  className="mt-8 bg-emerald-500 text-black hover:bg-emerald-400 font-medium px-6"
                >
                  Kết nối Voice
                </Button>
              )}
            </div>
          ) : (
            // TEXT CHAT ROOM
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="size-10 rounded-xl bg-white/10 grid place-items-center mb-3">
                    <Hash className="size-5 text-white" />
                  </div>
                  <h4 className="text-base font-semibold text-white">Chào mừng đến với #{activeRoom?.name}!</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Đây là điểm bắt đầu của kênh #{activeRoom?.name}.
                  </p>
                </div>

                {channelMessages.map((msg, index) => (
                  <div key={index} className="flex gap-3 group">
                    <Avatar className="size-9 shrink-0 mt-0.5">
                      {msg.avatar && <AvatarImage src={getAssetUrl(msg.avatar)} />}
                      <AvatarFallback className="bg-zinc-800 text-xs">{getInitials(msg.sender)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{msg.sender}</span>
                        <span className="text-[10px] text-zinc-600">{msg.time}</span>
                      </div>
                      <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="p-4 pt-0">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#18181c] p-2"
                >
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Gửi tin nhắn vào #${activeRoom?.name ?? 'kênh'}`}
                    className="h-9 border-0 bg-transparent text-sm text-white shadow-none focus-visible:ring-0 placeholder:text-zinc-500"
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                    <Smile className="size-4" />
                  </Button>
                  <Button type="submit" size="icon" className="bg-white text-black hover:bg-zinc-200 size-8 shrink-0">
                    <Send className="size-3.5" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* MEMBERS SIDEBAR */}
        {showMemberSidebar && <MemberSidebar isOwnerOrAdmin={isOwnerOrAdmin} />}

        {/* ROLES MATRIX MODAL */}
        {roleModalOpen && (
          <RoleMatrixModal
            roles={roles}
            onSaveRoles={(newRoles) => setRoles(newRoles)}
            onClose={() => setRoleModalOpen(false)}
          />
        )}
      </div>
    )
  }

  // 2. GIAO DIỆN KHÁM PHÁ / DANH SÁCH TẤT CẢ CỘNG ĐỒNG (DEFAULT VIEW)
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Không gian kết nối</p>
          <h1 className="text-3xl font-semibold text-white">Cộng đồng & Nhóm</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Khám phá các cộng đồng yêu thích hoặc tạo không gian thảo luận riêng.
          </p>
        </div>
        <Button onClick={() => setFormOpen(!formOpen)} className="bg-white text-black hover:bg-zinc-200">
          <Plus data-icon="inline-start" />
          Tạo cộng đồng
        </Button>
      </div>

      {formOpen && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              const res = await apiFetch('/api/communities', {
                method: 'POST',
                body: JSON.stringify({ name, description, isPublic: true }),
              })
              const created = (await res.json()) as Community
              setName('')
              setDescription('')
              setFormOpen(false)
              void load()
              handleSelectCommunity(created)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Lỗi tạo cộng đồng')
            }
          }}
          className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-[#141414] p-4 sm:grid-cols-[1fr_2fr_auto]"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên cộng đồng..."
            required
            className="border-white/10 bg-white/[0.04] text-white"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả cộng đồng..."
            className="border-white/10 bg-white/[0.04] text-white"
          />
          <Button className="bg-white text-black">Tạo ngay</Button>
        </form>
      )}

      {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}

      <div className="mb-5 flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm cộng đồng..."
          className="max-w-md border-white/10 bg-white/[0.04] text-white"
        />
        <Button variant="outline" onClick={() => void load()} className="border-white/10 text-white">
          Tìm kiếm
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5 space-y-3">
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500">
          Chưa tìm thấy cộng đồng nào. Hãy tạo cộng đồng đầu tiên!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <div
              key={community.id}
              onClick={() => handleSelectCommunity(community)}
              className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left transition hover:border-white/25 hover:bg-[#18181c]"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-zinc-800 text-base font-bold text-white">
                  {getInitials(community.name)}
                </span>
                <Badge variant="outline" className="border-white/10 text-[10px] text-zinc-400">
                  {community.isPublic ? 'Công khai' : 'Riêng tư'}
                </Badge>
              </div>

              <h2 className="mt-4 font-semibold text-base text-white group-hover:text-emerald-400 transition">
                {community.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">
                {community.description || 'Không gian thảo luận và chia sẻ kiến thức.'}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-zinc-500">
                <span>{community.memberCount} thành viên</span>
                <span className="text-emerald-400 font-medium group-hover:underline">Truy cập phòng &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
