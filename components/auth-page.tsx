'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type AuthMode = 'login' | 'register'

export function AuthPage({
  mode,
}: {
  mode: AuthMode
}) {
  const isLogin = mode === 'login'
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!isLogin && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'}/api/auth/${isLogin ? 'login' : 'register'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isLogin
              ? { email, password }
              : { email, username, password, displayName },
          ),
        },
      )

      const body = (await response.json()) as {
        accessToken?: string
        refreshToken?: string
        email?: string
        code?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(isLogin ? getLoginErrorMessage(body.code, body.message) : (body.message ?? 'Không thể xác thực tài khoản.'))
      }

      if (!isLogin) {
        window.location.href = `/verify-email?email=${encodeURIComponent(body.email ?? email)}`
        return
      }

      if (!body.accessToken) {
        throw new Error('Không thể xác thực tài khoản.')
      }

      localStorage.setItem('social_network_access_token', body.accessToken)
      if ('refreshToken' in body && typeof body.refreshToken === 'string') {
        localStorage.setItem('social_network_refresh_token', body.refreshToken)
      }
      window.location.href = '/'
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đã xảy ra lỗi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f3f1] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[760px] max-w-6xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(24,24,27,0.08)]">
        <div className="hidden w-[42%] bg-[#121212] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-white text-sm font-bold text-black">
                O
              </div>
              <span className="text-xl font-semibold tracking-tight">orbit</span>
            </div>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-200">
              <Sparkles className="size-3.5" />
              community platform
            </div>

            <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-[-0.06em]">
              {isLogin ? 'Welcome back to your space.' : 'Build your network with intention.'}
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">
              {isLogin
                ? 'Sign in to continue your conversations, saved posts, and community updates.'
                : 'Create your profile and join communities with people who inspire your next move.'}
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Protected access</p>
                <p className="text-xs text-zinc-400">Secure login and verified account updates</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm text-zinc-200">
              <span>Verified account</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                active
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-[58%] lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                  {isLogin ? 'Login' : 'Create account'}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-zinc-900">
                  {isLogin ? 'Sign in to Orbit' : 'Create your account'}
                </h2>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-zinc-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="jane_doe"
                    className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="display-name" className="text-sm font-medium text-zinc-700">
                    Display name
                  </label>
                  <Input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Jane Doe"
                    className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                    Password
                  </label>
                  {isLogin && (
                    <Link href="/forgot-password" className="text-sm text-zinc-600 transition hover:text-zinc-900">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-zinc-700">
                    Confirm password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat your password"
                    className="h-12 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-zinc-900 text-base font-medium text-white shadow-[0_8px_22px_rgba(24,24,27,0.18)] hover:bg-zinc-800"
              >
                {isSubmitting ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
                <ArrowRight className="ml-2 size-4" />
              </Button>
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">or</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Continue with Google
            </Button>

            <p className="mt-7 text-center text-sm text-zinc-600">
              {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
              <Link
                href={isLogin ? '/register' : '/login'}
                className="font-medium text-zinc-900 transition hover:text-zinc-600"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getLoginErrorMessage(code?: string, fallback?: string) {
  switch (code) {
    case 'AUTH_EMAIL_NOT_FOUND':
      return 'Email này chưa được đăng ký.'
    case 'AUTH_PASSWORD_INVALID':
      return 'Mật khẩu không đúng.'
    case 'AUTH_EMAIL_NOT_VERIFIED':
      return 'Email chưa được xác nhận. Vui lòng nhập mã xác nhận đã được gửi đến email của bạn.'
    case 'AUTH_ACCOUNT_INACTIVE':
      return 'Tài khoản đang bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.'
    default:
      return fallback ?? 'Email hoặc mật khẩu không hợp lệ.'
  }
}
