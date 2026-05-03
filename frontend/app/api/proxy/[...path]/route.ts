import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/');
    const qs = req.nextUrl.searchParams.toString();
    const url = `${BACKEND}/api/${path}${qs ? `?${qs}` : ''}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;

    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

    try {
        const res = await fetch(url, { method: req.method, headers, body, cache: 'no-store' });
        const data = await res.text();
        return new NextResponse(data, {
            status: res.status,
            headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
        });
    } catch (err) {
        return NextResponse.json({ error: 'Backend unreachable', detail: String(err) }, { status: 502 });
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;