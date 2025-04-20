// GET posts

export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/wp-json/wp/v2/posts/', {
      headers: {
        'Authorization': process.env.NEXT_PUBLIC_WP_AUTH,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to fetch posts:', res.status, errorText);
      return new Response(JSON.stringify([]), { // return [] instead of error message
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(JSON.stringify([]), { // return [] on crash too
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
