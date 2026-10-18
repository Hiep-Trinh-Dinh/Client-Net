import { create } from 'zustand'
import { Community, CommunityMember, CommunityRole, Room } from '@/types'

interface CommunityState {
  activeCommunity: Community | null
  setActiveCommunity: (community: Community | null) => void

  activeRoom: Room | null
  setActiveRoom: (room: Room | null) => void

  rooms: Room[]
  setRooms: (rooms: Room[]) => void

  roles: CommunityRole[]
  setRoles: (roles: CommunityRole[]) => void

  members: CommunityMember[]
  setMembers: (members: CommunityMember[]) => void

  showMemberSidebar: boolean
  setShowMemberSidebar: (show: boolean | ((prev: boolean) => boolean)) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  activeCommunity: null,
  setActiveCommunity: (activeCommunity) => set({ activeCommunity }),

  activeRoom: null,
  setActiveRoom: (activeRoom) => set({ activeRoom }),

  rooms: [],
  setRooms: (rooms) => set({ rooms }),

  roles: [],
  setRoles: (roles) => set({ roles }),

  members: [],
  setMembers: (members) => set({ members }),

  showMemberSidebar: true,
  setShowMemberSidebar: (show) =>
    set((state) => ({
      showMemberSidebar: typeof show === 'function' ? show(state.showMemberSidebar) : show,
    })),
}))
