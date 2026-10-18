import { create } from 'zustand'
import { Profile, View } from '@/types'

interface AppState {
  // Navigation & UI
  view: View
  setView: (view: View) => void
  mobileNav: boolean
  setMobileNav: (open: boolean) => void

  // User Profile
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  
  // Chat Widget State
  chatOpen: boolean
  setChatOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  chatSelected: string
  setChatSelected: (name: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),
  mobileNav: false,
  setMobileNav: (mobileNav) => set({ mobileNav }),

  profile: null,
  setProfile: (profile) => set({ profile }),

  chatOpen: false,
  setChatOpen: (open) =>
    set((state) => ({
      chatOpen: typeof open === 'function' ? open(state.chatOpen) : open,
    })),
  chatSelected: 'Maya Chen',
  setChatSelected: (chatSelected) => set({ chatSelected }),
}))
