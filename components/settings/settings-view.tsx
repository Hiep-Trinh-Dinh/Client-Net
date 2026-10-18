'use client'

import { ChevronRight, Settings, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function SettingsView() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Workspace</p>
      <h1 className="text-3xl font-semibold tracking-tight">Community settings</h1>
      <p className="mt-2 text-sm text-zinc-500">Manage your community, roles, and permissions.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[190px_1fr]">
        <div className="flex gap-1 overflow-x-auto lg:flex-col">
          <button className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-black">
            Overview
          </button>
          <button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">
            Roles & permissions
          </button>
          <button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">
            Members
          </button>
          <button className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/[0.06] hover:text-white">
            Integrations
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="flex items-center gap-3">
              <Shield className="text-zinc-400" />
              <div>
                <h2 className="font-semibold">Roles & permissions</h2>
                <p className="mt-1 text-sm text-zinc-600">Control what members can see and do.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {['Founder', 'Moderator', 'Member', 'Guest'].map((r, i) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  key={r}
                >
                  <span className="size-2 rounded-full bg-white" />
                  <span className="text-sm">{r}</span>
                  <span className="ml-auto text-xs text-zinc-600">
                    {i === 0 ? 'All permissions' : i === 1 ? '12 permissions' : '4 permissions'}
                  </span>
                  <ChevronRight className="text-zinc-600" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#141414] p-5">
            <div className="flex items-center gap-3">
              <Settings className="text-zinc-400" />
              <div>
                <h2 className="font-semibold">Community profile</h2>
                <p className="mt-1 text-sm text-zinc-600">How your community appears across Orbit.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <label className="text-sm text-zinc-400">
                Community name
                <Input defaultValue="Launch Club" className="mt-2 border-white/[0.08] bg-white/[0.03] text-white" />
              </label>
              <label className="text-sm text-zinc-400">
                Description
                <Textarea
                  defaultValue="A focused space for founders, builders, and people shipping useful things."
                  className="mt-2 border-white/[0.08] bg-white/[0.03] text-white"
                />
              </label>
              <Button className="w-fit bg-white text-black hover:bg-zinc-200">Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
