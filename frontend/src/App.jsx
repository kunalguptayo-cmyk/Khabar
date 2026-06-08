import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { getTodayDigest } from "./api";
import ArticleCard from "./components/ArticleCard";
import DigestHeader from "./components/DigestHeader";
import TopicBreakdown from "./components/TopicBreakdown";
import "./index.css";

function App() {
  const [digest, setDigest] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayDigest()
      .then(setDigest)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="page">
        <section className="state-panel">Loading today's digest...</section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <section className="state-panel error">{error}</section>
      </main>
    );
  }

  const articles = digest?.articles || [];

  return (
    <main className="page">
      <DigestHeader date={digest.date} count={articles.length} />
      <TopicBreakdown breakdown={digest.topic_breakdown} />
      <section className="article-list" aria-label="Daily news articles">
        {articles.length === 0 ? (
          <div className="state-panel">No articles are ready yet.</div>
        ) : (
          articles.map((article) => <ArticleCard key={article.id} {...article} />)
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
