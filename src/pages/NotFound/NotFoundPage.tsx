import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <h1 className="not-found__code">404</h1>
          <h2 className="not-found__title">Page Not Found</h2>
          <p className="not-found__message">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="not-found__actions">
            <Link to="/" className="not-found__btn not-found__btn--primary">
              Back to Home
            </Link>
            <Link to="/feed" className="not-found__btn not-found__btn--secondary">
              Browse Posts
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;