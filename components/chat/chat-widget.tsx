'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Paperclip,
  Phone,
  Plus,
  Send,
  Smile,
  Video,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAssetUrl, getInitials } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Call, Message, MessageAttachment } from '@/types'
import { useAppStore } from '@/stores/app-store'
import { useChatStore } from '@/stores/chat-store'
import { CallModal } from './call-modal'

export function ChatWidget() {
  const { profile } = useAppStore()
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    addMessage,
    activeCall,
    setActiveCall,
    chatWidgetExpanded,
    setChatWidgetExpanded,
  } = useChatStore()

  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConversationId) ?? conversations[0]
  const currentMessages = activeConv ? messages[activeConv.id] ?? [] : []

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isOpen])

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() && selectedFiles.length === 0) return
    if (!activeConv) return

    const attachments: MessageAttachment[] = selectedFiles.map((f, i) => ({
      id: `att-${Date.now()}-${i}`,
      mediaType: f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'file',
      url: URL.createObjectURL(f),
      name: f.name,
      sizeBytes: f.size,
    }))

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: profile?.userId ?? 'me',
      senderName: profile?.displayName || profile?.username || 'Tôi',
      senderAvatar: profile?.avatarUrl,
      content: inputText.trim(),
      messageType: attachments.length > 0 ? 'MEDIA' : 'TEXT',
      attachments,
      reactions: [],
      readBy: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT',
    }

    // Optimistic UI for Chat
    addMessage(activeConv.id, newMsg)
    setInputText('')
    setSelectedFiles([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleStartCall = (callType: 'AUDIO' | 'VIDEO') => {
    if (!activeConv) return
    const newCall: Call = {
      id: `call-${Date.now()}`,
      conversationId: activeConv.id,
      callType,
      status: 'ONGOING',
      initiatorName: activeConv.name ?? 'Cuộc gọi',
      initiatorAvatar: activeConv.avatarUrl,
      participants: [
        {
          userId: 'target',
          displayName: activeConv.name ?? 'Người nhận',
          isMuted: false,
          isVideoOff: false,
        },
      ],
    }
    setActiveCall(newCall)
  }

  const filteredConversations = conversations.filter((c) =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 select-none">
        {isOpen && (
          <div
            className={cn(
              'flex overflow-hidden rounded-3xl border border-white/10 bg-[#121215] shadow-2xl transition-all duration-200',
              chatWidgetExpanded
                ? 'h-[640px] w-[860px]'
                : 'h-[480px] w-[390px] sm:w-[540px]',
            )}
          >
            {/* Conversation List Sidebar */}
            <div className="w-[180px] sm:w-[220px] border-r border-white/10 bg-[#0e0e11] flex flex-col justify-between">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Tin nhắn</h3>
                  <button
                    onClick={() => {
                      const name = window.prompt('Nhập tên người bạn muốn nhắn tin:')
                      if (!name) return
                      const newConvId = `conv-${Date.now()}`
                      // Thêm cuộc trò chuyện mới
                      useChatStore.getState().setConversations([
                        {
                          id: newConvId,
                          conversationType: 'DIRECT',
                          name,
                          unreadCount: 0,
                          lastMessage: 'Vừa tạo cuộc trò chuyện',
                          lastMessageAt: 'Bây giờ',
                          participants: [{ userId: `u-${Date.now()}`, username: name.toLowerCase(), displayName: name, status: 'online' }],
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        },
                        ...conversations,
                      ])
                      setActiveConversationId(newConvId)
                    }}
                    className="grid size-7 place-items-center rounded-full bg-white/5 text-zinc-300 hover:bg-white/10"
                    title="Hội thoại mới"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="h-7 border-white/10 bg-white/[0.04] text-[11px] text-white placeholder:text-zinc-500 mb-2"
                />

                <div className="space-y-1 overflow-y-auto max-h-[360px]">
                  {filteredConversations.map((c) => {
                    const active = c.id === activeConversationId
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveConversationId(c.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-xl p-2 text-left transition',
                          active
                            ? 'bg-white/10 text-white'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white',
                        )}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="size-8">
                            {c.avatarUrl && <AvatarImage src={getAssetUrl(c.avatarUrl)} />}
                            <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">
                              {getInitials(c.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-[#0e0e11] bg-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-xs font-medium text-white">{c.name}</p>
                            {c.unreadCount > 0 && (
                              <span className="grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-black">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-zinc-500">{c.lastMessage}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Chat Conversation Area */}
            {activeConv ? (
              <div className="flex-1 flex flex-col bg-[#141418]">
                {/* Chat Header */}
                <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      {activeConv.avatarUrl && <AvatarImage src={getAssetUrl(activeConv.avatarUrl)} />}
                      <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">
                        {getInitials(activeConv.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{activeConv.name}</h4>
                      <p className="text-[10px] text-emerald-400">Đang hoạt động</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall('AUDIO')}
                      className="size-7 text-zinc-400 hover:text-white"
                      title="Gọi thoại"
                    >
                      <Phone className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartCall('VIDEO')}
                      className="size-7 text-zinc-400 hover:text-white"
                      title="Gọi video"
                    >
                      <Video className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setChatWidgetExpanded((prev) => !prev)}
                      className="size-7 text-zinc-400 hover:text-white"
                      title={chatWidgetExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                    >
                      {chatWidgetExpanded ? (
                        <Minimize2 className="size-3.5" />
                      ) : (
                        <Maximize2 className="size-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="size-7 text-zinc-400 hover:text-white"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {currentMessages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
                      <p className="text-xs">Chưa có tin nhắn nào ở đây.</p>
                      <p className="text-[11px] mt-1 text-zinc-600">Hãy gửi lời chào đầu tiên! 👋</p>
                    </div>
                  ) : (
                    currentMessages.map((msg) => {
                      const isMe = msg.senderId === (profile?.userId ?? 'me')
                      return (
                        <div
                          key={msg.id}
                          className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm',
                              isMe
                                ? 'bg-white text-black font-medium rounded-tr-xs'
                                : 'bg-white/10 text-zinc-200 rounded-tl-xs',
                            )}
                          >
                            {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                            {/* Attachments rendering */}
                            {msg.attachments?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map((att) => (
                                  <div key={att.id} className="overflow-hidden rounded-lg">
                                    {att.mediaType === 'image' ? (
                                      <img src={att.url} alt="" className="max-h-40 rounded-lg object-cover" />
                                    ) : (
                                      <div className="flex items-center gap-2 rounded-lg bg-black/20 p-2 text-[10px]">
                                        <FileText className="size-3.5" />
                                        <span className="truncate">{att.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reactions Pill */}
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="mt-1 flex gap-1">
                                {msg.reactions.map((r, i) => (
                                  <span
                                    key={i}
                                    className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px]"
                                  >
                                    {r.reactionType} {r.count}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-1 text-[9px] text-zinc-600 px-1">
                            <span>{msg.createdAt}</span>
                            {isMe && (
                              <span>
                                {msg.status === 'READ' ? (
                                  <CheckCheck className="size-2.5 text-blue-400" />
                                ) : (
                                  <Check className="size-2.5 text-zinc-500" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Previews for selected files */}
                {selectedFiles.length > 0 && (
                  <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.02] p-2 text-xs text-zinc-300">
                    <Paperclip className="size-3.5 text-zinc-400" />
                    <span className="truncate">{selectedFiles.length} tệp đã chọn</span>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="ml-auto text-zinc-500 hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Input Dock */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-1.5 border-t border-white/10 p-3 bg-[#111114]"
                >
                  <label className="grid size-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer">
                    <Paperclip className="size-4" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>

                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Nhập tin nhắn...`}
                    className="h-8 border-0 bg-transparent text-xs text-white shadow-none focus-visible:ring-0 placeholder:text-zinc-500"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    className="size-8 rounded-full bg-white text-black hover:bg-zinc-200 shrink-0"
                  >
                    <Send className="size-3.5" />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex-1 grid place-items-center text-xs text-zinc-500">
                Chọn một hội thoại để nhắn tin
              </div>
            )}
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative grid size-13 place-items-center rounded-full bg-white text-black shadow-2xl transition hover:scale-105 active:scale-95"
          aria-label="Tin nhắn"
        >
          <Smile className="size-6" />
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-[#0a0a0a]">
            1
          </span>
        </button>
      </div>

      {/* Active Call Modal */}
      {activeCall && <CallModal call={activeCall} />}
    </>
  )
}
