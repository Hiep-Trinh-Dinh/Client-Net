export type View = 'home' | 'discover' | 'community' | 'friends' | 'profile' | 'settings'

export type Member = {
  name: string
  initials: string
  role: string
  status: string
}

export type Profile = {
  userId: string
  email: string
  username: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  coverUrl: string | null
  dateOfBirth: string | null
  gender?: string | null
  isEmailVerified: boolean
}

export type Post = {
  id: string
  content: string | null
  visibility: string
  createdAt: string
  authorId: string
  authorUsername?: string | null
  authorDisplayName?: string | null
  authorAvatarUrl?: string | null
  communityId: string | null
  status: string
}

export type PostPage = {
  items: Post[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type Comment = {
  id: string
  postId: string
  authorId: string
  parentCommentId: string | null
  content: string
  replies: Comment[]
  authorUsername?: string | null
  authorDisplayName?: string | null
  authorAvatarUrl?: string | null
  createdAt?: string
}

export type ReactionSummary = {
  postId?: string
  commentId?: string
  currentUserReaction: string | null
  counts: Record<string, number>
  totalCount: number
}

export type Media = {
  id: string
  postId: string
  url: string
  mediaType: string
  position: number
}

export type Community = {
  id: string
  ownerId: string
  name: string
  description: string | null
  avatarUrl: string | null
  coverUrl: string | null
  isPublic: boolean
  memberCount: number
  isMember: boolean
  createdAt: string
  updatedAt: string | null
}

export type RoomType = 'TEXT' | 'VOICE'

export type Room = {
  id: string
  communityId: string
  name: string
  description?: string | null
  roomType: RoomType
  isPrivate: boolean
  position: number
  createdAt: string
  updatedAt?: string | null
}

export type Permission = {
  id: string
  code: string
  name: string
  description?: string
  category: 'admin' | 'content' | 'voice'
}

export type CommunityRole = {
  id: string
  communityId: string
  name: string
  priority: number
  isDefault: boolean
  createdAt: string
  permissions: string[] // permission codes
}

export type CommunityMember = {
  communityId: string
  userId: string
  username: string
  displayName?: string | null
  avatarUrl?: string | null
  status: 'online' | 'offline' | 'idle'
  roles: CommunityRole[]
  joinedAt: string
}

export type ConversationType = 'DIRECT' | 'GROUP'

export type Conversation = {
  id: string
  conversationType: ConversationType
  name?: string | null
  avatarUrl?: string | null
  lastMessage?: string | null
  lastMessageAt?: string | null
  unreadCount: number
  participants: {
    userId: string
    username: string
    displayName?: string | null
    avatarUrl?: string | null
    status: 'online' | 'offline' | 'idle'
  }[]
  createdAt: string
  updatedAt: string
}

export type MessageAttachment = {
  id: string
  mediaType: 'image' | 'video' | 'file'
  url: string
  name: string
  sizeBytes?: number
}

export type Message = {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string | null
  content: string
  messageType: 'TEXT' | 'MEDIA' | 'SYSTEM'
  replyToMessage?: {
    id: string
    senderName: string
    content: string
  } | null
  attachments: MessageAttachment[]
  reactions: { reactionType: string; count: number; userReacted: boolean }[]
  readBy: string[] // user IDs
  createdAt: string
  status: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ'
}

export type Call = {
  id: string
  conversationId: string
  callType: 'AUDIO' | 'VIDEO'
  status: 'RINGING' | 'ONGOING' | 'ENDED'
  initiatorName: string
  initiatorAvatar?: string | null
  participants: {
    userId: string
    displayName: string
    avatarUrl?: string | null
    isMuted: boolean
    isVideoOff: boolean
  }[]
}
