import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video');
    const subdirectory = formData.get('subdirectory') || 'videos'; // Default to 'videos' if not specified

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security: prevent directory traversal in subdirectory
    if (subdirectory.includes('..') || subdirectory.includes('\\') || subdirectory.includes('/')) {
      return NextResponse.json({ error: 'Invalid subdirectory' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Save to users directory with custom subdirectory (which is mounted in Docker)
    const uploadDir = path.join(process.cwd(), 'users', subdirectory, 'videos');
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return path relative to public access
    const videoUrl = `/users/${subdirectory}/videos/${filename}`;

    return NextResponse.json({ 
      success: true, 
      videoUrl,
      filename 
    });

  } catch (error) {
    console.error('[Upload Video] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload video',
      details: error.message 
    }, { status: 500 });
  }
}
