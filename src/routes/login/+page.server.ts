import * as auth from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			!username ||
			!password
		) {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}

		const [existingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));

		if (!existingUser) {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}

		const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
		if (existingUser.passwordHash !== hashedPassword) {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}

		const token = auth.generateSessionToken();
		const session = await auth.createSession(token, existingUser.id);
		auth.setSessionTokenCookie(event, token, session.expiresAt);

		return redirect(302, '/');
	},

	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			!username ||
			!password
		) {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}

		const [existingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));

		if (existingUser) {
			return fail(400, {
				message: 'Username already taken'
			});
		}

		const userId = crypto.randomUUID();
		const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));

		await db.insert(table.user).values({
			id: userId,
			username,
			passwordHash: hashedPassword
		});

		const token = auth.generateSessionToken();
		const session = await auth.createSession(token, userId);
		auth.setSessionTokenCookie(event, token, session.expiresAt);

		return redirect(302, '/');
	}
}; 