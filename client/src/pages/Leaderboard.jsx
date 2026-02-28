import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ranks")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return data;
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ranks;
        
        if (Array.isArray(list)) {
          const sorted = [...list].sort((a, b) => a.position - b.position);
          setRanks(sorted);
        } else {
          setRanks([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load ranks");
      });
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="mt-10 mb-6 text-center">Leaderboard</h1>

      {ranks.map((rank) => (
        <div
          key={rank.userId ?? rank.id ?? rank.name}
          className="mb-4 text-center"
        >
          {rank.position} {rank.name} — Level {rank.level} — XP {rank.xp}
        </div>
      ))}
    </div>
  );
}