import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


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

        return NextResponse.json(link);
    } catch (error) {
        console.error('Error fetching link:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        // Check if exists first
        const existing = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        await prisma.link.delete({
            where: { shortCode: code },
        });

        return NextResponse.json({ message: 'Link deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
