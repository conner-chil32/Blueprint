import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

/**
 * Conner Childers, 10/29/2025
 * GET endpoint to load canvas data from JSON file
 * Query params: userId, filename
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const filename = searchParams.get('filename');

    // Validate inputs
    if (!userId || !filename) {
      return NextResponse.json({ 
        error: 'Missing required query parameters: userId or filename' 
      }, { status: 400 });
    }

    // Security: sanitize filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Create the full file path
    const fullFilename = `${sanitizedFilename}.json`;
    const filePath = path.join(process.cwd(), 'users', sanitizedUserId, fullFilename);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ 
        error: 'File not found',
        message: `No saved canvas found for user ${sanitizedUserId}`
      }, { status: 404 });
    }

    // Read the JSON file
    const fileContent = await readFile(filePath, 'utf-8');
    const pages = JSON.parse(fileContent);

    console.log(`[Load Canvas] Loaded pages from ${filePath}`);

    return NextResponse.json({ 
      success: true,
      pages,
      path: `users/${sanitizedUserId}/${fullFilename}`
    });

  } catch (error) {
    console.error('[Load Canvas] Error:', error);
    
    // Handle JSON parse errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        error: 'Invalid JSON file',
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to load canvas',
      details: error.message 
    }, { status: 500 });
  }
}
