import { createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod"; // For input validation

export const appRouter = createTRPCRouter({
  // Public procedure that anyone can call
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello ${input.name}!`;
    }),

  // Procedure to get user data
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input.userId }
      });
    }),

  // Procedure to create something
  createPost: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.create({
        data: input
      });
    })
});

// Export type definition of API
export type AppRouter = typeof appRouter; 