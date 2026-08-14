import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wishlist_purchase.css'

const games = [
  {
    slug: 'lanyards-attack',
    title: 'Lanyards Attack',
    status: 'In development',
    platform: 'Steam',
    release: 'To be announced',
  },
  {
    slug: 'signal-lost',
    title: 'Signal Lost',
    status: 'Out now',
    platform: 'Steam',
    release: 'Available today',
  },
  {
    slug: 'ashfall-protocol',
    title: 'Ashfall Protocol',
    status: 'Available now',
    platform: 'Steam',
    release: 'Released 2024',
  },
]

export default function WishlistPurchase() {
  const [wishlisted, setWishlisted] = useState(new Set())

  // A new Set every time — mutating the existing one keeps the same reference
  // and React skips the re-render.
  function toggleWishlist(slug) {
    setWishlisted((current) => {
      const next = new Set(current)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  return (
    <>
      <main className="store-page">
        <div className="store-split">
          <section className="store-lede">
            <p className="eyebrow">Video Forge Studios</p>

            <h1 className="store-title">Welcome</h1>

            <p className="store-description">
              Click any game to add it to your wishlist. Wishlisting tells us
              how many people are waiting, and it is how you hear first when a
              store page goes live.
            </p>

            <p className="store-count">
              {wishlisted.size === 0
                ? 'Nothing wishlisted yet'
                : `${wishlisted.size} of ${games.length} wishlisted`}
            </p>
          </section>

          <div className="store-game-list">
            {games.map((game) => {
              const isOn = wishlisted.has(game.slug)

              return (
                <button
                  key={game.slug}
                  type="button"
                  className={`store-facts store-facts-toggle${isOn ? ' is-wishlisted' : ''}`}
                  onClick={() => toggleWishlist(game.slug)}
                  aria-pressed={isOn}
                >
                  <span className="store-facts-head">
                    <span className="store-facts-title">{game.title}</span>
                    <span className="store-wish-flag">
                      {isOn ? '★ Wishlisted' : '☆ Wishlist'}
                    </span>
                  </span>

                  <dl className="store-fact-list">
                    <div className="store-fact">
                      <dt>Status</dt>
                      <dd>
                        <span className="store-dot" aria-hidden="true"></span>
                        {game.status}
                      </dd>
                    </div>

                    <div className="store-fact">
                      <dt>Platform</dt>
                      <dd>{game.platform}</dd>
                    </div>

                    <div className="store-fact">
                      <dt>Release</dt>
                      <dd>{game.release}</dd>
                    </div>
                  </dl>
                </button>
              )
            })}
          </div>
        </div>

        <div className="store-browse">
          <Link to="/games" className="store-button store-button-primary">
            Browse Our Games
          </Link>
        </div>
      </main>
    </>
  )
}