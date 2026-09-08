export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = await req.json().catch(() => ({}));
  const { prompt, actionType } = body;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ 
        text: `[SYSTEM OK] Received ${actionType || 'COMMAND'}: "${prompt || 'Default execution'}"\n\nInitializing core processing...\n` 
      });

      await new Promise((r) => setTimeout(r, 600));
      send({ text: `[ANALYSIS] Processing payload through core agent pipeline...\n` });

      await new Promise((r) => setTimeout(r, 800));
      send({ text: `[EXECUTION] Routine executed successfully.\n` });

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
