'use client'

import { useState } from 'react'
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getAssetUrl, getInitials } from '@/lib/api'
import { Call } from '@/types'
import { useChatStore } from '@/stores/chat-store'

interface CallModalProps {
  call: Call
}

export function CallModal({ call }: CallModalProps) {
  const { setActiveCall } = useChatStore()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const handleEndCall = () => {
    setActiveCall(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex h-[520px] w-full max-w-2xl flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#121215] p-6 shadow-2xl relative">
        {/* Call Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-semibold text-white">
                Cuộc gọi {call.callType === 'VIDEO' ? 'Video' : 'Thoại'} trực tiếp
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Với {call.initiatorName}</p>
          </div>

          <div className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
            03:25
          </div>
        </div>

        {/* Video / Avatar Grid */}
        <div className="my-auto grid grid-cols-2 gap-4 h-[300px]">
          {/* Initiator Stage */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#18181d] overflow-hidden">
            {call.callType === 'VIDEO' && !isVideoOff ? (
              <div className="size-full bg-zinc-900 grid place-items-center relative">
                <Avatar className="size-20">
                  {call.initiatorAvatar && <AvatarImage src={getAssetUrl(call.initiatorAvatar)} />}
                  <AvatarFallback className="bg-zinc-800 text-lg font-bold">
                    {getInitials(call.initiatorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur-xs">
                  {call.initiatorName}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Avatar className="size-20 border-2 border-emerald-400/40">
                  {call.initiatorAvatar && <AvatarImage src={getAssetUrl(call.initiatorAvatar)} />}
                  <AvatarFallback className="bg-zinc-800 text-lg font-bold">
                    {getInitials(call.initiatorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-white">{call.initiatorName}</span>
              </div>
            )}
          </div>

          {/* Current User Stage */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#18181d] overflow-hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="size-20 border-2 border-white/10">
                  <AvatarFallback className="bg-zinc-800 text-lg font-bold">ME</AvatarFallback>
                </Avatar>
                {isMuted && (
                  <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-rose-500 text-white">
                    <MicOff className="size-3.5" />
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-white">Bạn (Tôi)</span>
            </div>
            <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-zinc-300 backdrop-blur-xs">
              Micro: {isMuted ? 'Tắt' : 'Bật'}
            </span>
          </div>
        </div>

        {/* Controls Dock */}
        <div className="flex items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#18181d]/80 backdrop-blur-md p-3 mx-auto w-fit">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`rounded-full size-11 transition ${
              isMuted ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </Button>

          {call.callType === 'VIDEO' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`rounded-full size-11 transition ${
                isVideoOff ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isVideoOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
            </Button>
          )}

          <Button
            onClick={handleEndCall}
            className="rounded-full size-11 bg-rose-500 hover:bg-rose-600 text-white p-0 grid place-items-center shadow-lg transition hover:scale-105"
            title="Kết thúc cuộc gọi"
          >
            <PhoneOff className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
