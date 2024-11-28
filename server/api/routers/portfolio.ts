import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const portfolioRouter = createTRPCRouter({
  // Get user's portfolios
  getUserPortfolios: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.portfolio.findMany({
        where: {
          userId: ctx.session.user.id
        },
        include: {
          assets: true
        }
      });
    }),

  // Create new portfolio
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.portfolio.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        }
      });
    }),

  // Add asset to portfolio
  addAsset: protectedProcedure
    .input(z.object({
      portfolioId: z.string(),
      coinId: z.string(),
      amount: z.number().positive(),
      purchasePrice: z.number().positive()
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify portfolio belongs to user
      const portfolio = await ctx.prisma.portfolio.findFirst({
        where: {
          id: input.portfolioId,
          userId: ctx.session.user.id
        }
      });

      if (!portfolio) {
        throw new Error("Portfolio not found or unauthorized");
      }

      return await ctx.prisma.portfolioAsset.create({
        data: {
          portfolioId: input.portfolioId,
          coinId: input.coinId,
          amount: input.amount,
          purchasePrice: input.purchasePrice
        }
      });
    }),
}); 