import { useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import AuthPage from './auth/AuthPage.jsx'
import AuthStatus from './auth/AuthStatus.jsx'
import ashfallArt from './assets/ashfall-protocol.png'
import signalLostArt from './assets/signal-lost.png'
import lanyardsArt from './assets/lanyards-attack.png'
import gameQuest from './assets/game-quest.png'
import {
  BlogArticlePage,
  BlogListPage,
  BlogManagePage,
} from './blog/index.js'
import Chatbot from './chatbot'
import GameIndexPage from './game.pages/GameIndexPage.jsx'
import GamePage from './game.pages/GamePage.jsx'
import WishlistPurchase from './wishlistandpurchases/wishlist_purchase.jsx'
import { PressKitManagePage, PressKitPage } from './press-kit/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './auth/auth.css'
import './App.css'

function SiteNavbar({ count = 0 }) {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand href="/">Video Forge Studios</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link href="/games">Games</Nav.Link>
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/press-kit">Press</Nav.Link>
            <Nav.Link href="/chat">Chat</Nav.Link>
          </Nav>

          <Navbar.Text className="me-3" aria-live="polite">
            {count === 0 ? (
              'No wishlist'
            ) : (
              <>
                Wishlist <Badge bg="primary">{count}</Badge>
              </>
            )}
          </Navbar.Text>

          <Navbar.Text>
            <AuthStatus />
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function GameAd({ eyebrow, game, pitch, isWishlisted, onToggle, children }) {
  return (
    <Card className="mb-4">
      <Row className="g-0">
        <Col md={5}>
          <Card.Img
            src={game.art}
            alt=""
            width="480"
            height="270"
            className="img-fluid rounded-start"
          />
        </Col>

        <Col md={7}>
          <Card.Body>
            <Card.Subtitle className="text-muted mb-2">
              {eyebrow}
            </Card.Subtitle>

            <Card.Title as="h2">{game.title}</Card.Title>

            <Badge bg="secondary" className="mb-3">
              {game.status}
            </Badge>

            <Card.Text>{pitch}</Card.Text>

            <Stack direction="horizontal" gap={2}>
              <Button href={`/games/${game.slug}`} variant="primary">
                See {game.title}
              </Button>

              <Button
                variant={isWishlisted ? 'warning' : 'outline-secondary'}
                active={isWishlisted}
                aria-pressed={isWishlisted}
                onClick={onToggle}
              >
                {isWishlisted ? '★ Wishlisted' : '☆ Wishlist'}
              </Button>

              {children}
            </Stack>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  )
}

function Home() {
  const games = [
    {
      slug: 'lanyards-attack',
      title: 'Lanyards Attack',
      status: 'In development',
      art: lanyardsArt,
    },
    {
      slug: 'signal-lost',
      title: 'Signal Lost',
      status: 'Out now',
      art: signalLostArt,
    },
    {
      slug: 'ashfall-protocol',
      title: 'Ashfall Protocol',
      status: 'Available now',
      art: ashfallArt,
    },
  ]

  const featured = games[2]

  function pickRandomSlug(excludeSlug) {
    const pool = games.filter((game) => game.slug !== excludeSlug)
    return pool[Math.floor(Math.random() * pool.length)].slug
  }

  const [wishlisted, setWishlisted] = useState(() => new Set())
  const [spotlightSlug, setSpotlightSlug] = useState(() =>
    pickRandomSlug(featured.slug),
  )

  const spotlight = games.find((game) => game.slug === spotlightSlug)

  function toggleWishlist(slug) {
    setWishlisted((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const count = wishlisted.size

  return (
    <>
      <SiteNavbar count={count} />

      <Container className="py-5" id="main">
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <p className="text-uppercase text-muted small mb-2">
              Independent game studio
            </p>

            <h1 className="display-4 fw-bold">Video Forge Studios</h1>

            <Button href="/games" variant="primary" size="lg" className="mt-3">
              Browse Our Games
            </Button>
          </Col>

          <Col md={6}>
            <Image
              src={gameQuest}
              alt=""
              width="640"
              height="360"
              fluid
              rounded
            />
          </Col>
        </Row>

        <GameAd
          eyebrow="Featured"
          game={featured}
          pitch="Six survivors, one working evacuation route, and ash falling fast enough to bury the map in nine minutes."
          isWishlisted={wishlisted.has(featured.slug)}
          onToggle={() => toggleWishlist(featured.slug)}
        />

        <GameAd
          eyebrow="Random pick"
          game={spotlight}
          pitch="Never played this one? Neither had most people. Take a look."
          isWishlisted={wishlisted.has(spotlight.slug)}
          onToggle={() => toggleWishlist(spotlight.slug)}
        >
          <Button
            variant="outline-primary"
            onClick={() => setSpotlightSlug(pickRandomSlug(spotlightSlug))}
          >
            ↻ Show another
          </Button>
        </GameAd>

        <h2 className="mt-5 mb-1">Our games</h2>

        <p className="text-muted" aria-live="polite">
          {count === 0 ? 'Nothing wishlisted yet' : `${count} wishlisted`}
        </p>

        <Row xs={1} md={3} className="g-4">
          {games.map((game) => {
            const isWishlisted = wishlisted.has(game.slug)

            return (
              <Col key={game.slug}>
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={game.art}
                    alt=""
                    width="320"
                    height="180"
                  />

                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h3" className="h5">
                      {game.title}
                    </Card.Title>

                    <Badge bg="secondary" className="align-self-start mb-3">
                      {game.status}
                    </Badge>

                    <Stack direction="horizontal" gap={2} className="mt-auto">
                      <Button
                        href={`/games/${game.slug}`}
                        variant="link"
                        className="px-0"
                      >
                        View details
                      </Button>

                      <Button
                        variant={isWishlisted ? 'warning' : 'outline-secondary'}
                        size="sm"
                        active={isWishlisted}
                        aria-pressed={isWishlisted}
                        onClick={() => toggleWishlist(game.slug)}
                        className="ms-auto"
                      >
                        {isWishlisted ? '★' : '☆'}
                      </Button>
                    </Stack>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>

      <footer className="bg-dark text-light py-4">
        <Container className="d-flex justify-content-between">
          <small>© 2026 Video Forge Studios</small>

          <small>All rights reserved</small>
        </Container>
      </footer>
    </>
  )
}

function DedicatedGameRoute() {
  const { slug } = useParams()

  return <GamePage slug={slug} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chatbot />} />
      <Route path="/games" element={<GameIndexPage />} />
      <Route path="/games/:slug" element={<DedicatedGameRoute />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/manage" element={<BlogManagePage />} />
      <Route path="/blog/:slug" element={<BlogArticlePage />} />
      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path="/register" element={<AuthPage key="register" mode="register" />} />
      <Route path="/wishlist" element={<WishlistPurchase />} />
      <Route path="/press-kit" element={<PressKitPage />} />
      <Route path="/press-kit/manage" element={<PressKitManagePage />} />
    </Routes>
  )
}

export default App
