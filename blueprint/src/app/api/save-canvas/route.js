import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const { pages, selectedPageID, nextPageID, nextWidgetId, userId, filename } = await request.json();

    // Validate inputs
    if (!pages || selectedPageID === undefined || nextPageID === undefined || nextWidgetId === undefined || !userId || !filename) {
      return NextResponse.json({ 
        error: 'Missing required fields: pages, selectedPageID, nextPageID, nextWidgetId, userId, or filename' 
      }, { status: 400 });
    }

    // Security: sanitize filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Create user directory if it doesn't exist
    const userDir = path.join(process.cwd(), 'users', sanitizedUserId);
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true });
    }

    // Create the full file path
    const fullFilename = `${sanitizedFilename}.json`;
    const filePath = path.join(userDir, fullFilename);

    // Write the JSON file
    await writeFile(filePath, JSON.stringify({ pages, selectedPageID, nextPageID, nextWidgetId }, null, 2), 'utf-8');

    console.log(`[Save Canvas] Saved pages to ${filePath}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Pages saved successfully',
      filename: fullFilename,
      path: `users/${sanitizedUserId}/${fullFilename}`
    });

  } catch (error) {
    console.error('[Save Canvas] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to save pages',
      details: error.message 
    }, { status: 500 });
  }
}
