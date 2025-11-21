import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { generateShortCode, isValidUrl } from '../../../lib/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, code } = body;

        if (!url || !isValidUrl(url)) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        let shortCode = code;

        if (shortCode) {
            // Validate custom code format
            const codeRegex = /^[A-Za-z0-9]{6,8}$/;
            if (!codeRegex.test(shortCode)) {
                return NextResponse.json(
                    { error: 'Code must be 6-8 alphanumeric characters' },
                    { status: 400 }
                );
            }

            // Check if code exists
            const existing = await prisma.link.findUnique({
                where: { shortCode },
            });

            if (existing) {
                return NextResponse.json(
                    { error: 'Code already in use' },
                    { status: 409 }
                );
            }
        } else {
            // Generate unique code
            let isUnique = false;
            while (!isUnique) {
                shortCode = generateShortCode();
                const existing = await prisma.link.findUnique({
                    where: { shortCode },
                });
                if (!existing) isUnique = true;
            }
        }

        const link = await prisma.link.create({
            data: {
                originalUrl: url,
                shortCode,
            },
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
