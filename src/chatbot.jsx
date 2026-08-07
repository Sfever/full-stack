import { useState } from 'react'

const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

const gameContext = `
Video Forge Studios is a small independent game studio based in Texas.
It was founded by four friends who met at iD Tech.
The studio has two completed games on Steam, but their names and details have not been provided yet.
Its third game, Lanyards Attack, is a science-fiction survival game currently in development.
`.trim()

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
        body: JSON.stringify({ message, history, context: gameContext }),
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
    <main>
      <h2>Chatbot</h2>

      <section aria-live="polite">
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`}>
            <strong>{message.role === 'user' ? 'You' : 'Chatbot'}:</strong>{' '}
            {message.content}
          </p>
        ))}
        {isLoading && <p>Chatbot is thinking...</p>}
      </section>

      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-message">Message</label>
        <input
          id="chat-message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
    </main>
  )
}
export default Chatbot
