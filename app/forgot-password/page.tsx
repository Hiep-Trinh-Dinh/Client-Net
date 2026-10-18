'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { apiBaseUrl } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [devResetToken, setDevResetToken] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')
    setDevResetToken(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const body = (await response.json().catch(() => ({}))) as { message?: string; actionToken?: string }

      if (!response.ok) {
        throw new Error(body.message ?? 'Không thể gửi yêu cầu đặt lại mật khẩu.')
      }

      setMessage(body.message ?? 'Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.')
      if (body.actionToken) {
        setDevResetToken(body.actionToken)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f3f1] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Nhập email đăng ký của bạn. Chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
              Email
            </label>
            <input
              className="mt-1 h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-900 outline-none focus:border-zinc-900"
              id="email"
              type="email"
              required
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="h-12 w-full rounded-xl bg-zinc-900 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>

        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p>{message}</p>
            {devResetToken && (
              <div className="mt-2 pt-2 border-t border-emerald-200 text-xs">
                <span className="font-semibold">[Development Mode]: </span>
                <Link
                  href={`/reset-password?token=${encodeURIComponent(devResetToken)}`}
                  className="underline font-mono text-emerald-900 hover:text-black break-all"
                >
                  Bấm vào đây để đặt lại mật khẩu ngay
                </Link>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="font-medium text-zinc-900 underline hover:text-zinc-600">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}
