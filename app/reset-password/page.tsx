'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ.')
      return
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/auth/password-reset/confirm`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      },
    )
    const body = (await response.json().catch(() => ({}))) as { message?: string }
    if (!response.ok) {
      setError(body.message ?? 'Không thể đặt lại mật khẩu.')
      return
    }
    setMessage('Mật khẩu đã được cập nhật. Bạn có thể đăng nhập lại.')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f3f1] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Reset password</h1>
        <label className="mt-6 block text-sm font-medium text-zinc-700" htmlFor="password">
          Mật khẩu mới
        </label>
        <input
          className="mt-2 h-12 w-full rounded-xl border border-zinc-200 px-4"
          id="password"
          minLength={8}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="mt-5 h-12 w-full rounded-xl bg-zinc-900 font-medium text-white" type="submit">
          Cập nhật mật khẩu
        </button>
        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <Link className="mt-6 block text-center text-sm font-medium underline" href="/login">
          Quay lại đăng nhập
        </Link>
      </form>
    </main>
  )
}
