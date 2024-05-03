import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import multiparty from 'multiparty'
import { IncomingMessage } from 'http'

export async function POST(req: NextRequest, res: NextResponse) {
	const form = new multiparty.Form()

	form.parse(req, (err, fields, files) => {
		console.log(files.file.length)
		return NextResponse.json('ok')
	})
}

export const config = {
	api: { bodyParser: false }
}
