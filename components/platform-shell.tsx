'use client'

import { useState } from 'react'
import {
  Bell, Bookmark, ChevronDown, ChevronRight, Compass, Hash, Headphones,
  Home, Image as ImageIcon, Layers3, MessageCircle, Mic, MoreHorizontal,
  Plus, Search, Settings, Shield, Sparkles, UserRound, Users, Video,
  Volume2, X, Smile, Send, Paperclip, Menu, PanelRightClose, CircleHelp,
  Radio, Lock, Heart, Repeat2, Share2, Pin, AtSign, SlidersHorizontal,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type View = 'home' | 'discover' | 'community' | 'friends' | 'profile' | 'settings'

type Member = { name: string; initials: string; role: string; status: string }

const members: Member[] = [
  { name: 'Maya Chen', initials: 'MC', role: 'Founder', status: 'online' },
  { name: 'Ravi Patel', initials: 'RP', role: 'Moderator', status: 'online' },
  { name: 'Sofia Kim', initials: 'SK', role: 'Designer', status: 'idle' },
  { name: 'Jordan Lee', initials: 'JL', role: 'Member', status: 'online' },
  { name: 'Alex Rivera', initials: 'AR', role: 'Member', status: 'offline' },
]

const posts = [
  { name: 'Maya Chen', initials: 'MC', handle: '@mayac', time: '24 min', text: 'A small reminder that the best communities are built around the conversations that happen between the big moments.', tag: 'community', comments: 18, likes: 142, accent: 'from-zinc-600 via-zinc-800 to-black' },
  { name: 'Jon Bell', initials: 'JB', handle: '@jonbell', time: '2 hr', text: 'Just shipped the new room discovery experience. Less friction, more finding your people.', tag: 'product', comments: 32, likes: 89, accent: 'from-zinc-400 via-zinc-700 to-zinc-950' },
]

export function PlatformShell() {
  const [view, setView] = useState<View>('home')
  const [mobileNav, setMobileNav] = useState(false)
  const [activeChannel, setActiveChannel] = useState('general')
  const [showMembers, setShowMembers] = useState(true)
  const [message, setMessage] = useState('')
  const [liked, setLiked] = useState<number[]>([])
  const [saved, setSaved] = useState<number[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSelected, setChatSelected] = useState('Maya Chen')

  const toggle = (arr: number[], set: (v: number[]) => void, index: number) => set(arr.includes(index) ? arr.filter((i) => i !== index) : [...arr, index])

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
          <Avatar className="ml-2 size-8 border border-white/10"><AvatarFallback className="bg-zinc-800 text-xs">YN</AvatarFallback></Avatar>
          <ChevronDown className="ml-1 text-zinc-500" />
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
          <CommunityItem active={view === 'community'} initials="LC" label="Launch Club" onClick={() => setView('community')} />
          <CommunityItem initials="DS" label="Design Systems" badge="3" onClick={() => setView('community')} />
          <CommunityItem initials="WM" label="Weekend Makers" onClick={() => setView('community')} />
        </div>
        <Separator className="my-5 bg-white/[0.08]" />
        <nav className="flex flex-col gap-1">
          <NavItem active={view === 'settings'} icon={<Settings />} label="Settings" onClick={() => setView('settings')} />
          <NavItem icon={<CircleHelp />} label="Help center" onClick={() => undefined} />
        </nav>
        <div className="absolute inset-x-3 bottom-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" /><span className="text-xs font-medium">You&apos;re online</span><MoreHorizontal className="ml-auto text-zinc-600" /></div><p className="mt-2 text-[11px] leading-relaxed text-zinc-500">Share what you&apos;re working on with your communities.</p></div>
      </aside>

      <main className="min-h-screen pt-16 lg:pl-64">{view === 'home' && <FeedView liked={liked} saved={saved} toggleLike={(i) => toggle(liked, setLiked, i)} toggleSave={(i) => toggle(saved, setSaved, i)} />}{view === 'discover' && <DiscoverView onCommunity={() => setView('community')} />}{view === 'friends' && <FriendsView />}{view === 'profile' && <ProfileView onCommunity={() => setView('community')} />}{view === 'settings' && <SettingsView />}{view === 'community' && <CommunityView activeChannel={activeChannel} setActiveChannel={setActiveChannel} showMembers={showMembers} setShowMembers={setShowMembers} message={message} setMessage={setMessage} />}</main>

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

  const messages = {
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

function FeedView({ liked, saved, toggleLike, toggleSave }: { liked: number[]; saved: number[]; toggleLike: (i: number) => void; toggleSave: (i: number) => void }) { return <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8"><div className="mb-10 flex items-end justify-between"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Monday, October 4</p><h1 className="text-3xl font-semibold tracking-tight">Good morning, Yuna</h1><p className="mt-2 text-sm text-zinc-500">Here&apos;s what&apos;s happening in your orbit.</p></div><Button className="hidden bg-white text-black hover:bg-zinc-200 sm:flex"><Plus data-icon="inline-start" />Create</Button></div><CreatePost /><div className="mb-6 flex items-center gap-6 border-b border-white/[0.08] text-sm"><button className="border-b-2 border-white pb-3 font-medium">For you</button><button className="pb-3 text-zinc-500 hover:text-white">Following</button><button className="pb-3 text-zinc-500 hover:text-white">Saved</button></div><div className="flex flex-col gap-4">{posts.map((post, i) => <PostCard key={post.name} {...post} isLiked={liked.includes(i)} isSaved={saved.includes(i)} onLike={() => toggleLike(i)} onSave={() => toggleSave(i)} />)}</div></div> }
function CreatePost() { return <div className="mb-8 rounded-2xl border border-white/[0.08] bg-[#141414] p-4"><div className="flex gap-3"><Avatar className="size-9"><AvatarFallback className="bg-zinc-800 text-xs">YN</AvatarFallback></Avatar><div className="flex-1"><Textarea placeholder="Share something with your communities..." className="min-h-16 resize-none border-0 bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-0" /><div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3"><div className="flex gap-1"><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white"><ImageIcon data-icon="inline-start" />Media</Button><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white"><AtSign data-icon="inline-start" />Mention</Button></div><Button size="sm" className="bg-white text-black hover:bg-zinc-200">Post</Button></div></div></div></div> }
function PostCard({ name, initials, handle, time, text, tag, comments, likes, accent, isLiked, isSaved, onLike, onSave }: { name: string; initials: string; handle: string; time: string; text: string; tag: string; comments: number; likes: number; accent: string; isLiked: boolean; isSaved: boolean; onLike: () => void; onSave: () => void }) { return <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]"><div className="p-5"><div className="flex items-start gap-3"><Avatar className="size-9"><AvatarFallback className="bg-zinc-800 text-xs">{initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-sm font-semibold">{name}</span><Badge variant="outline" className="h-5 border-white/10 px-1.5 text-[10px] text-zinc-500">{tag}</Badge><MoreHorizontal className="ml-auto text-zinc-600" /></div><p className="text-xs text-zinc-600">{handle} · {time}</p></div></div><p className="mt-4 text-[15px] leading-7 text-zinc-200">{text}</p></div><div className={cn('mx-5 h-48 rounded-xl bg-gradient-to-br opacity-90', accent)}><div className="flex h-full items-center justify-center"><span className="text-5xl font-black tracking-tighter text-white/10">ORBIT</span></div></div><div className="flex items-center gap-1 p-3"><Button variant="ghost" size="sm" onClick={onLike} className={cn('text-zinc-500 hover:text-white', isLiked && 'text-white')}><Heart fill={isLiked ? 'currentColor' : 'none'} data-icon="inline-start" />{likes + (isLiked ? 1 : 0)}</Button><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white"><MessageCircle data-icon="inline-start" />{comments}</Button><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white"><Repeat2 data-icon="inline-start" /></Button><Button variant="ghost" size="icon" onClick={onSave} className={cn('ml-auto text-zinc-500 hover:text-white', isSaved && 'text-white')}><Bookmark fill={isSaved ? 'currentColor' : 'none'} /></Button><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Share2 /></Button></div></article> }

function DiscoverView({ onCommunity }: { onCommunity: () => void }) { const communities = [{ initials: 'LC', name: 'Launch Club', desc: 'A focused space for founders, builders, and people shipping useful things.', members: '12.8k', joined: true }, { initials: 'DS', name: 'Design Systems', desc: 'The craft, code, and culture behind thoughtful product interfaces.', members: '8.4k' }, { initials: 'WM', name: 'Weekend Makers', desc: 'Make time for the side projects you keep thinking about.', members: '5.2k' }, { initials: 'OT', name: 'Open Table', desc: 'Long-form conversations about work, culture, and the world around us.', members: '3.1k' }]; return <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><div className="mb-10"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Explore</p><h1 className="text-3xl font-semibold tracking-tight">Find your people</h1><p className="mt-2 max-w-lg text-sm text-zinc-500">Communities are spaces to go deeper — share work, learn in public, and build together.</p></div><div className="mb-8 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-zinc-500" /><Input placeholder="Search communities" className="border-white/[0.08] bg-[#141414] pl-9 text-white placeholder:text-zinc-600" /></div><Button variant="outline" className="border-white/10 text-zinc-300"><SlidersHorizontal data-icon="inline-start" />Filters</Button></div><div className="grid gap-4 sm:grid-cols-2">{communities.map((c) => <button key={c.name} onClick={onCommunity} className="group rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left transition hover:border-white/25 hover:bg-[#191919]"><div className="flex items-start gap-4"><span className="grid size-12 place-items-center rounded-xl bg-white text-sm font-bold text-black">{c.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold">{c.name}</h2>{c.joined && <Badge className="bg-white/[0.1] text-[10px] text-zinc-300">Joined</Badge>}</div><p className="mt-1 text-sm leading-6 text-zinc-500">{c.desc}</p></div><ChevronRight className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" /></div><div className="mt-5 flex items-center gap-4 text-xs text-zinc-600"><span className="flex items-center gap-1"><Users />{c.members} members</span><span className="flex items-center gap-1"><MessageCircle />Active today</span></div></button>)}</div></div> }

function CommunityView({ activeChannel, setActiveChannel, showMembers, setShowMembers, message, setMessage }: { activeChannel: string; setActiveChannel: (c: string) => void; showMembers: boolean; setShowMembers: (v: boolean) => void; message: string; setMessage: (v: string) => void }) { const channels = ['general', 'introductions', 'feedback', 'resources']; const chat = [{ initials: 'MC', name: 'Maya Chen', time: '10:42 AM', text: 'Welcome to the new Launch Club space. This is where we can share what we are building and find thoughtful feedback.' }, { initials: 'RP', name: 'Ravi Patel', time: '10:45 AM', text: 'The new channel structure feels great. I added a few resources to #resources for anyone exploring early-stage product.' }, { initials: 'YN', name: 'Yuna Nakamura', time: '10:49 AM', text: 'This is exactly the kind of space I was looking for. Excited to meet everyone here.' }]; return <div className="flex h-[calc(100vh-4rem)] min-h-[640px] overflow-hidden"><div className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-[#101010] md:block"><div className="flex h-16 items-center border-b border-white/[0.08] px-4"><div className="grid size-8 place-items-center rounded-lg bg-white text-xs font-bold text-black">LC</div><div className="ml-3 min-w-0"><p className="truncate text-sm font-semibold">Launch Club</p><p className="text-[10px] text-zinc-600">12,842 members</p></div><button className="ml-auto text-zinc-500 hover:text-white"><ChevronDown /></button></div><div className="p-3"><div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600"><span>Text channels</span><Plus /></div>{channels.map((c) => <button key={c} onClick={() => setActiveChannel(c)} className={cn('mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm', activeChannel === c ? 'bg-white/[0.1] text-white' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300')}><Hash />{c}<MoreHorizontal className="ml-auto opacity-0 group-hover:opacity-100" /></button>)}<div className="mb-2 mt-7 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600"><span>Voice channels</span><Plus /></div>{['Lounge', 'Focus room'].map((c) => <button key={c} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"><Volume2 />{c}<span className="ml-auto text-[10px] text-zinc-600">{c === 'Lounge' ? '4' : '2'}</span></button>)}</div><div className="absolute bottom-0 w-60 border-t border-white/[0.08] bg-[#141414] p-3"><div className="flex items-center gap-2"><Avatar className="size-8"><AvatarFallback className="bg-zinc-800 text-[10px]">YN</AvatarFallback></Avatar><div><p className="text-xs font-medium">Yuna</p><p className="text-[10px] text-zinc-600">Online</p></div><Mic className="ml-auto text-zinc-500" /><Headphones className="text-zinc-500" /></div></div></div><div className="flex min-w-0 flex-1 flex-col bg-[#141414]"><div className="flex h-16 shrink-0 items-center border-b border-white/[0.08] px-4"><Hash className="text-zinc-500" /><span className="ml-2 font-semibold">{activeChannel}</span><Separator orientation="vertical" className="mx-4 h-5 bg-white/[0.08]" /><span className="hidden truncate text-xs text-zinc-600 sm:block">A place to share, ask, and connect.</span><div className="ml-auto flex gap-1"><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Bell /></Button><Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)} className={cn('text-zinc-500 hover:text-white', showMembers && 'text-white')}><Users /></Button><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><PanelRightClose /></Button></div></div><div className="flex-1 overflow-y-auto p-4 sm:p-6">{activeChannel === 'general' ? <>{chat.map((m, i) => <div className="group mb-6 flex gap-3" key={m.name}><Avatar className="mt-0.5 size-9"><AvatarFallback className="bg-zinc-800 text-xs">{m.initials}</AvatarFallback></Avatar><div><div className="flex items-baseline gap-2"><span className="text-sm font-semibold">{m.name}</span>{i === 0 && <Badge className="h-4 bg-white px-1 text-[9px] text-black">FOUNDER</Badge>}<span className="text-[10px] text-zinc-700">{m.time}</span></div><p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-300">{m.text}</p><div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100"><Button variant="outline" size="sm" className="h-6 border-white/10 px-2 text-[10px] text-zinc-500"><Heart />12</Button><Button variant="outline" size="sm" className="h-6 border-white/10 px-2 text-[10px] text-zinc-500">Reply</Button></div></div></div>)}<div className="my-10 flex items-center gap-3"><Separator className="bg-white/[0.08]" /><span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Today</span><Separator className="bg-white/[0.08]" /></div></> : <div className="grid h-full place-items-center text-center"><div><div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]"><Hash /></div><h2 className="font-semibold">Welcome to #{activeChannel}</h2><p className="mt-2 text-sm text-zinc-600">This is the beginning of the #{activeChannel} channel.</p></div></div>}</div><div className="p-4 pt-0"><div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-[#1b1b1b] p-2"><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Plus /></Button><Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Message #${activeChannel}`} className="h-9 border-0 bg-transparent text-sm text-white shadow-none focus-visible:ring-0" /><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Smile /></Button><Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white"><Send /></Button></div></div></div>{showMembers && <aside className="hidden w-60 shrink-0 border-l border-white/[0.08] bg-[#101010] xl:block"><div className="border-b border-white/[0.08] p-4"><p className="text-xs font-semibold">About this community</p><p className="mt-2 text-xs leading-5 text-zinc-600">A focused space for founders, builders, and people shipping useful things.</p></div><div className="p-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Online — 4</p>{members.slice(0, 4).map((m) => <div className="mb-3 flex items-center gap-2" key={m.name}><div className="relative"><Avatar className="size-8"><AvatarFallback className="bg-zinc-800 text-[10px]">{m.initials}</AvatarFallback></Avatar><span className={cn('absolute bottom-0 right-0 size-2 rounded-full border-2 border-[#101010]', m.status === 'online' ? 'bg-white' : 'bg-zinc-600')} /></div><div className="min-w-0"><p className="truncate text-xs font-medium">{m.name}</p><p className="text-[10px] text-zinc-600">{m.role}</p></div></div>)}</div></aside>}</div> }

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

function ProfileView({ onCommunity }: { onCommunity: () => void }) { return <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8"><div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]"><div className="h-44 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black" /><div className="relative p-6 pt-0"><Avatar className="-mt-12 size-24 border-4 border-[#141414]"><AvatarFallback className="bg-zinc-800 text-2xl">YN</AvatarFallback></Avatar><div className="mt-4 flex items-start justify-between"><div><h1 className="text-2xl font-semibold">Yuna Nakamura</h1><p className="mt-1 text-sm text-zinc-500">@yuna · Building thoughtful tools for creative communities.</p><p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">Designer, facilitator, and occasional writer. Interested in the spaces between people and products.</p></div><Button variant="outline" className="hidden border-white/10 sm:flex">Edit profile</Button></div><div className="mt-6 flex gap-6 text-sm"><span><strong>128</strong> <span className="text-zinc-600">following</span></span><span><strong>2.4k</strong> <span className="text-zinc-600">followers</span></span><span><strong>4</strong> <span className="text-zinc-600">communities</span></span></div></div></div><div className="mt-8 flex border-b border-white/[0.08] text-sm"><button className="border-b-2 border-white px-1 pb-3 font-medium">Posts</button><button className="px-5 pb-3 text-zinc-600">Communities</button><button className="px-5 pb-3 text-zinc-600">About</button></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><button onClick={onCommunity} className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left hover:border-white/20"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-white text-xs font-bold text-black">LC</span><div><p className="text-sm font-semibold">Launch Club</p><p className="text-xs text-zinc-600">Member since 2024</p></div><ChevronRight className="ml-auto text-zinc-600" /></div></button><div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Latest post</p><p className="mt-3 text-sm leading-6 text-zinc-300">The best communities are designed for the quiet moments, too.</p><p className="mt-3 text-xs text-zinc-600">42 likes · 8 comments</p></div></div></div> }

function SettingsView() { return <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Workspace</p><h1 className="text-3xl font-semibold tracking-tight">Community settings</h1><p className="mt-2 text-sm text-zinc-500">Manage your community, roles, and permissions.</p><div className="mt-8 grid gap-8 lg:grid-cols-[190px_1fr]"><div className="flex gap-1 overflow-x-auto lg:flex-col"><button className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-black">Overview</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Roles & permissions</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Members</button><button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">Integrations</button></div><div className="flex flex-col gap-4"><section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><div className="flex items-center gap-3"><Shield className="text-zinc-400" /><div><h2 className="font-semibold">Roles & permissions</h2><p className="mt-1 text-sm text-zinc-600">Control what members can see and do.</p></div></div><div className="mt-5 flex flex-col gap-2">{['Founder', 'Moderator', 'Member', 'Guest'].map((r, i) => <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3" key={r}><span className="size-2 rounded-full bg-white" /><span className="text-sm">{r}</span><span className="ml-auto text-xs text-zinc-600">{i === 0 ? 'All permissions' : i === 1 ? '12 permissions' : '4 permissions'}</span><ChevronRight className="text-zinc-600" /></div>)}</div></section><section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5"><div className="flex items-center gap-3"><Settings className="text-zinc-400" /><div><h2 className="font-semibold">Community profile</h2><p className="mt-1 text-sm text-zinc-600">How your community appears across Orbit.</p></div></div><div className="mt-5 flex flex-col gap-4"><label className="text-sm text-zinc-400">Community name<Input defaultValue="Launch Club" className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><label className="text-sm text-zinc-400">Description<Textarea defaultValue="A focused space for founders, builders, and people shipping useful things." className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" /></label><Button className="w-fit bg-white text-black hover:bg-zinc-200">Save changes</Button></div></section></div></div></div> }
