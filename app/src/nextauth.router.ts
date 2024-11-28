import { z } from 'zod';

import {
	createTRPCRouter,
	// protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc';

export const nextauthRouter = createTRPCRouter({
	// prefix: t.procedure.input(callable).query(async (args) => handler(args)),
});
