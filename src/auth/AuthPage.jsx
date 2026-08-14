import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import useAuth from './useAuth.js'

function AuthPage({ mode }) {
  const isRegistration = mode === 'register'
  const navigate = useNavigate()
  const { isLoading, login, register, user } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [journalist, setJournalist] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="auth-card" aria-live="polite">
          <h1>Checking your session</h1>
          <p>Please wait a moment.</p>
        </section>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isRegistration && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      if (isRegistration) {
        await register({ username, email, password, journalist })
      } else {
        await login({ email, password })
      }

      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p className="auth-eyebrow">Video Forge Studios</p>
          <h1>{isRegistration ? 'Create your account' : 'Welcome back'}</h1>
          <p>
            {isRegistration
              ? 'Register to create and manage your profile.'
              : 'Sign in with the email attached to your account.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistration && (
            <label className="auth-field">
              <span>Username</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                maxLength="100"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength="254"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete={isRegistration ? 'new-password' : 'current-password'}
              minLength="8"
              maxLength="128"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {isRegistration && (
            <>
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength="8"
                  maxLength="128"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>

              <label className="auth-checkbox">
                <input
                  name="journalist"
                  type="checkbox"
                  checked={journalist}
                  onChange={(event) => setJournalist(event.target.checked)}
                />
                <span>Register as a journalist</span>
              </label>
            </>
          )}

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : isRegistration
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistration ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegistration ? '/login' : '/register'}>
            {isRegistration ? 'Sign in' : 'Register'}
          </Link>
        </p>
      </section>
    </main>
  )
}

export default AuthPage
