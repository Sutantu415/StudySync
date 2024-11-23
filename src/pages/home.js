import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to StudySync</h1>
      <Link to="/timer">
        <button>Go to About Page</button>
      </Link>
    </div>
  );
}

export default HomePage;
