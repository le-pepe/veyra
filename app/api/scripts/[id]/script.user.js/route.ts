'use server'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scripts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log(`Fetching script with ID: ${id}`)

        const [script] = await db
            .select()
            .from(scripts)
            .where(eq(scripts.id, id))
            .limit(1);

        if (!script) {
            return NextResponse.json(
                { error: 'Script not found' },
                { status: 404 }
            );
        }

        const grants = script.grant && script.grant.length > 0
            ? script.grant.map((g: string) => `// @grant        ${g}`).join('\n')
            : '// @grant        none';

        const userScriptContent = `// ==UserScript==
// @name         ${script.name}
// @namespace    http://tampermonkey.net/
// @version      ${script.version}
// @description  ${script.description}
// @author       ${script.author}
// @match        ${script.match}
${grants}
// @icon         https://demonicscans.org/favicon.ico
// @updateURL    ${process.env.NEXT_PUBLIC_SITE_URL}/api/scripts/${id}
// @downloadURL  ${process.env.NEXT_PUBLIC_SITE_URL}/api/scripts/${id}
// ==/UserScript==

${script.code}`;

        return new NextResponse(userScriptContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/javascript; charset=utf-8',
                'Content-Disposition': `inline; filename="${id}.user.js"`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Content-Type-Options': 'nosniff',
            }
        });

    } catch (error) {
        console.error('Error serving script:', error);
        return NextResponse.json(
            { error: 'Failed to serve script' },
            { status: 500 }
        );
    }
}