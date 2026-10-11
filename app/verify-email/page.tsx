'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('email') ?? '',
  )
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/auth/email-verification/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        },
      )
      const body = (await response.json().catch(() => ({}))) as { message?: string }
      if (!response.ok) {
        throw new Error(body.message ?? 'Mã xác nhận không đúng hoặc đã hết hạn.')
      }

      setMessage('Xác nhận email thành công. Đang chuyển đến trang đăng nhập...')
      window.setTimeout(() => {
        window.location.href = '/login'
      }, 1200)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể xác nhận email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f3f1] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Xác nhận email</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Nhập mã 6 chữ số đã được gửi đến email của bạn để hoàn tất đăng ký.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="verification-email" className="text-sm font-medium text-zinc-700">Email</label>
            <Input
              id="verification-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium text-zinc-700">Mã xác nhận</label>
            <Input
              id="verification-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
              placeholder="123456"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="h-12 w-full bg-zinc-900 text-white hover:bg-zinc-800">
            {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận email'}
          </Button>
          {message && <p className="text-sm text-emerald-600" role="status">{message}</p>}
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </form>
        <Link className="mt-6 inline-block text-sm font-medium text-zinc-900 underline" href="/login">
          Quay lại đăng nhập
        </Link>
      </div>
    </main>
  )
}
