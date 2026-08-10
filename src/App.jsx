import './app.css';

export default function App() {
  return (
    <div className="store-page">
      <div className="store-card">
        <p className="eyebrow">Video Forge Studios</p>
        <h1>Wishlist our upcoming game or visit Steam to purchase our games.</h1>
        <p className="description">
          Lanyards Attack is a chaotic co-op roguelike where your leash is your lifeline.
          Swing, tether, and fling each other through hand-crafted dungeons.
        </p>
        <div className="actions">
          <a
            className="button button-primary"
            href="https://store.steampowered.com/app/XXXXXX"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wishlist Lanyards Attack
          </a>
          <a
            className="button button-secondary"
            href="https://store.steampowered.com/developer/VideoForgeStudios"
            target="_blank"
            rel="noopener noreferrer"
          >
            Purchase on Steam
          </a>
        </div>
      </div>
    </div>
  );
}