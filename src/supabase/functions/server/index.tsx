import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Submit a response
app.post('/make-server-ad8f2b21/response', async (c) => {
  try {
    const body = await c.req.json();
    const { answer, message, timestamp } = body;

    if (!answer || !timestamp) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate a unique key for this response
    const responseKey = `valentine_response_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store the response
    await kv.set(responseKey, {
      answer,
      message: message || '',
      timestamp,
    });

    return c.json({ success: true, key: responseKey });
  } catch (error) {
    console.error('Error submitting response:', error);
    return c.json({ error: 'Failed to submit response', details: String(error) }, 500);
  }
});

// Get all responses
app.get('/make-server-ad8f2b21/responses', async (c) => {
  try {
    // Get all responses with the valentine_response_ prefix
    const responses = await kv.getByPrefix('valentine_response_');

    // Sort by timestamp (newest first)
    responses.sort((a, b) => {
      const timeA = new Date(a.value.timestamp).getTime();
      const timeB = new Date(b.value.timestamp).getTime();
      return timeB - timeA;
    });

    return c.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return c.json({ error: 'Failed to fetch responses', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
