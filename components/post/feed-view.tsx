'use client'

import { useEffect, useState, useRef, FormEvent } from 'react'
import { Bookmark, Check, Edit2, Heart, Image as ImageIcon, MessageCircle, MoreHorizontal, Reply, Trash2, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch, getAssetUrl, getInitials } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Comment, Media, Post, PostPage, ReactionSummary } from '@/types'
import { useAppStore } from '@/stores/app-store'

export const REACTION_CONFIG = [
  { type: 'LIKE', label: 'Like', emoji: '👍', color: 'text-blue-400' },
  { type: 'LOVE', label: 'Love', emoji: '❤️', color: 'text-rose-500' },
  { type: 'HAHA', label: 'Haha', emoji: '😆', color: 'text-amber-400' },
  { type: 'WOW', label: 'Wow', emoji: '😮', color: 'text-yellow-400' },
  { type: 'SAD', label: 'Sad', emoji: '😢', color: 'text-amber-300' },
  { type: 'ANGRY', label: 'Angry', emoji: '😡', color: 'text-orange-500' },
] as const

function ReactionPicker({
  isOpen,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean
  onSelect: (type: string) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute bottom-full left-0 z-50 mb-2 flex items-center gap-1 rounded-full border border-white/10 bg-[#1c1c1e] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
    >
      {REACTION_CONFIG.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(item.type)
          }}
          className="group relative flex size-8 items-center justify-center rounded-full text-lg transition-transform hover:scale-130 hover:-translate-y-1 active:scale-95"
          title={item.label}
        >
          <span>{item.emoji}</span>
          <span className="pointer-events-none absolute -top-7 hidden rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-white shadow group-hover:block whitespace-nowrap">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function ReactionBreakdownBadge({
  summary,
  className,
}: {
  summary: ReactionSummary | null
  className?: string
}) {
  if (!summary || (summary.totalCount ?? 0) <= 0) return null

  // Sort active reaction types by count descending
  const activeReactions = REACTION_CONFIG.filter(
    (cfg) => (summary.counts?.[cfg.type] ?? 0) > 0
  ).sort((a, b) => (summary.counts?.[b.type] ?? 0) - (summary.counts?.[a.type] ?? 0))

  if (activeReactions.length === 0) return null

  // Tooltip content detailing counts for each reaction type
  const tooltipText = activeReactions
    .map((r) => `${r.emoji} ${r.label}: ${summary.counts?.[r.type]}`)
    .join('  •  ')

  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-300 shadow-sm cursor-help hover:bg-white/10 hover:border-white/20 transition',
        className
      )}
      title={tooltipText}
    >
      {/* Overlapping emoji icons */}
      <div className="flex items-center -space-x-1">
        {activeReactions.slice(0, 3).map((r) => (
          <span
            key={r.type}
            className="inline-flex size-4 items-center justify-center rounded-full bg-[#1c1c1e] text-[11px] ring-1 ring-white/15"
          >
            {r.emoji}
          </span>
        ))}
      </div>
      <span className="font-semibold text-zinc-200">{summary.totalCount}</span>

      {/* Floating Detailed Breakdown Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden min-w-max rounded-lg border border-white/10 bg-[#18181b]/95 px-2.5 py-1.5 shadow-xl backdrop-blur-md group-hover:flex items-center gap-2 text-[11px] text-zinc-200 z-50">
        {activeReactions.map((r) => (
          <div key={r.type} className="flex items-center gap-1">
            <span>{r.emoji}</span>
            <span className={cn('font-medium', r.color)}>{summary.counts?.[r.type]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeedView() {
  const { profile } = useAppStore()
  const [page, setPage] = useState<PostPage | null>(null)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'all' | 'saved'>('all')

  const load = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/posts')
      setPage(await response.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải feed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function loadSaved() {
    try {
      const response = await apiFetch('/api/bookmarks')
      const data = (await response.json()) as PostPage
      setSavedIds(data.items.map((post) => post.id))
    } catch {
      setSavedIds([])
    }
  }

  useEffect(() => {
    void loadSaved()
  }, [])

  const displayedPosts = tab === 'saved'
    ? (page?.items.filter((p) => savedIds.includes(p.id)) ?? [])
    : (page?.items ?? [])

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Your orbit</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Good morning, {profile?.displayName || profile?.username || 'there'}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Những cuộc trò chuyện mới nhất từ cộng đồng của bạn.</p>
      </div>

      <CreatePost onCreated={load} />

      {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}

      <div className="mb-6 flex items-center gap-6 border-b border-white/[0.08] text-sm">
        <button
          onClick={() => setTab('all')}
          className={cn('pb-3 font-medium transition', tab === 'all' ? 'border-b-2 border-white text-white' : 'text-zinc-500 hover:text-white')}
        >
          For you
        </button>
        <button
          onClick={() => {
            setTab('saved')
            void loadSaved()
          }}
          className={cn('pb-3 font-medium transition', tab === 'saved' ? 'border-b-2 border-white text-white' : 'text-zinc-500 hover:text-white')}
        >
          Saved ({savedIds.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="flex gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="mt-4 h-16 w-full" />
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="flex gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="mt-4 h-24 w-full" />
          </div>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">
          {tab === 'saved' ? 'Bạn chưa lưu bài viết nào.' : 'Chưa có bài viết nào trong feed.'}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              saved={savedIds.includes(post.id)}
              onSaved={() => void loadSaved()}
              onDeleted={() => {
                setPage((prev) =>
                  prev
                    ? {
                      ...prev,
                      items: prev.items.filter((item) => item.id !== post.id),
                      totalCount: prev.totalCount - 1,
                    }
                    : prev,
                )
              }}
              onUpdated={(updatedPost) => {
                setPage((prev) =>
                  prev
                    ? {
                      ...prev,
                      items: prev.items.map((item) => (item.id === updatedPost.id ? updatedPost : item)),
                    }
                    : prev,
                )
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
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
    event.preventDefault()
    if (!content.trim()) return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const response = await apiFetch('/api/posts/create', {
        method: 'POST',
        body: JSON.stringify({ content: content.trim(), visibility: 'PUBLIC' }),
      })
      const post = (await response.json()) as Post
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
    } finally {
      setBusy(false)
    }
  }

  function selectFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    const invalid = selected.find(
      (file) =>
        !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type) ||
        file.size > 10 * 1024 * 1024,
    )
    if (invalid) {
      setError('Mỗi ảnh/video phải là JPG, PNG, WEBP, GIF, MP4 hoặc WEBM và không quá 10 MB.')
      return
    }
    setFiles(selected)
    setError('')
  }

  return (
    <form onSubmit={submit} className="mb-8 rounded-2xl border border-white/[0.08] bg-[#141414] p-4">
      <div className="flex gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-zinc-800 text-xs">ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value)
              setError('')
              setSuccess('')
            }}
            placeholder="Share something with your communities..."
            className="min-h-16 resize-none border-0 bg-transparent p-0 text-sm text-white placeholder:text-zinc-600 focus-visible:ring-0"
          />
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {previews.map(({ file, url }) => (
                <div key={`${file.name}-${file.size}`} className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  {file.type.startsWith('video/') ? (
                    <video src={url} controls preload="metadata" className="h-28 w-full object-cover" />
                  ) : (
                    <img src={url} alt={`Preview ${file.name}`} className="h-28 w-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file) => (
                <span key={`${file.name}-${file.size}`} className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                  {file.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-500 hover:text-white">
              <ImageIcon className="size-4" />
              Ảnh/video
              <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" className="hidden" onChange={selectFiles} />
            </label>
            <Button type="submit" disabled={busy || !content.trim()} size="sm" className="bg-white text-black hover:bg-zinc-200">
              {busy ? 'Posting...' : 'Post'}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-zinc-600">Ảnh và video MP4/WEBM tối đa 10 MB mỗi file.</p>
          {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
          {success && <p role="status" className="mt-2 text-xs text-emerald-300">{success}</p>}
        </div>
      </div>
    </form>
  )
}

function PostCard({
  post,
  saved,
  onSaved,
  onDeleted,
  onUpdated,
}: {
  post: Post
  saved: boolean
  onSaved: () => void
  onDeleted?: () => void
  onUpdated?: (updated: Post) => void
}) {
  const { profile } = useAppStore()
  const isOwner = Boolean(
    profile?.userId &&
    post.authorId &&
    profile.userId.toLowerCase() === post.authorId.toLowerCase(),
  )

  const [summary, setSummary] = useState<ReactionSummary | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [postError, setPostError] = useState('')

  useEffect(() => {
    void Promise.all([
      apiFetch(`/api/posts/${post.id}/reaction`).then((r) => r.json()),
      apiFetch(`/api/posts/${post.id}/comments`).then((r) => r.json()),
      apiFetch(`/api/posts/${post.id}/media`).then((r) => r.json()),
    ])
      .then(([reaction, loadedComments, loadedMedia]) => {
        setSummary(reaction)
        setComments(loadedComments)
        setMedia(loadedMedia)
      })
      .catch(() => undefined)
  }, [post.id])

  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  function handleReactionMouseEnter() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    // Hover 1 second to show reactions
    if (!showReactionPicker && !hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(() => {
        setShowReactionPicker(true)
        hoverTimerRef.current = null
      }, 500)
    }
  }

  function handleReactionMouseLeave() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    // Delay closing briefly so user can hover onto the picker
    closeTimerRef.current = setTimeout(() => {
      setShowReactionPicker(false)
      closeTimerRef.current = null
    }, 400)
  }

  async function react(selectedType?: string) {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setShowReactionPicker(false)

    const prevSummary = summary
    const currentReaction = summary?.currentUserReaction

    // If no type specified: toggle like/love or remove current
    const targetType = selectedType || (currentReaction ? null : 'LOVE')
    const isRemoving = currentReaction && (targetType === null || targetType === currentReaction)

    setSummary((prev) => {
      const counts = { ...(prev?.counts ?? {}) }
      let total = prev?.totalCount ?? 0

      if (currentReaction && counts[currentReaction]) {
        counts[currentReaction] = Math.max(0, counts[currentReaction] - 1)
        total = Math.max(0, total - 1)
      }

      if (!isRemoving && targetType) {
        counts[targetType] = (counts[targetType] ?? 0) + 1
        total += 1
      }

      return {
        ...prev,
        currentUserReaction: isRemoving ? null : targetType,
        totalCount: total,
        counts,
      }
    })

    try {
      const response = await apiFetch(`/api/posts/${post.id}/reaction`, {
        method: isRemoving ? 'DELETE' : 'PUT',
        body: isRemoving ? undefined : JSON.stringify({ type: targetType }),
      })
      setSummary(await response.json())
    } catch {
      setSummary(prevSummary) // Rollback on error
    }
  }

  async function save() {
    await apiFetch(`/api/posts/${post.id}/bookmark`, { method: saved ? 'DELETE' : 'PUT' })
    onSaved()
  }

  async function handleDelete() {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return
    try {
      await apiFetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      onDeleted?.()
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Không thể xóa bài viết.')
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!editContent.trim()) return
    setIsSaving(true)
    setPostError('')
    try {
      const response = await apiFetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent.trim(), visibility: post.visibility || 'PUBLIC' }),
      })
      const updated = (await response.json()) as Post
      setIsEditing(false)
      onUpdated?.(updated)
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Không thể chỉnh sửa bài viết.')
    } finally {
      setIsSaving(false)
    }
  }

  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState('')

  async function reloadComments() {
    try {
      const getRes = await apiFetch(`/api/posts/${post.id}/comments`)
      const refreshed = (await getRes.json()) as Comment[]
      setComments(refreshed)
    } catch {
      // Keep existing comments on error
    }
  }

  async function addComment(event: FormEvent) {
    event.preventDefault()
    const content = comment.trim()
    if (!content || isSubmittingComment) return

    setIsSubmittingComment(true)
    setCommentError('')

    try {
      const response = await apiFetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      const newComment = (await response.json()) as Comment
      setComment('')
      setShowComments(true)

      try {
        await reloadComments()
      } catch {
        setComments((prev) => [...prev, newComment])
      }
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Không thể gửi bình luận.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  async function upload(file: File) {
    const data = new FormData()
    data.append('file', file)
    await apiFetch(`/api/posts/${post.id}/media`, { method: 'POST', body: data })
    setMedia(((await (await apiFetch(`/api/posts/${post.id}/media`)).json()) as Media[]))
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-9">
            {post.authorAvatarUrl && <AvatarImage src={getAssetUrl(post.authorAvatarUrl)} alt="" />}
            <AvatarFallback className="bg-zinc-800 text-xs">
              {getInitials(post.authorDisplayName || post.authorUsername || post.authorId)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {post.authorDisplayName || post.authorUsername || post.authorId.slice(0, 8)}
              </span>
              <Badge variant="outline" className="h-5 border-white/10 px-1.5 text-[10px] text-zinc-500">
                {post.visibility}
              </Badge>

              {isOwner && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition outline-none cursor-pointer"
                      title="Tùy chọn bài viết"
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 border border-white/10 bg-[#1c1c1c] text-zinc-200">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditContent(post.content ?? '')
                          setIsEditing(true)
                        }}
                        className="flex cursor-pointer items-center gap-2 hover:bg-white/10 hover:text-white"
                      >
                        <Edit2 className="size-3.5" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => void handleDelete()}
                        className="flex cursor-pointer items-center gap-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Xóa bài viết</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-600">
              @{post.authorUsername || post.authorId.slice(0, 8)} · {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="mt-4 space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-24 rounded-xl border border-white/15 bg-white/[0.04] p-3 text-sm text-white"
              required
            />
            {postError && <p className="text-xs text-rose-400">{postError}</p>}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(post.content ?? '')
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="mr-1 size-3.5" /> Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving || !editContent.trim()}
                className="bg-white text-black hover:bg-zinc-200"
              >
                <Check className="mr-1 size-3.5" /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-zinc-200">{post.content}</p>
        )}

        {media.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {media.map((item) =>
              item.mediaType.startsWith('video/') ? (
                <video key={item.id} controls src={getAssetUrl(item.url)} className="max-h-72 w-full rounded-xl object-cover" />
              ) : (
                <img key={item.id} src={getAssetUrl(item.url)} alt="" className="max-h-72 w-full rounded-xl object-cover" />
              ),
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 p-3">
        {/* Post Reaction Button with Hover Picker */}
        <div
          className="relative inline-flex items-center"
          onMouseEnter={handleReactionMouseEnter}
          onMouseLeave={handleReactionMouseLeave}
        >
          <ReactionPicker
            isOpen={showReactionPicker}
            onSelect={(type) => void react(type)}
            onMouseEnter={handleReactionMouseEnter}
            onMouseLeave={handleReactionMouseLeave}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void react()}
            className={cn(
              'text-zinc-500 hover:text-white transition gap-1.5',
              summary?.currentUserReaction && 'text-white font-medium'
            )}
          >
            {(() => {
              const current = REACTION_CONFIG.find((r) => r.type === summary?.currentUserReaction)
              if (current) {
                return (
                  <>
                    <span className="text-base leading-none">{current.emoji}</span>
                    <span className={cn('text-xs', current.color)}>{current.label}</span>
                  </>
                )
              }
              return (
                <>
                  <Heart className="size-4" fill="none" />
                  <span className="text-xs">Thích</span>
                </>
              )
            })()}
          </Button>
        </div>

        {/* Reaction Breakdown Badge showing active emojis and counts */}
        <ReactionBreakdownBadge summary={summary} />

        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-zinc-500 hover:text-white">
          <MessageCircle data-icon="inline-start" />
          {comments.length}
        </Button>
        <label className="cursor-pointer text-zinc-500 hover:text-white" title="Upload media">
          <ImageIcon className="size-4" />
          <input
            type="file"
            accept="image/*,video/mp4,video/webm"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void upload(file)
            }}
          />
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => void save()}
          className={cn('ml-auto text-zinc-500 hover:text-white', saved && 'text-white')}
        >
          <Bookmark fill={saved ? 'currentColor' : 'none'} />
        </Button>
      </div>

      {showComments && (
        <div className="border-t border-white/[0.08] p-4">
          <div className="space-y-3">
            {comments.map((item) => (
              <CommentRow
                key={item.id}
                comment={item}
                postId={post.id}
                onCommentsChanged={reloadComments}
              />
            ))}
          </div>
          <form onSubmit={addComment} className="mt-3 flex gap-2">
            <Input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment..."
              className="border-white/10 bg-white/[0.04] text-white"
              disabled={isSubmittingComment}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmittingComment || !comment.trim()}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {isSubmittingComment ? 'Sending...' : 'Send'}
            </Button>
          </form>
          {commentError && (
            <p className="mt-2 text-xs text-rose-400">{commentError}</p>
          )}
        </div>
      )}
    </article>
  )
}

function CommentRow({
  comment,
  postId,
  onCommentsChanged,
  level = 0,
}: {
  comment: Comment
  postId: string
  onCommentsChanged: () => void | Promise<void>
  level?: number
}) {
  const { profile } = useAppStore()
  const [reaction, setReaction] = useState<ReactionSummary | null>(null)

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Reply state
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Ownership check
  const isOwner = Boolean(
    profile?.userId &&
    comment.authorId &&
    profile.userId.toLowerCase() === comment.authorId.toLowerCase()
  )

  useEffect(() => {
    let isMounted = true
    apiFetch(`/api/comments/${comment.id}/reaction`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setReaction(data)
      })
      .catch(() => undefined)
    return () => {
      isMounted = false
    }
  }, [comment.id])

  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  function handleReactionMouseEnter() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    // Hover 1 second to show reactions
    if (!showReactionPicker && !hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(() => {
        setShowReactionPicker(true)
        hoverTimerRef.current = null
      }, 1000)
    }
  }

  function handleReactionMouseLeave() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    closeTimerRef.current = setTimeout(() => {
      setShowReactionPicker(false)
      closeTimerRef.current = null
    }, 400)
  }

  async function toggle(selectedType?: string) {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setShowReactionPicker(false)

    const prevReaction = reaction
    const currentReaction = reaction?.currentUserReaction
    const targetType = selectedType || (currentReaction ? null : 'LOVE')
    const isRemoving = currentReaction && (targetType === null || targetType === currentReaction)

    setReaction((prev) => {
      const counts = { ...(prev?.counts ?? {}) }
      let total = prev?.totalCount ?? 0

      if (currentReaction && counts[currentReaction]) {
        counts[currentReaction] = Math.max(0, counts[currentReaction] - 1)
        total = Math.max(0, total - 1)
      }

      if (!isRemoving && targetType) {
        counts[targetType] = (counts[targetType] ?? 0) + 1
        total += 1
      }

      return {
        ...prev,
        currentUserReaction: isRemoving ? null : targetType,
        totalCount: total,
        counts,
      }
    })

    try {
      const response = await apiFetch(`/api/comments/${comment.id}/reaction`, {
        method: isRemoving ? 'DELETE' : 'PUT',
        body: isRemoving ? undefined : JSON.stringify({ type: targetType }),
      })
      setReaction(await response.json())
    } catch {
      setReaction(prevReaction)
    }
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!editContent.trim() || isSavingEdit) return
    setIsSavingEdit(true)
    setErrorMsg('')
    try {
      await apiFetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent.trim() }),
      })
      setIsEditing(false)
      await onCommentsChanged()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu chỉnh sửa.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return
    try {
      await apiFetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      })
      await onCommentsChanged()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể xóa bình luận.')
    }
  }

  async function handleSendReply(e: FormEvent) {
    e.preventDefault()
    if (!replyContent.trim() || isSendingReply) return
    setIsSendingReply(true)
    setErrorMsg('')
    try {
      await apiFetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyContent.trim(),
          parentCommentId: comment.id,
        }),
      })
      setReplyContent('')
      setIsReplying(false)
      await onCommentsChanged()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể gửi câu trả lời.')
    } finally {
      setIsSendingReply(false)
    }
  }

  const authorName = comment.authorDisplayName || comment.authorUsername || 'Người dùng'

  return (
    <div className={cn('space-y-2', level > 0 && 'mt-2 border-l border-white/10 pl-3 sm:pl-4')}>
      <div className="flex gap-2.5 rounded-xl bg-white/[0.03] p-3 text-sm text-zinc-300">
        <Avatar className="size-7 shrink-0 mt-0.5">
          {comment.authorAvatarUrl && <AvatarImage src={getAssetUrl(comment.authorAvatarUrl)} alt="" />}
          <AvatarFallback className="bg-zinc-800 text-[10px]">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-200">{authorName}</span>
              {comment.createdAt && (
                <span className="text-[10px] text-zinc-500">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {isOwner && !isEditing && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditContent(comment.content)
                    setIsEditing(true)
                    setIsReplying(false)
                  }}
                  className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 transition"
                  title="Chỉnh sửa bình luận"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  className="rounded p-1 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                  title="Xóa bình luận"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="mt-2 space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="h-8 border-white/15 bg-white/[0.06] text-xs text-white"
                autoFocus
                disabled={isSavingEdit}
              />
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-6 px-2 text-[11px] text-zinc-400 hover:text-white"
                >
                  <X className="mr-1 size-3" /> Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingEdit || !editContent.trim()}
                  className="h-6 bg-white px-2 text-[11px] text-black hover:bg-zinc-200"
                >
                  <Check className="mr-1 size-3" /> {isSavingEdit ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          ) : (
            <p className="mt-1 text-sm text-zinc-200 whitespace-pre-wrap">{comment.content}</p>
          )}

          {errorMsg && <p className="mt-1 text-xs text-rose-400">{errorMsg}</p>}

          <div className="mt-2 flex items-center gap-3">
            {/* Comment Reaction with Hover Picker */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={handleReactionMouseEnter}
              onMouseLeave={handleReactionMouseLeave}
            >
              <ReactionPicker
                isOpen={showReactionPicker}
                onSelect={(type) => void toggle(type)}
                onMouseEnter={handleReactionMouseEnter}
                onMouseLeave={handleReactionMouseLeave}
              />
              <button
                type="button"
                onClick={() => void toggle()}
                className={cn(
                  'flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition',
                  reaction?.currentUserReaction && 'text-white font-medium'
                )}
              >
                {(() => {
                  const current = REACTION_CONFIG.find((r) => r.type === reaction?.currentUserReaction)
                  if (current) {
                    return (
                      <>
                        <span className="text-sm leading-none">{current.emoji}</span>
                        <span className={cn('text-[11px]', current.color)}>{current.label}</span>
                      </>
                    )
                  }
                  return (
                    <>
                      <Heart className="size-3" fill="none" />
                      <span>Thích</span>
                    </>
                  )
                })()}
              </button>
            </div>

            {/* Comment Reaction Breakdown Badge */}
            <ReactionBreakdownBadge summary={reaction} />

            <button
              onClick={() => {
                setIsReplying(!isReplying)
                if (isEditing) setIsEditing(false)
              }}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition"
            >
              <Reply className="size-3" />
              <span>Trả lời</span>
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <span className="text-xs text-zinc-500">{comment.replies.length} phản hồi</span>
            )}
          </div>

          {isReplying && (
            <form onSubmit={handleSendReply} className="mt-2 flex gap-1.5">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Trả lời @${authorName}...`}
                className="h-7 border-white/10 bg-white/[0.04] text-xs text-white"
                autoFocus
                disabled={isSendingReply}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isSendingReply || !replyContent.trim()}
                className="h-7 bg-white px-2.5 text-xs text-black hover:bg-zinc-200"
              >
                {isSendingReply ? 'Gửi...' : 'Gửi'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReplying(false)
                  setReplyContent('')
                }}
                className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
              >
                Hủy
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentsChanged={onCommentsChanged}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
