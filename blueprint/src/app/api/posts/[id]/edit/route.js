// Updates a post in the wordpress database

export async function PUT(req, { params }) {
  const body = await req.json();
  const { id } = params;

  const res = await fetch(`http://localhost:8000/index.php/wp-json/wp/v2/posts/${id}`, {
    method: 'PUT',
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
