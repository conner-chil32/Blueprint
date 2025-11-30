"use client";

import { useEffect, useState } from 'react';

export default function WPTestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/wp-json/wp/v2/pages')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch WordPress content');
        return res.json();
      })
      .then(pages => setData(pages[0]))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p>Error: Unable to load WordPress content.</p>;
  }

  if (!data || !data.title || !data.content) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{data.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content.rendered }} />
    </main>
  );
}
