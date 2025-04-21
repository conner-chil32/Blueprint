export async function DELETE(_, { params }) {
  const { id } = params;

  const res = await fetch(`http://localhost:8000/index.php/wp-json/wp/v2/posts/${id}?force=true`, {
    method: 'DELETE',
    headers: {
      Authorization: process.env.NEXT_PUBLIC_WP_AUTH,
    },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
