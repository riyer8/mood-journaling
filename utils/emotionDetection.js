export async function detectEmotions(text) {
  const response = await fetch("http://localhost:8000/detect_emotions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to detect emotions");
  }

  const data = await response.json();
  return data.emotions;
}
