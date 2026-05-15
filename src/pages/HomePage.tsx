import "./HomePage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const photoModules = import.meta.glob(
  "../assets/golfCourses/*.{png,jpg,jpeg,webp}",
  { eager: true },
);
const photos = Object.values(photoModules).map((mod: any) => mod.default);

const CYCLE_INTERVAL = 6000;

function HomePage() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const goTo = (index: number) => {
    setPrev(current);
    setCurrent(index);
  };

  const goPrev = () => goTo(current === 0 ? photos.length - 1 : current - 1);
  const goNext = () => goTo(current === photos.length - 1 ? 0 : current + 1);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(current === photos.length - 1 ? 0 : current + 1);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

  return (
    // TODO: Move these all into features
    <main className="home">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Golf Stories Worth Reading</h1>
          <p className="hero__subtitle">Written by golfers for golfers.</p>
        </div>
      </section>

      <section className="home__body">
        <div className="carousel">
          <div className="carousel__track">
            {photos.map((photo, i) => {
              let className = "carousel__image carousel__image--hidden";
              if (i === current)
                className = "carousel__image carousel__image--active";
              else if (i === prev)
                className = "carousel__image carousel__image--behind";
              return (
                <img
                  key={i}
                  src={photo}
                  alt={`Golf course ${i + 1}`}
                  className={className}
                />
              );
            })}
          </div>
          <div className="carousel__controls">
            <button onClick={goPrev} className="carousel__btn">
              ←
            </button>
            <span className="carousel__dots">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`carousel__dot ${
                    i === current ? "carousel__dot--active" : ""
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </span>
            <button onClick={goNext} className="carousel__btn">
              →
            </button>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/feed" className="nav-links__item">
            <div className="nav-links__text">
              <h3>Feed</h3>
              <p>Browse the latest golf blogs from our community.</p>
            </div>
            <span className="nav-links__arrow">→</span>
          </Link>

          <Link to="/my-posts" className="nav-links__item">
            <div className="nav-links__text">
              <h3>My Posts</h3>
              <p>View and manage all of your published blogs.</p>
            </div>
            <span className="nav-links__arrow">→</span>
          </Link>

          <Link to="/write" className="nav-links__item">
            <div className="nav-links__text">
              <h3>Write</h3>
              <p>Start a new post and share your golf story.</p>
            </div>
            <span className="nav-links__arrow">→</span>
          </Link>
        </div>
      </section>

      {/* TODO: Implement the cycling preview of golf blogs that are recently created and users can click on it */}
    </main>
  );
}

export default HomePage;
