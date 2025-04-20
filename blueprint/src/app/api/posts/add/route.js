//This code creates a new blog post in your local WordPress site via the REST API — it ends up in ...
//the WordPress database as a new post under Posts > All Posts.

export async function POST(req) {
  const body = await req.json();

  console.log('Auth Header:', process.env.NEXT_PUBLIC_WP_AUTH);

  const res = await fetch('http://localhost:8000/index.php/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_WP_AUTH,
      'Content-Type': 'application/json',
    },
    
    body: JSON.stringify({
      title: body.title,
      content: body.content,
      status: 'publish',
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
