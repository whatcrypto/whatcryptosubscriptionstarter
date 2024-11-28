import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  // Get user's name
  getName: publicProcedure
    .query(async ({ ctx }) => {
      return "John Doe";
    }),

  // Say hello
  sayHello: publicProcedure
    .query(() => {
      return "Hello!";
    })
}); 