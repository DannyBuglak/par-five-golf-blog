import "./HomePage.css";

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Golf Stories Worth Reading</h1>
          <p className="hero__subtitle">
            Course reviews, tournament picks, tips, and everything in between —
            written by golfers for golfers.
          </p>
          <button className="hero__btn">Read the Blog</button>
        </div>
      </section>

      {/* TODO: Update the below, not really a fan of how this looks */}
      <section className="features">
        <div className="features__card">
          <h3>Course Reviews</h3>
          <p>Honest breakdowns of courses from tee to green.</p>
        </div>
        <div className="features__card">
          <h3>Tournament Picks</h3>
          <p>Weekly picks and predictions for tour events.</p>
        </div>
        <div className="features__card">
          <h3>Tips & Thoughts</h3>
          <p>Swing tips, gear thoughts, and everything golf.</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
