'use client'

import { useEffect, useState, type FormEvent } from 'react'
import {
  Bell, Bookmark, ChevronDown, ChevronRight, Compass, Hash, Headphones,
  Home, Image as ImageIcon, Layers3, MessageCircle, Mic, MoreHorizontal,
  Plus, Search, Settings, Shield, Sparkles, UserRound, Users, Video,
  Volume2, X, Smile, Send, Paperclip, Menu, PanelRightClose, CircleHelp,
  Radio, Lock, Heart, Repeat2, Share2, Pin, AtSign, SlidersHorizontal,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type View = 'home' | 'discover' | 'community' | 'friends' | 'profile' | 'settings'

type Member = { name: string; initials: string; role: string; status: string }
type Profile = {
  userId: string
  email: string
  username: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  coverUrl: string | null
  dateOfBirth: string | null
  isEmailVerified: boolean
}
type Post = { id: string; content: string | null; visibility: string; createdAt: string; authorId: string; authorUsername?: string | null; authorDisplayName?: string | null; authorAvatarUrl?: string | null; communityId: string | null; status: string }
type PostPage = { items: Post[]; page: number; pageSize: number; totalCount: number; totalPages: number }
type Comment = { id: string; postId: string; authorId: string; parentCommentId: string | null; content: string; replies: Comment[] }
type ReactionSummary = { postId?: string; commentId?: string; currentUserReaction: string | null; counts: Record<string, number>; totalCount: number }
type Media = { id: string; postId: string; url: string; mediaType: string; position: number }
type Community = { id: string; ownerId: string; name: string; description: string | null; avatarUrl: string | null; coverUrl: string | null; isPublic: boolean; memberCount: number; isMember: boolean; createdAt: string; updatedAt: string | null }

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'
async function apiFetch(path: string, init?: RequestInit) {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('social_network_access_token')
  const headers = new Headers(init?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init?.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      message?: string
      title?: string
      errors?: Record<string, string[]>
    } | null
    const validationMessage = body?.errors
      ? Object.values(body.errors).flat().join(' ')
      : undefined
    throw new Error(validationMessage ?? body?.message ?? body?.title ?? `Request failed (${response.status})`)
  }
  return response
}

function getAssetUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const members: Member[] = [
  { name: 'Maya Chen', initials: 'MC', role: 'Founder', status: 'online' },
  { name: 'Ravi Patel', initials: 'RP', role: 'Moderator', status: 'online' },
  { name: 'Sofia Kim', initials: 'SK', role: 'Designer', status: 'idle' },
  { name: 'Jordan Lee', initials: 'JL', role: 'Member', status: 'online' },
  { name: 'Alex Rivera', initials: 'AR', role: 'Member', status: 'offline' },
]

export function PlatformShell() {
  const [view, setView] = useState<View>('home')
  const [mobileNav, setMobileNav] = useState(false)
  const [activeChannel, setActiveChannel] = useState('general')
  const [showMembers, setShowMembers] = useState(true)
  const [message, setMessage] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSelected, setChatSelected] = useState('Maya Chen')
  const [profile, setProfile] = useState<Profile | null>(null)

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
        if (response.status === 401) {
          throw new Error('expired')
        }
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
  }, [])

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-white/[0.08] bg-[#0a0a0a]/95 px-4 backdrop-blur-xl lg:px-6">
        <div className="flex w-64 items-center gap-3">
          <button aria-label="Open navigation" className="rounded-md p-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white lg:hidden" onClick={() => setMobileNav(!mobileNav)}><Menu /></button>
          <div className="grid size-8 place-items-center rounded-lg bg-white text-black"><Layers3 /></div>
          <span className="text-[15px] font-semibold tracking-tight">orbit</span>
        </div>
        <div className="hidden max-w-xl flex-1 md:block"><div className="relative"><Search className="absolute left-3 top-2.5 text-zinc-500" /><Input placeholder="Search Orbit" className="h-9 border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-white/20" /></div></div>
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-white/[0.08] hover:text-white md:hidden"><Search /></Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-white/[0.08] hover:text-white"><Bell /></Button>
          <Avatar className="ml-2 size-8 border border-white/10">{profile?.avatarUrl && <AvatarImage src={getAssetUrl(profile.avatarUrl)} alt="" />}<AvatarFallback className="bg-zinc-800 text-xs">{getInitials(profile?.displayName ?? profile?.username ?? 'U')}</AvatarFallback></Avatar>
          <ChevronDown className="ml-1 text-zinc-500" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-zinc-400 hover:bg-white/[0.08] hover:text-white">Log out</Button>
        </div>
      </header>

      <aside className={cn('fixed bottom-0 left-0 top-16 z-30 w-64 border-r border-white/[0.08] bg-[#0a0a0a] px-3 py-5 transition-transform lg:translate-x-0', mobileNav ? 'translate-x-0' : '-translate-x-full')}>
        <nav className="flex flex-col gap-1">
          <NavItem active={view === 'home'} icon={<Home />} label="Home" onClick={() => { setView('home'); setMobileNav(false) }} />
          <NavItem active={view === 'discover'} icon={<Compass />} label="Discover" onClick={() => { setView('discover'); setMobileNav(false) }} />
          <NavItem active={view === 'friends'} icon={<Users />} label="Friends" onClick={() => { setView('friends'); setMobileNav(false) }} />
          <NavItem active={view === 'profile'} icon={<UserRound />} label="Your profile" onClick={() => { setView('profile'); setMobileNav(false) }} />
        </nav>
        <Separator className="my-5 bg-white/[0.08]" />
        <div className="mb-2 flex items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600"><span>Your communities</span><button className="text-zinc-500 hover:text-white"><Plus /></button></div>
        <div className="flex flex-col gap-1">
          <CommunityItem active={view === 'community'} initials="CO" label="Communities" onClick={() => setView('community')} />
        </div>
        <Separator className="my-5 bg-white/[0.08]" />
        <nav className="flex flex-col gap-1">
          <NavItem active={view === 'settings'} icon={<Settings />} label="Settings" onClick={() => setView('settings')} />
          <NavItem icon={<CircleHelp />} label="Help center" onClick={() => undefined} />
        </nav>
        <div className="absolute inset-x-3 bottom-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" /><span className="text-xs font-medium">You&apos;re online</span><MoreHorizontal className="ml-auto text-zinc-600" /></div><p className="mt-2 text-[11px] leading-relaxed text-zinc-500">Share what you&apos;re working on with your communities.</p></div>
      </aside>

      <main className="min-h-screen pt-16 lg:pl-64">{view === 'home' && <FeedView profile={profile} />}{view === 'discover' && <DiscoverView onCommunity={() => setView('community')} />}{view === 'friends' && <FriendsView />}{view === 'profile' && <ProfileView profile={profile} onUpdate={setProfile} onCommunity={() => setView('community')} />}{view === 'settings' && <SettingsView />}{view === 'community' && <CommunityView profile={profile} />}</main>

      <ChatWidget
        open={chatOpen}
        selected={chatSelected}
        onToggle={() => setChatOpen((prev) => !prev)}
        onSelect={setChatSelected}
      />
    </div>
  )
}

function ChatWidget({
  open,
  selected,
  onToggle,
  onSelect,
}: {
  open: boolean
  selected: string
  onToggle: () => void
  onSelect: (name: string) => void
}) {
  const conversations = [
    { name: 'Maya Chen', initials: 'MC', last: 'Can we review the final deck?', online: true, unread: 2 },
    { name: 'Ravi Patel', initials: 'RP', last: 'I sent the notes in the doc.', online: true, unread: 0 },
    { name: 'Sofia Kim', initials: 'SK', last: 'The mockups look great.', online: false, unread: 1 },
    { name: 'Jordan Lee', initials: 'JL', last: 'Let’s catch up later this week.', online: true, unread: 0 },
  ]

  const messages: Record<string, { sender: string; text: string }[]> = {
    'Maya Chen': [
      { sender: 'them', text: 'Hey! Can we review the final deck before the meeting?' },
      { sender: 'me', text: 'Absolutely. I’ll send the latest version in a few minutes.' },
      { sender: 'them', text: 'Perfect — thanks!' },
    ],
    'Ravi Patel': [
      { sender: 'them', text: 'I sent the notes in the doc.' },
      { sender: 'me', text: 'Great, I’ll check them now.' },
    ],
    'Sofia Kim': [
      { sender: 'them', text: 'The mockups look great.' },
      { sender: 'me', text: 'Thanks! I wanted them to feel more premium.' },
    ],
    'Jordan Lee': [
      { sender: 'them', text: 'Let’s catch up later this week.' },
      { sender: 'me', text: 'Sounds good. I’m free on Thursday.' },
    ],
  }

  const activeConversation = conversations.find((person) => person.name === selected) ?? conversations[0]

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[440px] w-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="w-[130px] border-r border-white/10 bg-[#111111] p-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Chats</p>
              <button className="grid size-7 place-items-center rounded-full bg-white/5 text-zinc-300 hover:bg-white/10">
                <Plus className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              {conversations.map((person) => (
                <button
                  key={person.name}
                  onClick={() => onSelect(person.name)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-left transition',
                    selected === person.name ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  <div className="relative">
                    <span className="grid size-10 place-items-center rounded-full bg-zinc-700 text-[10px] font-bold text-white">{person.initials}</span>
                    {person.online && <span className="absolute bottom-0 right-0 block size-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{person.name}</span>
                      {person.unread > 0 && (
                        <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] font-medium text-black">
                          {person.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-[#1a1a1a]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="grid size-8 place-items-center rounded-full bg-zinc-700 text-[10px] font-bold text-white">{activeConversation.initials}</span>
                  {activeConversation.online && <span className="absolute bottom-0 right-0 block size-2.5 rounded-full border-2 border-[#1a1a1a] bg-emerald-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{activeConversation.name}</p>
                  <p className="text-[10px] text-zinc-400">{activeConversation.online ? 'Active now' : 'Offline'}</p>
                </div>
              </div>
              <button className="text-zinc-400 hover:text-white"><X className="size-4" /></button>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
              {(messages[selected] ?? []).map((msg, index) => (
                <div key={`${msg.sender}-${index}`} className={cn('flex', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6',
                      msg.sender === 'me' ? 'bg-white text-black' : 'bg-white/5 text-zinc-100',
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <button className="text-zinc-400 hover:text-white"><Paperclip className="size-4" /></button>
                <input
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                />
                <button className="grid size-8 place-items-center rounded-full bg-white text-black hover:bg-zinc-200">
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="grid size-16 place-items-center rounded-full bg-[#1f1f1f] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:bg-[#222222]"
        aria-label="Open chat"
      >
        <div className="relative">
          <MessageCircle className="size-7" />
          <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#f43f5e] text-[9px] font-semibold text-white">3</span>
        </div>
      </button>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) { return <button onClick={onClick} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors', active ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white')}>{icon}<span>{label}</span></button> }
function CommunityItem({ initials, label, badge, active, onClick }: { initials: string; label: string; badge?: string; active?: boolean; onClick: () => void }) { return <button onClick={onClick} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors', active ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white')}><span className="grid size-7 place-items-center rounded-md border border-white/10 bg-zinc-800 text-[10px] font-bold text-zinc-300">{initials}</span><span className="truncate">{label}</span>{badge && <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-white text-[10px] text-black">{badge}</Badge>}</button> }

function FeedView({ profile }: { profile: Profile | null }) {
  const [page, setPage] = useState<PostPage | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const load = async () => {
    try {
      const response = await apiFetch('/api/posts')
      setPage(await response.json())
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tải feed.') }
  }
  useEffect(() => { void load() }, [])
  async function loadSaved() {
    try {
      const response = await apiFetch('/api/bookmarks')
      const data = (await response.json()) as PostPage
      setSavedIds(data.items.map((post) => post.id))
    } catch { setSavedIds([]) }
  }
  useEffect(() => { void loadSaved() }, [])
  return <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
    <div className="mb-10"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Your orbit</p><h1 className="text-3xl font-semibold tracking-tight">Good morning, {profile?.displayName || profile?.username || 'there'}</h1><p className="mt-2 text-sm text-zinc-500">Những cuộc trò chuyện mới nhất từ cộng đồng của bạn.</p></div>
    <CreatePost onCreated={load} />
    {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}
    <div className="mb-6 flex items-center gap-6 border-b border-white/[0.08] text-sm"><button className="border-b-2 border-white pb-3 font-medium">For you</button><button onClick={() => void loadSaved()} className="pb-3 text-zinc-500 hover:text-white">Saved ({savedIds.length})</button></div>
    <div className="flex flex-col gap-4">{page?.items.map((post) => <PostCard key={post.id} post={post} saved={savedIds.includes(post.id)} onSaved={() => void loadSaved()} />) ?? <p className="text-zinc-500">Đang tải bài viết...</p>}</div>
  </div>
}
function CreatePost({ onCreated }: { onCreated: () => Promise<void> }) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const nextPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPreviews(nextPreviews)
    return () => nextPreviews.forEach(({ url }) => URL.revokeObjectURL(url))
  }, [files])

  async function submit(event: FormEvent) {
    event.preventDefault(); if (!content.trim()) return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const response = await apiFetch('/api/posts/create', { method: 'POST', body: JSON.stringify({ content: content.trim(), visibility: 'PUBLIC' }) })
      const post = await response.json() as Post
      for (const file of files) {
        const data = new FormData()
        data.append('file', file)
        await apiFetch(`/api/posts/${post.id}/media`, { method: 'POST', body: data })
      }
      setContent('')
      setFiles([])
      await onCreated()
      setSuccess('Đăng bài thành công.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể đăng bài viết.')
    } finally { setBusy(false) }
  }
  function selectFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    const invalid = selected.find((file) =>
      !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type) ||
      file.size > 10 * 1024 * 1024)
    if (invalid) {
      setError('Mỗi ảnh/video phải là JPG, PNG, WEBP, GIF, MP4 hoặc WEBM và không quá 10 MB.')
      return
    }
    setFiles(selected)
    setError('')
  }
  return <form onSubmit={submit} className="mb-8 rounded-2xl border border-white/[0.08] bg-[#141414] p-4"><div className="flex gap-3"><Avatar className="size-9"><AvatarFallback className="bg-zinc-800 text-xs">ME</AvatarFallback></Avatar><div className="flex-1"><Textarea value={content} onChange={(event) => { setContent(event.target.value); setError(''); setSuccess('') }} placeholder="Share something with your communities..." className="min-h-16 resize-none border-0 bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-0" />{previews.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{previews.map(({ file, url }) => <div key={`${file.name}-${file.size}`} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">{file.type.startsWith('video/') ? <video src={url} controls preload="metadata" className="h-28 w-full object-cover" aria-label={`Preview ${file.name}`} /> : <img src={url} alt={`Preview ${file.name}`} className="h-28 w-full object-cover" />}</div>)}</div>}{files.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{files.map((file) => <span key={`${file.name}-${file.size}`} className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">{file.name}</span>)}</div>}<div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3"><label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-500 hover:text-white"><ImageIcon className="size-4" />Ảnh/video<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" className="hidden" onChange={selectFiles} /></label><Button type="submit" disabled={busy || !content.trim()} size="sm" className="bg-white text-black hover:bg-zinc-200">{busy ? 'Posting...' : 'Post'}</Button></div><p className="mt-2 text-[11px] text-zinc-600">Ảnh và video MP4/WEBM tối đa 10 MB mỗi file.</p>{error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}{success && <p role="status" className="mt-2 text-xs text-emerald-300">{success}</p>}</div></div></form>
}
function PostCard({ post, saved, onSaved }: { post: Post; saved: boolean; onSaved: () => void }) {
  const [summary, setSummary] = useState<ReactionSummary | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  useEffect(() => { void Promise.all([apiFetch(`/api/posts/${post.id}/reaction`).then((r) => r.json()), apiFetch(`/api/posts/${post.id}/comments`).then((r) => r.json()), apiFetch(`/api/posts/${post.id}/media`).then((r) => r.json())]).then(([reaction, loadedComments, loadedMedia]) => { setSummary(reaction); setComments(loadedComments); setMedia(loadedMedia) }).catch(() => undefined) }, [post.id])
  async function react() { const response = await apiFetch(`/api/posts/${post.id}/reaction`, { method: summary?.currentUserReaction ? 'DELETE' : 'PUT', body: summary?.currentUserReaction ? undefined : JSON.stringify({ type: 'LIKE' }) }); setSummary(await response.json()) }
  async function save() { await apiFetch(`/api/posts/${post.id}/bookmark`, { method: saved ? 'DELETE' : 'PUT' }); onSaved() }
  async function addComment(event: FormEvent) { event.preventDefault(); if (!comment.trim()) return; await apiFetch(`/api/posts/${post.id}/comments`, { method: 'POST', body: JSON.stringify({ content: comment.trim() }) }); setComment(''); setComments((await (await apiFetch(`/api/posts/${post.id}/comments`)).json()) as Comment[]) }
  async function upload(file: File) { const data = new FormData(); data.append('file', file); await apiFetch(`/api/posts/${post.id}/media`, { method: 'POST', body: data }); setMedia((await (await apiFetch(`/api/posts/${post.id}/media`)).json()) as Media[]) }
  return <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]"><div className="p-5"><div className="flex items-start gap-3"><Avatar className="size-9">{post.authorAvatarUrl && <AvatarImage src={getAssetUrl(post.authorAvatarUrl)} alt="" />}<AvatarFallback className="bg-zinc-800 text-xs">{getInitials(post.authorDisplayName || post.authorUsername || post.authorId)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-sm font-semibold">{post.authorDisplayName || post.authorUsername || post.authorId.slice(0, 8)}</span><Badge variant="outline" className="h-5 border-white/10 px-1.5 text-[10px] text-zinc-500">{post.visibility}</Badge><MoreHorizontal className="ml-auto text-zinc-600" /></div><p className="text-xs text-zinc-600">@{post.authorUsername || post.authorId.slice(0, 8)} · {new Date(post.createdAt).toLocaleString()}</p></div></div><p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-200">{post.content}</p>{media.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{media.map((item) => item.mediaType.startsWith('video/') ? <video key={item.id} controls src={getAssetUrl(item.url)} className="max-h-72 w-full rounded-xl object-cover" /> : <img key={item.id} src={getAssetUrl(item.url)} alt="" className="max-h-72 w-full rounded-xl object-cover" />)}</div>}</div><div className="flex items-center gap-1 p-3"><Button variant="ghost" size="sm" onClick={() => void react()} className={cn('text-zinc-500 hover:text-white', summary?.currentUserReaction && 'text-white')}><Heart fill={summary?.currentUserReaction ? 'currentColor' : 'none'} data-icon="inline-start" />{summary?.totalCount ?? 0}</Button><Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-zinc-500 hover:text-white"><MessageCircle data-icon="inline-start" />{comments.length}</Button><label className="cursor-pointer text-zinc-500 hover:text-white" title="Upload media"><ImageIcon className="size-4" /><input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file) }} /></label><Button variant="ghost" size="icon" onClick={() => void save()} className={cn('ml-auto text-zinc-500 hover:text-white', saved && 'text-white')}><Bookmark fill={saved ? 'currentColor' : 'none'} /></Button></div>{showComments && <div className="border-t border-white/[0.08] p-4"><div className="space-y-3">{comments.map((item) => <CommentRow key={item.id} comment={item} />)}</div><form onSubmit={addComment} className="mt-3 flex gap-2"><Input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." className="border-white/10 bg-white/[0.04] text-white" /><Button size="sm" className="bg-white text-black">Send</Button></form></div>}</article>
}

function CommentRow({ comment }: { comment: Comment }) {
  const [reaction, setReaction] = useState<ReactionSummary | null>(null)
  async function toggle() { const response = await apiFetch(`/api/comments/${comment.id}/reaction`, { method: reaction?.currentUserReaction ? 'DELETE' : 'PUT', body: reaction?.currentUserReaction ? undefined : JSON.stringify({ type: 'LIKE' }) }); setReaction(await response.json()) }
  return <div className="rounded-xl bg-white/[0.03] p-3 text-sm text-zinc-300"><p>{comment.content}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => void toggle()} className={cn('flex items-center gap-1 text-xs text-zinc-500', reaction?.currentUserReaction && 'text-white')}><Heart className="size-3" fill={reaction?.currentUserReaction ? 'currentColor' : 'none'} />{reaction?.totalCount ?? 0}</button>{comment.replies.length > 0 && <span className="text-xs text-zinc-500">{comment.replies.length} replies</span>}</div></div>
}

function DiscoverView({ onCommunity }: { onCommunity: () => void }) { const communities = [{ initials: 'LC', name: 'Launch Club', desc: 'A focused space for founders, builders, and people shipping useful things.', members: '12.8k', joined: true }, { initials: 'DS', name: 'Design Systems', desc: 'The craft, code, and culture behind thoughtful product interfaces.', members: '8.4k' }, { initials: 'WM', name: 'Weekend Makers', desc: 'Make time for the side projects you keep thinking about.', members: '5.2k' }, { initials: 'OT', name: 'Open Table', desc: 'Long-form conversations about work, culture, and the world around us.', members: '3.1k' }]; return <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><div className="mb-10"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Explore</p><h1 className="text-3xl font-semibold tracking-tight">Find your people</h1><p className="mt-2 max-w-lg text-sm text-zinc-500">Communities are spaces to go deeper — share work, learn in public, and build together.</p></div><div className="mb-8 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-zinc-500" /><Input placeholder="Search communities" className="border-white/[0.08] bg-[#141414] pl-9 text-white placeholder:text-zinc-600" /></div><Button variant="outline" className="border-white/10 text-zinc-300"><SlidersHorizontal data-icon="inline-start" />Filters</Button></div><div className="grid gap-4 sm:grid-cols-2">{communities.map((c) => <button key={c.name} onClick={onCommunity} className="group rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left transition hover:border-white/25 hover:bg-[#191919]"><div className="flex items-start gap-4"><span className="grid size-12 place-items-center rounded-xl bg-white text-sm font-bold text-black">{c.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold">{c.name}</h2>{c.joined && <Badge className="bg-white/[0.1] text-[10px] text-zinc-300">Joined</Badge>}</div><p className="mt-1 text-sm leading-6 text-zinc-500">{c.desc}</p></div><ChevronRight className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" /></div><div className="mt-5 flex items-center gap-4 text-xs text-zinc-600"><span className="flex items-center gap-1"><Users />{c.members} members</span><span className="flex items-center gap-1"><MessageCircle />Active today</span></div></button>)}</div></div> }

function LegacyCommunityView({ activeChannel, setActiveChannel, showMembers, setShowMembers, message, setMessage }: { activeChannel: string; setActiveChannel: (c: string) => void; showMembers: boolean; setShowMembers: (v: boolean) => void; message: string; setMessage: (v: string) => void }) { const channels = ['general', 'introductions', 'feedback', 'resources']; const chat = [{ initials: 'MC', name: 'Maya Chen', time: '10:42 AM', text: 'Welcome to the new Launch Club space. This is where we can share what we are building and find thoughtful feedback.' }, { initials: 'RP', name: 'Ravi Patel', time: '10:45 AM', text: 'The new channel structure feels great. I added a few resources to #resources for anyone exploring early-stage product.' }, { initials: 'YN', name: 'Yuna Nakamura', time: '10:49 AM', text: 'This is exactly the kind of space I was looking for. Excited to meet everyone here.' }]; return <div className="flex h-[calc(100vh-4rem)] min-h-[640px] overflow-hidden"><div className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-[#101010] md:block"><div className="flex h-16 items-center border-b border-white/[0.08] px-4"><div className="grid size-8 place-items-center rounded-lg bg-white text-xs font-bold text-black">LC</div><div className="ml-3 min-w-0"><p className="truncate text-sm font-semibold">Launch Club</p><p className="text-[10px] text-zinc-600">12,842 members</p></div><button className="ml-auto text-zinc-500 hover:text-white"><ChevronDown /></button></div><div className="p-3"><div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600"><span>Text channels</span><Plus /></div>{channels.map((c) => <button key={c} onClick={() => setActiveChannel(c)} className={cn('mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm', activeChannel === c ? 'bg-white/[0.1] text-white' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300')}><Hash />{c}<MoreHorizontal className="ml-auto opacity-0 group-hover:opacity-100" /></button>)}<div className="mb-2 mt-7 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600"><span>Voice channels</span><Plus /></div>{['Lounge', 'Focus room'].map((c) => <button key={c} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"><Volume2 />{c}<span className="ml-auto text-[10px] text-zinc-600">{c === 'Lounge' ? '4' : '2'}</span></button>)}</div><div className="absolute bottom-0 w-60 border-t border-white/[0.08] bg-[#141414] p-3"><div className="flex items-center gap-2"><Avatar className="size-8"><AvatarFallback className="bg-zinc-800 text-[10px]">YN</AvatarFallback></Avatar><div><p className="text-xs font-medium">Yuna</p><p className="text-[10px] text-zinc-600">Online</p></div><Mic className="ml-auto text-zinc-500" /><Headphones className="text-zinc-500" /></div></div></div><div className="flex min-w-0 flex-1 flex-col bg-[#141414]"><div className="flex h-16 shrink-0 items-center border-b border-white/[0.08] px-4"><Hash className="text-zinc-500" /><span className="ml-2 font-semibold">{activeChannel}</span><Separator orientation="vertical" className="mx-4 h-5 bg-white/[0.08]" /><span className="hidden truncate text-xs text-zinc-600 sm:block">A place to share, ask, and connect.</span><div className="ml-auto flex gap-1"><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Bell /></Button><Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)} className={cn('text-zinc-500 hover:text-white', showMembers && 'text-white')}><Users /></Button><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><PanelRightClose /></Button></div></div><div className="flex-1 overflow-y-auto p-4 sm:p-6">{activeChannel === 'general' ? <>{chat.map((m, i) => <div className="group mb-6 flex gap-3" key={m.name}><Avatar className="mt-0.5 size-9"><AvatarFallback className="bg-zinc-800 text-xs">{m.initials}</AvatarFallback></Avatar><div><div className="flex items-baseline gap-2"><span className="text-sm font-semibold">{m.name}</span>{i === 0 && <Badge className="h-4 bg-white px-1 text-[9px] text-black">FOUNDER</Badge>}<span className="text-[10px] text-zinc-700">{m.time}</span></div><p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-300">{m.text}</p><div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100"><Button variant="outline" size="sm" className="h-6 border-white/10 px-2 text-[10px] text-zinc-500"><Heart />12</Button><Button variant="outline" size="sm" className="h-6 border-white/10 px-2 text-[10px] text-zinc-500">Reply</Button></div></div></div>)}<div className="my-10 flex items-center gap-3"><Separator className="bg-white/[0.08]" /><span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Today</span><Separator className="bg-white/[0.08]" /></div></> : <div className="grid h-full place-items-center text-center"><div><div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]"><Hash /></div><h2 className="font-semibold">Welcome to #{activeChannel}</h2><p className="mt-2 text-sm text-zinc-600">This is the beginning of the #{activeChannel} channel.</p></div></div>}</div><div className="p-4 pt-0"><div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-[#1b1b1b] p-2"><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Plus /></Button><Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Message #${activeChannel}`} className="h-9 border-0 bg-transparent text-sm text-white shadow-none focus-visible:ring-0" /><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Smile /></Button><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Send /></Button></div></div></div>{showMembers && <aside className="hidden w-60 shrink-0 border-l border-white/[0.08] bg-[#101010] xl:block"><div className="border-b border-white/[0.08] p-4"><p className="text-xs font-semibold">About this community</p><p className="mt-2 text-xs leading-5 text-zinc-600">A focused space for founders, builders, and people shipping useful things.</p></div><div className="p-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Online — 4</p>{members.slice(0, 4).map((m) => <div className="mb-3 flex items-center gap-2" key={m.name}><div className="relative"><Avatar className="size-8"><AvatarFallback className="bg-zinc-800 text-[10px]">{m.initials}</AvatarFallback></Avatar><span className={cn('absolute bottom-0 right-0 size-2 rounded-full border-2 border-[#101010]', m.status === 'online' ? 'bg-white' : 'bg-zinc-600')} /></div><div className="min-w-0"><p className="truncate text-xs font-medium">{m.name}</p><p className="text-[10px] text-zinc-600">{m.role}</p></div></div>)}</div></aside>}</div> }

function FriendsView() {
  const friends = [
    { initials: 'MC', name: 'Maya Chen', role: 'Founder · Launch Club', status: 'online' },
    { initials: 'RP', name: 'Ravi Patel', role: 'Moderator · Design', status: 'online' },
    { initials: 'SK', name: 'Sofia Kim', role: 'Product designer', status: 'away' },
    { initials: 'JL', name: 'Jordan Lee', role: 'Community host', status: 'online' },
  ]

  const requests = [
    { initials: 'AR', name: 'Alex Rivera', note: 'Wants to connect over product design' },
    { initials: 'DB', name: 'Dora Bennett', note: 'Invited you to join Creative Circle' },
  ]

  const sentRequests = [
    { initials: 'TS', name: 'Theo Shaw', note: 'Connection request sent 2 days ago' },
    { initials: 'LM', name: 'Lina Moore', note: 'Follow-up pending approval' },
  ]

  const suggestions = [
    { initials: 'NH', name: 'Nia Hart', role: 'Brand strategist', mutual: '12 mutual friends' },
    { initials: 'DS', name: 'Drew Stone', role: 'Front-end engineer', mutual: '8 mutual friends' },
    { initials: 'CA', name: 'Chloe Adams', role: 'Community manager', mutual: '6 mutual friends' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">People</p>
          <h1 className="text-3xl font-semibold tracking-tight">Friends</h1>
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200"><Plus data-icon="inline-start" />Add friends</Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your friends</h2>
              <span className="text-sm text-zinc-500">{friends.length} people</span>
            </div>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.name} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="relative">
                    <span className="grid size-11 place-items-center rounded-full bg-zinc-700 text-xs font-bold text-white">{friend.initials}</span>
                    <span className={cn('absolute -bottom-0.5 -right-0.5 block size-3 rounded-full border-2 border-[#141414]', friend.status === 'online' ? 'bg-emerald-400' : friend.status === 'away' ? 'bg-amber-400' : 'bg-zinc-500')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{friend.name}</p>
                    <p className="text-sm text-zinc-500">{friend.role}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">Message</Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Friend requests</h2>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black">{requests.length}</span>
            </div>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.name} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="grid size-11 place-items-center rounded-full bg-zinc-700 text-xs font-bold text-white">{request.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{request.name}</p>
                    <p className="text-sm text-zinc-500">{request.note}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">Accept</Button>
                    <Button variant="outline" size="sm" className="border-white/10 text-zinc-300 hover:text-white">Ignore</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sent requests</h2>
              <span className="text-sm text-zinc-500">Pending</span>
            </div>
            <div className="space-y-3">
              {sentRequests.map((person) => (
                <div key={person.name} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="grid size-11 place-items-center rounded-full bg-zinc-700 text-xs font-bold text-white">{person.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{person.name}</p>
                    <p className="text-sm text-zinc-500">{person.note}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">Cancel</Button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">People you may know</h2>
              <Sparkles className="size-4 text-zinc-400" />
            </div>
            <div className="space-y-3">
              {suggestions.map((person) => (
                <div key={person.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-zinc-700 text-xs font-bold text-white">{person.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{person.name}</p>
                      <p className="text-sm text-zinc-500">{person.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-zinc-500">{person.mutual}</span>
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">Connect</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <h2 className="mb-4 text-lg font-semibold">Quick stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="text-sm text-zinc-400">Friends</span>
                <span className="font-medium text-white">{friends.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="text-sm text-zinc-400">Requests</span>
                <span className="font-medium text-white">{requests.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span className="text-sm text-zinc-400">Pending</span>
                <span className="font-medium text-white">{sentRequests.length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function CommunityView({ profile }: { profile: Profile | null }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selected, setSelected] = useState<Community | null>(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  async function load() {
    try { const response = await apiFetch(`/api/communities${search ? `?search=${encodeURIComponent(search)}` : ''}`); setCommunities(await response.json()) } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tải community.') }
  }
  useEffect(() => { void load() }, [search])
  async function create(event: FormEvent) {
    event.preventDefault()
    try { const response = await apiFetch('/api/communities', { method: 'POST', body: JSON.stringify({ name, description, isPublic: true }) }); const created = await response.json() as Community; setName(''); setDescription(''); setFormOpen(false); setSelected(created); void load() } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tạo community.') }
  }
  async function membership(community: Community) {
    try { await apiFetch(`/api/communities/${community.id}/membership`, { method: community.isMember ? 'DELETE' : 'PUT' }); await load(); if (selected?.id === community.id) setSelected((await (await apiFetch(`/api/communities/${community.id}`)).json()) as Community) } catch (e) { setError(e instanceof Error ? e.message : 'Không thể cập nhật thành viên.') }
  }
  async function update(event: FormEvent) {
    event.preventDefault()
    if (!selected) return
    try { const response = await apiFetch(`/api/communities/${selected.id}`, { method: 'PUT', body: JSON.stringify({ name, description, avatarUrl: selected.avatarUrl, coverUrl: selected.coverUrl, isPublic: selected.isPublic }) }); setSelected(await response.json()); setEditing(false); void load() } catch (e) { setError(e instanceof Error ? e.message : 'Không thể cập nhật community.') }
  }
  async function remove() {
    if (!selected || !window.confirm('Delete this community?')) return
    try { await apiFetch(`/api/communities/${selected.id}`, { method: 'DELETE' }); setSelected(null); void load() } catch (e) { setError(e instanceof Error ? e.message : 'Không thể xóa community.') }
  }
  return <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Explore</p><h1 className="text-3xl font-semibold">Communities</h1><p className="mt-2 text-sm text-zinc-500">Tìm không gian phù hợp và tham gia cuộc trò chuyện.</p></div><Button onClick={() => setFormOpen(!formOpen)} className="bg-white text-black hover:bg-zinc-200"><Plus data-icon="inline-start" />Create community</Button></div>{formOpen && <form onSubmit={create} className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-[#141414] p-4 sm:grid-cols-[1fr_2fr_auto]"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" required className="border-white/10 bg-white/[0.04] text-white" /><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border-white/10 bg-white/[0.04] text-white" /><Button className="bg-white text-black">Create</Button></form>}{error && <p className="mb-4 text-sm text-rose-300">{error}</p>}<div className="mb-5 flex gap-2"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search communities..." className="max-w-md border-white/10 bg-white/[0.04] text-white" /><Button variant="outline" onClick={() => void load()} className="border-white/10 text-white">Search</Button></div><div className="grid gap-5 lg:grid-cols-[1fr_340px]"><div className="grid gap-4 sm:grid-cols-2">{communities.map((community) => <button key={community.id} onClick={() => setSelected(community)} className={cn('rounded-2xl border p-5 text-left transition', selected?.id === community.id ? 'border-white/30 bg-white/[0.08]' : 'border-white/[0.08] bg-[#141414] hover:border-white/20')}><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-zinc-800 font-bold">{getInitials(community.name)}</span><div><h2 className="font-semibold">{community.name}</h2><p className="text-xs text-zinc-500">{community.memberCount} members · {community.isPublic ? 'Public' : 'Private'}</p></div></div><p className="mt-4 line-clamp-2 text-sm text-zinc-400">{community.description || 'Chưa có mô tả.'}</p><p className="mt-4 text-xs text-zinc-600">{community.isMember ? 'You are a member' : 'Not joined'}</p></button>)}</div>{selected ? <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">{editing ? <form onSubmit={update} className="space-y-3"><Input value={name} onChange={(e) => setName(e.target.value)} required className="border-white/10 bg-white/[0.04] text-white" /><Input value={description} onChange={(e) => setDescription(e.target.value)} className="border-white/10 bg-white/[0.04] text-white" /><div className="flex gap-2"><Button className="bg-white text-black">Save</Button><Button type="button" variant="outline" onClick={() => setEditing(false)} className="border-white/10 text-white">Cancel</Button></div></form> : <><div className="flex items-center gap-3"><span className="grid size-14 place-items-center rounded-xl bg-zinc-800 text-lg font-bold">{getInitials(selected.name)}</span><div><h2 className="text-xl font-semibold">{selected.name}</h2><p className="text-xs text-zinc-500">{selected.memberCount} members</p></div></div><p className="mt-5 text-sm leading-6 text-zinc-300">{selected.description || 'Chưa có mô tả.'}</p><Button onClick={() => void membership(selected)} className="mt-5 w-full bg-white text-black hover:bg-zinc-200">{selected.isMember ? 'Leave community' : 'Join community'}</Button>{profile?.userId === selected.ownerId && <div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => { setName(selected.name); setDescription(selected.description || ''); setEditing(true) }} className="flex-1 border-white/10 text-white">Edit</Button><Button variant="outline" onClick={() => void remove()} className="border-rose-500/30 text-rose-300">Delete</Button></div>}</>}</section> : <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 text-sm text-zinc-600">Chọn một community để xem chi tiết</div>}</div></div>
}

function ProfileView({ profile, onUpdate, onCommunity }: { profile: Profile | null; onUpdate: (profile: Profile) => void; onCommunity: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ username: '', displayName: '', bio: '', avatarUrl: '', coverUrl: '', dateOfBirth: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) setForm({
      username: profile.username,
      displayName: profile.displayName ?? '',
      bio: profile.bio ?? '',
      avatarUrl: profile.avatarUrl ?? '',
      coverUrl: profile.coverUrl ?? '',
      dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
    })
  }, [profile])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const token = localStorage.getItem('social_network_access_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, dateOfBirth: form.dateOfBirth || null }),
    })
    const body = (await response.json().catch(() => ({}))) as Profile & { message?: string }
    if (!response.ok) {
      setError(body.message ?? 'Không thể cập nhật thông tin.')
      return
    }
    onUpdate(body)
    setEditing(false)
    setError('')
  }

  async function uploadAvatar(file: File) {
    const token = localStorage.getItem('social_network_access_token')
    const data = new FormData()
    data.append('avatar', file)
    const response = await fetch(`${apiBaseUrl}/api/profile/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    })
    const body = (await response.json().catch(() => ({}))) as Profile & { message?: string }
    if (!response.ok) {
      setError(body.message ?? 'Không thể cập nhật avatar.')
      return
    }
    onUpdate(body)
    setForm((current) => ({ ...current, avatarUrl: getAssetUrl(body.avatarUrl) ?? '' }))
    setError('')
  }

  if (!profile) return <div className="mx-auto max-w-4xl px-5 py-10 text-zinc-400 lg:px-8">Đang tải hồ sơ...</div>
  return <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8"><div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]"><div className="h-44 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black bg-cover bg-center" style={profile.coverUrl ? { backgroundImage: `url(${getAssetUrl(profile.coverUrl)})` } : undefined} /><div className="relative p-6 pt-0"><Avatar className="-mt-12 size-24 border-4 border-[#141414]">{profile.avatarUrl && <AvatarImage src={getAssetUrl(profile.avatarUrl)} alt="" />}<AvatarFallback className="bg-zinc-800 text-2xl">{getInitials(profile.displayName ?? profile.username)}</AvatarFallback></Avatar><div className="mt-4 flex items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold">{profile.displayName || profile.username}</h1><p className="mt-1 text-sm text-zinc-500">@{profile.username} · {profile.email}</p><p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">{profile.bio || 'Bạn chưa thêm phần giới thiệu.'}</p></div><Button variant="outline" onClick={() => setEditing(!editing)} className="border-white/20 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white">{editing ? 'Cancel' : 'Edit profile'}</Button></div>{editing && <form onSubmit={saveProfile} className="mt-6 grid gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:grid-cols-2"><label className="text-sm text-zinc-400">Username<Input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Display name<Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400 sm:col-span-2">Bio<Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Avatar file<Input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadAvatar(file) }} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white file:text-white" /></label><label className="text-sm text-zinc-400">Avatar URL<Input type="url" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Cover URL<Input type="url" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Date of birth<Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><div className="sm:col-span-2">{error && <p className="mb-3 text-sm text-red-400">{error}</p>}<Button type="submit" className="bg-white text-black hover:bg-zinc-200">Save changes</Button></div></form>}<div className="mt-6 text-sm text-zinc-500">{profile.isEmailVerified ? 'Email verified' : 'Email not verified'}</div></div></div><div className="mt-8 flex border-b border-white/[0.08] text-sm"><button className="border-b-2 border-white px-1 pb-3 font-medium">Posts</button><button className="px-5 pb-3 text-zinc-600">Communities</button><button className="px-5 pb-3 text-zinc-600">About</button></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><button onClick={onCommunity} className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left hover:border-white/20"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-white text-xs font-bold text-black">LC</span><div><p className="text-sm font-semibold">Launch Club</p><p className="text-xs text-zinc-600">Member since 2024</p></div><ChevronRight className="ml-auto text-zinc-600" /></div></button><div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Account</p><p className="mt-3 text-sm leading-6 text-zinc-300">{profile.email}</p><p className="mt-3 text-xs text-zinc-600">Email and username are used for login.</p></div></div></div>
}

function getInitials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
}

function SettingsView() { return <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Workspace</p><h1 className="text-3xl font-semibold tracking-tight">Community settings</h1><p className="mt-2 text-sm text-zinc-500">Manage your community, roles, and permissions.</p><div className="mt-8 grid gap-8 lg:grid-cols-[190px_1fr]"><div className="flex gap-1 overflow-x-auto lg:flex-col"><button className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-black">Overview</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Roles & permissions</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Members</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Integrations</button></div><div className="flex flex-col gap-4"><section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><div className="flex items-center gap-3"><Shield className="text-zinc-400" /><div><h2 className="font-semibold">Roles & permissions</h2><p className="mt-1 text-sm text-zinc-600">Control what members can see and do.</p></div></div><div className="mt-5 flex flex-col gap-2">{['Founder', 'Moderator', 'Member', 'Guest'].map((r, i) => <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3" key={r}><span className="size-2 rounded-full bg-white" /><span className="text-sm">{r}</span><span className="ml-auto text-xs text-zinc-600">{i === 0 ? 'All permissions' : i === 1 ? '12 permissions' : '4 permissions'}</span><ChevronRight className="text-zinc-600" /></div>)}</div></section><section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><div className="flex items-center gap-3"><Settings className="text-zinc-400" /><div><h2 className="font-semibold">Community profile</h2><p className="mt-1 text-sm text-zinc-600">How your community appears across Orbit.</p></div></div><div className="mt-5 flex flex-col gap-4"><label className="text-sm text-zinc-400">Community name<Input defaultValue="Launch Club" className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Description<Textarea defaultValue="A focused space for founders, builders, and people shipping useful things." className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><Button className="w-fit bg-white text-black hover:bg-zinc-200">Save changes</Button></div></section></div></div></div> }
