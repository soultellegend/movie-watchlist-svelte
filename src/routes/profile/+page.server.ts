import * as auth from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema.js';
import { eq, count, sum, desc, and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	
	const [statsResult] = await db
		.select({
			totalMovies: count(),
			completed: count(table.watchlist.completedAt),
			totalMinutes: sum(
				sql`CASE WHEN ${table.watchlist.status} = 'completed' AND ${table.watchlist.runtime} IS NOT NULL THEN ${table.watchlist.runtime} ELSE 0 END`
			)
		})
		.from(table.watchlist)
		.where(eq(table.watchlist.userId, event.locals.user.id));
	
	const totalHours = statsResult.totalMinutes 
		? Math.round(Number(statsResult.totalMinutes) / 60) 
		: 0;
	
	const recentMovies = await db
		.select()
		.from(table.watchlist)
		.where(eq(table.watchlist.userId, event.locals.user.id))
		.orderBy(desc(table.watchlist.addedAt))
		.limit(5);
	
	return {
		user: event.locals.user,
		stats: {
			...statsResult,
			totalHours
		},
		recentMovies
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
}; 