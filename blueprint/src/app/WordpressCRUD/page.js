// This page allows you to make a new post, edit a post, and delete a post on the wordpress database

'use client';

const headers = new Headers();
headers.set("Authorization", process.env.NEXT_PUBLIC_WP_AUTH);

import { useEffect, useState } from 'react';

export default function WordpressCRUD() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  // Load posts
  const fetchPosts = async () => {
    const res = await fetch('/api/posts', {
      method: "GET", 
      headers: headers
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `/api/posts/${editId}/edit`
      : '/api/posts/add';

    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      setTitle('');
      setContent('');
      setEditId(null);
      fetchPosts();
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    await fetch(`/api/posts/${id}/delete`, { method: 'DELETE' });
    fetchPosts();
  };

  // Start editing
  const handleEdit = (post) => {
    setTitle(post.title.rendered);
    setContent(post.content.rendered.replace(/<\/?[^>]+(>|$)/g, '')); // Strip HTML
    setEditId(post.id);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>WordPress Post Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem', width: '40%' }}
        />
        <input
          type="text"
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem', width: '40%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editId ? 'Update Post' : 'Create Post'}
        </button>
      </form>

      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '1rem' }}>
              <strong>{post.title.rendered}</strong>
              <br />
              <span dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
              <br />
              <button onClick={() => handleEdit(post)} style={{ marginRight: '1rem' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
