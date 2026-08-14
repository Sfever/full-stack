import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../auth/useAuth.js'
import { ApiError, apiRequest } from '../lib/api.js'
import PressKitShell from './PressKitShell.jsx'

const questionMaxLength = 2_000
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
})

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : ''
}

function PressKitPage() {
  const { isLoading: isAuthLoading, user } = useAuth()
  const [questions, setQuestions] = useState(null)
  const [publicError, setPublicError] = useState('')
  const [journalistAccess, setJournalistAccess] = useState('idle')
  const [journalistAccessUserId, setJournalistAccessUserId] = useState(null)
  const [submissions, setSubmissions] = useState(null)
  const [question, setQuestion] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function loadPublicQuestions() {
      try {
        const result = await apiRequest('/api/press-kit')

        if (isCurrent) setQuestions(result.questions)
      } catch (requestError) {
        if (isCurrent) setPublicError(requestError.message)
      }
    }

    loadPublicQuestions()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (isAuthLoading) return undefined

    if (!user) return undefined

    let isCurrent = true

    async function loadSubmissions() {
      try {
        const result = await apiRequest('/api/press-kit/mine')

        if (isCurrent) {
          setSubmissions(result.questions)
          setJournalistAccess('granted')
          setJournalistAccessUserId(user.id)
        }
      } catch (requestError) {
        if (!isCurrent) return

        if (requestError instanceof ApiError && requestError.status === 403) {
          setJournalistAccess('denied')
        } else {
          setJournalistAccess('error')
          setSubmissionError(requestError.message)
        }

        setJournalistAccessUserId(user.id)
      }
    }

    loadSubmissions()

    return () => {
      isCurrent = false
    }
  }, [isAuthLoading, user])

  // Correlate each access result with the account that requested it. Without
  // this guard, a newly signed-in user could briefly see the previous user's
  // submission controls while their own /mine request is still pending.
  const currentJournalistAccess = isAuthLoading
    ? 'checking'
    : !user
      ? 'signed-out'
      : journalistAccessUserId === user.id
        ? journalistAccess
        : 'checking'

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmissionError('')
    setSubmissionMessage('')
    setIsSubmitting(true)

    try {
      const result = await apiRequest('/api/press-kit/questions', {
        method: 'POST',
        body: JSON.stringify({ question }),
      })

      setSubmissions((current) => [result.question, ...(current ?? [])])
      setQuestion('')
      setSubmissionMessage('Question submitted for an administrator to answer.')
    } catch (requestError) {
      setSubmissionError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PressKitShell>
      <div className="press-kit-content">
        <section className="press-kit-intro">
          <p className="press-kit-eyebrow">Official studio responses</p>
          <h1>Press Kit</h1>
          <p>
            Journalists can send questions to Video Forge Studios.
            Every administrator answer is published here for everyone to read.
          </p>
        </section>

        <section className="press-kit-section" aria-labelledby="ask-heading">
          <div className="press-kit-section-heading">
            <h2 id="ask-heading">Ask the studio</h2>
            <p>Questions stay private until an administrator publishes an answer.</p>
          </div>

          {currentJournalistAccess === 'checking' && (
            <p>Checking journalist access…</p>
          )}

          {currentJournalistAccess === 'signed-out' && (
            <p>
              <Link to="/login">Sign in</Link> with a journalist account to
              submit a question.
            </p>
          )}

          {currentJournalistAccess === 'denied' && (
            <p>Your account does not have journalist access.</p>
          )}

          {currentJournalistAccess === 'error' && (
            <p className="press-kit-error" role="alert">
              {submissionError}
            </p>
          )}

          {currentJournalistAccess === 'granted' && (
            <form className="press-kit-form" onSubmit={handleSubmit}>
              <label htmlFor="press-kit-question">Question</label>
              <textarea
                id="press-kit-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={questionMaxLength}
                rows="6"
                required
              />
              <div className="press-kit-form-footer">
                <span>
                  {question.length}/{questionMaxLength}
                </span>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting…' : 'Submit question'}
                </button>
              </div>

              {submissionError && (
                <p className="press-kit-error" role="alert">
                  {submissionError}
                </p>
              )}
              {submissionMessage && (
                <p className="press-kit-success" role="status">
                  {submissionMessage}
                </p>
              )}
            </form>
          )}

          {currentJournalistAccess === 'granted' && submissions?.length > 0 && (
            <div className="press-kit-submissions">
              <h3>Your submissions</h3>
              <ul>
                {submissions.map((submission) => (
                  <li key={submission.id}>
                    <span>{submission.question}</span>
                    <small>{submission.status}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="press-kit-section" aria-labelledby="answers-heading">
          <div className="press-kit-section-heading">
            <h2 id="answers-heading">Published Q&amp;A</h2>
            <p>Answers below are official and publicly available.</p>
          </div>

          {publicError && (
            <p className="press-kit-error" role="alert">
              {publicError}
            </p>
          )}

          {!publicError && questions === null && <p>Loading published answers…</p>}

          {questions?.length === 0 && <p>No questions have been answered yet.</p>}

          {questions?.length > 0 && (
            <div className="press-kit-qa-list">
              {questions.map((item) => (
                <article className="press-kit-qa" key={item.id}>
                  <header>
                    <h3>{item.question}</h3>
                    <p>
                      Asked by {item.journalist.username} on{' '}
                      <time dateTime={item.createdAt}>
                        {formatDate(item.createdAt)}
                      </time>
                    </p>
                  </header>
                  <div className="press-kit-answer">
                    <p>{item.answer}</p>
                    <small>
                      Answered by {item.answeredBy.username} on{' '}
                      <time dateTime={item.answeredAt}>
                        {formatDate(item.answeredAt)}
                      </time>
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PressKitShell>
  )
}

export default PressKitPage
