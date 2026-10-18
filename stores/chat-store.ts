import { create } from 'zustand'
import { Call, Conversation, Message } from '@/types'

interface ChatState {
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void

  activeConversationId: string | null
  setActiveConversationId: (id: string | null) => void

  messages: Record<string, Message[]>
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void

  activeCall: Call | null
  setActiveCall: (call: Call | null) => void

  chatWidgetExpanded: boolean
  setChatWidgetExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [
    {
      id: 'conv-1',
      conversationType: 'DIRECT',
      name: 'Maya Chen',
      unreadCount: 1,
      lastMessage: 'Bạn có thể xem qua bản thiết kế mới không?',
      lastMessageAt: '10:45 AM',
      participants: [
        { userId: 'u-maya', username: 'mayachen', displayName: 'Maya Chen', status: 'online' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'conv-2',
      conversationType: 'DIRECT',
      name: 'Ravi Patel',
      unreadCount: 0,
      lastMessage: 'Đã gửi ghi chú vào tài liệu chung.',
      lastMessageAt: 'Hôm qua',
      participants: [
        { userId: 'u-ravi', username: 'ravipatel', displayName: 'Ravi Patel', status: 'online' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'conv-3',
      conversationType: 'GROUP',
      name: 'Đội ngũ Cốt lõi (Core Team)',
      unreadCount: 3,
      lastMessage: 'Jordan: Buổi sync lúc 3h chiều nay nhé mọi người.',
      lastMessageAt: '09:12 AM',
      participants: [
        { userId: 'u-maya', username: 'mayachen', displayName: 'Maya Chen', status: 'online' },
        { userId: 'u-jordan', username: 'jordanlee', displayName: 'Jordan Lee', status: 'idle' },
        { userId: 'u-alex', username: 'alexr', displayName: 'Alex Rivera', status: 'offline' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  setConversations: (conversations) => set({ conversations }),

  activeConversationId: 'conv-1',
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),

  messages: {
    'conv-1': [
      {
        id: 'm1',
        conversationId: 'conv-1',
        senderId: 'u-maya',
        senderName: 'Maya Chen',
        content: 'Chào bạn! Mình vừa hoàn thành xong mockup mới cho giao diện Chat.',
        messageType: 'TEXT',
        attachments: [],
        reactions: [{ reactionType: '❤️', count: 2, userReacted: true }],
        readBy: ['me'],
        createdAt: '10:40 AM',
        status: 'READ',
      },
      {
        id: 'm2',
        conversationId: 'conv-1',
        senderId: 'me',
        senderName: 'Tôi',
        content: 'Tuyệt vời quá! Trông rất gọn gàng và hiện đại.',
        messageType: 'TEXT',
        attachments: [],
        reactions: [{ reactionType: '👍', count: 1, userReacted: false }],
        readBy: ['u-maya'],
        createdAt: '10:42 AM',
        status: 'READ',
      },
      {
        id: 'm3',
        conversationId: 'conv-1',
        senderId: 'u-maya',
        senderName: 'Maya Chen',
        content: 'Bạn có thể xem qua bản thiết kế mới không?',
        messageType: 'TEXT',
        attachments: [],
        reactions: [],
        readBy: [],
        createdAt: '10:45 AM',
        status: 'DELIVERED',
      },
    ],
  },
  setMessages: (conversationId, newMessages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: newMessages },
    })),
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] ?? []), message],
      },
    })),

  activeCall: null,
  setActiveCall: (activeCall) => set({ activeCall }),

  chatWidgetExpanded: false,
  setChatWidgetExpanded: (expanded) =>
    set((state) => ({
      chatWidgetExpanded:
        typeof expanded === 'function' ? expanded(state.chatWidgetExpanded) : expanded,
    })),
}))
