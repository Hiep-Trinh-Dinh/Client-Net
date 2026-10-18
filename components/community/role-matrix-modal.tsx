'use client'

import { useState } from 'react'
import { Plus, Shield, Trash2, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommunityRole, Permission } from '@/types'

const SYSTEM_PERMISSIONS: Permission[] = [
  // Admin permissions
  { id: 'p1', code: 'MANAGE_COMMUNITY', name: 'Quản lý cộng đồng', description: 'Thay đổi tên, avatar, banner và cài đặt chung', category: 'admin' },
  { id: 'p2', code: 'MANAGE_ROLES', name: 'Quản lý vai trò & quyền', description: 'Tạo vai trò mới và phân quyền', category: 'admin' },
  { id: 'p3', code: 'MANAGE_CHANNELS', name: 'Quản lý kênh / phòng', description: 'Tạo, sửa, xóa các kênh chat và kênh voice', category: 'admin' },
  { id: 'p4', code: 'KICK_MEMBERS', name: 'Trục xuất thành viên', description: 'Kick các thành viên vi phạm khỏi cộng đồng', category: 'admin' },

  // Content permissions
  { id: 'p5', code: 'SEND_MESSAGES', name: 'Gửi tin nhắn', description: 'Chat trong các kênh văn bản công khai', category: 'content' },
  { id: 'p6', code: 'ATTACH_FILES', name: 'Đính kèm tệp & ảnh', description: 'Tải lên hình ảnh, video và tài liệu', category: 'content' },
  { id: 'p7', code: 'DELETE_MESSAGES', name: 'Xóa tin nhắn của người khác', description: 'Quyền kiểm duyệt nội dung tin nhắn', category: 'content' },
  { id: 'p8', code: 'CREATE_POSTS', name: 'Đăng bài viết cộng đồng', description: 'Đăng bài lên feed thảo luận của cộng đồng', category: 'content' },

  // Voice permissions
  { id: 'p9', code: 'CONNECT_VOICE', name: 'Tham gia kênh thoại', description: 'Kết nối vào phòng voice và nghe', category: 'voice' },
  { id: 'p10', code: 'SPEAK_VOICE', name: 'Nói trong kênh thoại', description: 'Bật micro và phát biểu', category: 'voice' },
  { id: 'p11', code: 'MUTE_MEMBERS', name: 'Tắt mic thành viên khác', description: 'Quyền điều phối âm thanh trong phòng thoại', category: 'voice' },
]

interface RoleMatrixModalProps {
  roles: CommunityRole[]
  onSaveRoles: (roles: CommunityRole[]) => void
  onClose: () => void
}

export function RoleMatrixModal({ roles: initialRoles, onSaveRoles, onClose }: RoleMatrixModalProps) {
  const [roles, setRoles] = useState<CommunityRole[]>(initialRoles)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id ?? '')
  const [newRoleName, setNewRoleName] = useState('')

  const activeRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0]

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName.trim()) return

    const newRole: CommunityRole = {
      id: `role-${Date.now()}`,
      communityId: activeRole?.communityId ?? 'c1',
      name: newRoleName.trim(),
      priority: roles.length + 1,
      isDefault: false,
      createdAt: new Date().toISOString(),
      permissions: ['SEND_MESSAGES', 'CONNECT_VOICE', 'SPEAK_VOICE'],
    }

    setRoles([...roles, newRole])
    setSelectedRoleId(newRole.id)
    setNewRoleName('')
  }

  const handleDeleteRole = (id: string) => {
    if (roles.length <= 1) return
    const updated = roles.filter((r) => r.id !== id)
    setRoles(updated)
    setSelectedRoleId(updated[0]?.id ?? '')
  }

  const togglePermission = (permCode: string) => {
    if (!activeRole) return
    const hasPerm = activeRole.permissions.includes(permCode)
    const updatedPerms = hasPerm
      ? activeRole.permissions.filter((p) => p !== permCode)
      : [...activeRole.permissions, permCode]

    setRoles(roles.map((r) => (r.id === activeRole.id ? { ...r, permissions: updatedPerms } : r)))
  }

  const handleSave = () => {
    onSaveRoles(roles)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex h-[560px] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-2xl">
        {/* Roles List Sidebar */}
        <div className="w-64 border-r border-white/10 bg-[#101012] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="size-4 text-white" />
              <h3 className="text-sm font-semibold text-white">Vai trò cộng đồng</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">Quản lý chức vụ và cấp phát quyền hạn.</p>

            <form onSubmit={handleCreateRole} className="flex gap-1.5 mb-4">
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Tên vai trò mới"
                className="h-8 border-white/10 bg-white/[0.04] text-xs text-white"
              />
              <Button type="submit" size="sm" className="h-8 bg-white text-black px-2.5">
                <Plus className="size-3.5" />
              </Button>
            </form>

            <div className="space-y-1 overflow-y-auto max-h-[320px]">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    selectedRoleId === role.id
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{role.name}</span>
                  {role.isDefault && (
                    <Badge variant="outline" className="text-[9px] border-white/20 text-zinc-400 px-1 py-0">
                      Mặc định
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeRole && !activeRole.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteRole(activeRole.id)}
              className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs"
            >
              <Trash2 className="size-3.5 mr-1" /> Xóa vai trò này
            </Button>
          )}
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 flex flex-col bg-[#141416]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-white">{activeRole?.name}</h4>
                <Badge className="bg-white/10 text-zinc-300 text-[10px]">
                  {activeRole?.permissions.length} quyền được cấp
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Bật/tắt các quyền được phép thực thi trong cộng đồng</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 text-zinc-300">
                Hủy
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-white text-black hover:bg-zinc-200">
                <UserCheck className="size-3.5 mr-1" /> Lưu thay đổi
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {['admin', 'content', 'voice'].map((category) => {
              const perms = SYSTEM_PERMISSIONS.filter((p) => p.category === category)
              const catTitle =
                category === 'admin'
                  ? 'Quyền Quản trị viên'
                  : category === 'content'
                  ? 'Quyền Nội dung & Chat'
                  : 'Quyền Kênh thoại (Voice)'

              return (
                <div key={category} className="space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-1">
                    {catTitle}
                  </h5>
                  <div className="grid gap-2">
                    {perms.map((p) => {
                      const enabled = activeRole?.permissions.includes(p.code)
                      return (
                        <div
                          key={p.code}
                          onClick={() => togglePermission(p.code)}
                          className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition"
                        >
                          <div>
                            <p className="text-xs font-medium text-white">{p.name}</p>
                            <p className="text-[11px] text-zinc-500">{p.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => togglePermission(p.code)}
                            className="size-4 rounded accent-white cursor-pointer"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
