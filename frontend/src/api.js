const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function getTodayDigest() {
  const response = await fetch(`${API_BASE}/api/digest/today`);
  if (!response.ok) {
    throw new Error("Could not load digest");
  }
  return response.json();
}

export async function sendFeedback(articleId, feedback) {
  const response = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article_id: articleId, feedback })
  });
  if (!response.ok) {
    throw new Error("Could not send feedback");
  }
  return response.json();
}
