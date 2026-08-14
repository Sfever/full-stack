import { useState } from 'react'
import './chatbot.css'

const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const message = input.trim()
    if (!message || isLoading) return

    const history = messages
    setMessages((current) => [...current, { role: 'user', content: message }])
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Chat request failed')
      }

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: result.answer },
      ])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="chat-page">
      <section className="chat-shell" aria-labelledby="chat-title">
        <header className="chat-header">
          <p className="chat-eyebrow">Video Forge Studios Assistant</p>
          <h2 id="chat-title" className="chat-title">
            Chatbot
          </h2>
        </header>

        <section className="chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <article
              className={`chat-message chat-message-${message.role}`}
              key={`${message.role}-${index}`}
            >
              <strong className="chat-message-role">
                {message.role === 'user' ? 'You' : 'Chatbot'}
              </strong>
              <p className="chat-message-content">{message.content}</p>
            </article>
          ))}

          {isLoading && (
            <p className="chat-thinking" role="status">
              Chatbot is thinking...
            </p>
          )}
        </section>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label className="chat-label" htmlFor="chat-message">
            Message
          </label>

          <div className="chat-compose">
            <input
              className="chat-input"
              id="chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />

            <button
              className="chat-send"
              type="submit"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </div>
        </form>

        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}
export default Chatbot
