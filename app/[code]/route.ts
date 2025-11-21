import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Update stats asynchronously (fire and forget to speed up redirect)
        // Note: In serverless, this might need `waitUntil` or similar if the runtime kills the process early.
        // For standard Next.js, this usually works fine, but awaiting is safer for data integrity.
        await prisma.link.update({
            where: { id: link.id },
            data: {
                totalClicks: { increment: 1 },
                lastClickedAt: new Date(),
            },
        });

        return NextResponse.redirect(link.originalUrl);
    } catch (error) {
        console.error('Error redirecting:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
