'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { apiBaseUrl, getAssetUrl, getInitials } from '@/lib/api'
import { Profile } from '@/types'
import { useAppStore } from '@/stores/app-store'

export function ProfileView() {
  const { profile, setProfile, setView } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatarUrl: '',
    coverUrl: '',
    dateOfBirth: '',
    gender: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username,
        displayName: profile.displayName ?? '',
        bio: profile.bio ?? '',
        avatarUrl: profile.avatarUrl ?? '',
        coverUrl: profile.coverUrl ?? '',
        dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
        gender: profile.gender ?? '',
      })
      setAvatarFile(null)
      setAvatarPreview(null)
      setCoverFile(null)
      setCoverPreview(null)
    }
  }, [profile, editing])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    const token = localStorage.getItem('social_network_access_token')

    try {
      // 1. Upload avatar nếu người dùng có chọn file mới
      let updatedAvatarUrl = form.avatarUrl
      if (avatarFile) {
        const avatarData = new FormData()
        avatarData.append('avatar', avatarFile)
        const avtRes = await fetch(`${apiBaseUrl}/api/profile/avatar`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: avatarData,
        })
        if (!avtRes.ok) {
          throw new Error('Không thể upload avatar.')
        }
        const avtBody = (await avtRes.json()) as Profile
        updatedAvatarUrl = avtBody.avatarUrl ?? updatedAvatarUrl
      }

      // 2. Upload cover nếu người dùng có chọn file mới
      let updatedCoverUrl = form.coverUrl
      if (coverFile) {
        const coverData = new FormData()
        coverData.append('cover', coverFile)
        const covRes = await fetch(`${apiBaseUrl}/api/profile/cover`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: coverData,
        })
        if (!covRes.ok) {
          throw new Error('Không thể upload ảnh bìa.')
        }
        const covBody = (await covRes.json()) as Profile
        updatedCoverUrl = covBody.coverUrl ?? updatedCoverUrl
      }

      // 3. Cập nhật các thông tin văn bản
      const response = await fetch(`${apiBaseUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          avatarUrl: updatedAvatarUrl || null,
          coverUrl: updatedCoverUrl || null,
          dateOfBirth: form.dateOfBirth || null,
        }),
      })

      const body = (await response.json().catch(() => ({}))) as Profile & {
        message?: string
        title?: string
        errors?: Record<string, string[]>
      }

      if (!response.ok) {
        const validationMessage = body?.errors
          ? Object.values(body.errors).flat().join(' ')
          : undefined
        throw new Error(validationMessage ?? body.message ?? body.title ?? 'Không thể cập nhật thông tin.')
      }

      setProfile(body)
      setEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      setCoverFile(null)
      setCoverPreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu thông tin.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 space-y-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414]">
        <div
          className="h-44 bg-gradient-to-br from-zinc-600 via-zinc-900 to-black bg-cover bg-center"
          style={profile.coverUrl ? { backgroundImage: `url(${getAssetUrl(profile.coverUrl)})` } : undefined}
        />
        <div className="relative p-6 pt-0">
          <Avatar className="-mt-12 size-24 border-4 border-[#141414]">
            {profile.avatarUrl && <AvatarImage src={getAssetUrl(profile.avatarUrl)} alt="" />}
            <AvatarFallback className="bg-zinc-800 text-2xl">
              {getInitials(profile.displayName ?? profile.username)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{profile.displayName || profile.username}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                @{profile.username} · {profile.email}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
                {profile.bio || 'Bạn chưa thêm phần giới thiệu.'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="border-white/20 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
            >
              {editing ? 'Cancel' : 'Edit profile'}
            </Button>
          </div>

          {editing && (
            <form onSubmit={saveProfile} className="mt-6 grid gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:grid-cols-2">
              <label className="text-sm text-zinc-400">
                Username
                <Input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400">
                Display name
                <Input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400 sm:col-span-2">
                Bio
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400">
                Avatar file
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setAvatarFile(file)
                      setAvatarPreview(URL.createObjectURL(file))
                    }
                  }}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white file:text-white"
                />
                {avatarPreview && (
                  <p className="mt-1 text-xs text-emerald-400">Đã chọn ảnh mới (sẽ lưu khi bấm Save changes)</p>
                )}
              </label>
              <label className="text-sm text-zinc-400">
                Avatar URL
                <Input
                  type="text"
                  placeholder="https://... hoặc /uploads/avatars/..."
                  value={form.avatarUrl}
                  onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400">
                Cover file
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCoverFile(file)
                      setCoverPreview(URL.createObjectURL(file))
                    }
                  }}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white file:text-white"
                />
                {coverPreview && (
                  <p className="mt-1 text-xs text-emerald-400">Đã chọn ảnh bìa mới (sẽ lưu khi bấm Save changes)</p>
                )}
              </label>
              <label className="text-sm text-zinc-400">
                Cover URL
                <Input
                  type="text"
                  placeholder="https://... hoặc /uploads/covers/..."
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400">
                Date of birth
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <label className="text-sm text-zinc-400">
                Gender
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="mt-2 flex h-9 w-full rounded-md border border-white/[0.08] bg-[#141414] px-3 py-1 text-sm text-white shadow-xs transition-colors outline-none focus:border-white/30"
                >
                  <option value="" className="bg-[#141414] text-zinc-400">Chọn giới tính</option>
                  <option value="male" className="bg-[#141414] text-white">Nam</option>
                  <option value="female" className="bg-[#141414] text-white">Nữ</option>
                  <option value="other" className="bg-[#141414] text-white">Khác</option>
                  <option value="private" className="bg-[#141414] text-white">Không công khai</option>
                </select>
              </label>
              <div className="sm:col-span-2">
                {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
                <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-zinc-200">
                  {isSaving ? 'Saving changes...' : 'Save changes'}
                </Button>
              </div>
            </form>

          )}

          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>{profile.isEmailVerified ? 'Email đã xác minh' : 'Email chưa xác minh'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex border-b border-white/[0.08] text-sm">
        <button className="border-b-2 border-white px-1 pb-3 font-medium">Posts</button>
        <button className="px-5 pb-3 text-zinc-600">Communities</button>
        <button className="px-5 pb-3 text-zinc-600">About</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setView('community')}
          className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5 text-left hover:border-white/20"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-white text-xs font-bold text-black">
              LC
            </span>
            <div>
              <p className="text-sm font-semibold">Launch Club</p>
              <p className="text-xs text-zinc-600">Member since 2024</p>
            </div>
            <ChevronRight className="ml-auto text-zinc-600" />
          </div>
        </button>
        <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Account</p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{profile.email}</p>
          <p className="mt-3 text-xs text-zinc-600">Email and username are used for login.</p>
        </div>
      </div>
    </div>
  )
}
