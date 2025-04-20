// Fetch blog pages via WordPress REST API. Should return the first page that you make in Wordpress http://localhost:8000/wp-admin/edit.php?post_type=page
async function getPageData() {
  const res = await fetch('http://localhost:8000/wp-json/wp/v2/pages');
  if (!res.ok) {
    throw new Error('Failed to fetch WordPress content');
  }
  const data = await res.json();
  return data[0]; // Get the first page from the array
}

export default async function WPTestPage() {
  const data = await getPageData();

  if (!data || !data.title || !data.content) {
    return <p>Error: Unable to load WordPress content.</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{data.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content.rendered }} />
    </main>
  );
}
