import { Link, Navigate, useNavigate } from 'react-router-dom'

import { games, getGame } from './games.js'
import './game-page.css'

export default function GamePage({ slug }) {
  const navigate = useNavigate()
  const game = getGame(slug)

  if (!game) return <Navigate to="/games" replace />

  const gameIndex = games.indexOf(game)
  const nextGame = games[gameIndex + 1]

  function continueToNextPage() {
    navigate(nextGame ? `/games/${nextGame.slug}` : '/games')
  }

  return (
    <main className={`game-page game-theme-${game.theme}`}>
      <GameHeader />

      <article className="game-content">
        <header className="game-introduction">
          <p className="game-eyebrow">
            Game {String(gameIndex + 1).padStart(2, '0')} of{' '}
            {String(games.length).padStart(2, '0')}
          </p>
          <h1>{game.title}</h1>
          <p className="game-tagline">{game.tagline}</p>
          <p className="game-description">{game.description}</p>
        </header>

        <dl className="game-facts">
          <Fact label="Genre" value={game.genre} />
          <Fact label="Players" value={game.players} />
          <Fact label="Platform" value={game.platform} />
          <Fact label="Release" value={game.release} />
        </dl>

        <section className="game-section" aria-labelledby="features-heading">
          <h2 id="features-heading">How it plays</h2>
          <div className="game-feature-list">
            {game.features.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="game-section" aria-labelledby="updates-heading">
          <h2 id="updates-heading">Latest updates</h2>
          <div className="game-update-list">
            {game.updates.map(([date, title, description]) => (
              <article key={title}>
                <time>{date}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <nav className="game-page-navigation" aria-label="Continue browsing games">
          <Link to="/games">Back to all games</Link>
          <button type="button" value="" onClick={continueToNextPage}>
            {nextGame ? `Next: ${nextGame.title}` : 'Back to all games'}
          </button>
        </nav>
      </article>
    </main>
  )
}

export function GameHeader() {
  return (
    <header className="game-header">
      <Link className="game-brand" to="../">
        Video Forge Studios
      </Link>
      <nav aria-label="Game pages">
        <Link to="/games">All games</Link>
        {games.map((game) => (
          <Link key={game.slug} to={`/games/${game.slug}`}>
            {game.title}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
