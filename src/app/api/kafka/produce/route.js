export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
const client = require('../../../../../lib/kafka/kafka')
const producer = client.producer()

export async function POST(req) {
  try {
    await producer.connect()
    const body = await req.json();
    const { topic, message, key } = body;

    if (!topic || !message) {
      return NextResponse.json({ error: 'add topic and message' });
    }

    await producer.send({
      topic,
      key,
      messages: [{ value: JSON.stringify(message) }],
    });

    await producer.disconnect()

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Kafka produce error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
