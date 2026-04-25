import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const patchBody = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().max(20).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  preferredCurrency: z.enum(["GHS", "USD", "EUR", "NGN"]).optional(),
});

const routes: FastifyPluginAsync = async (app) => {
  app.get("/users/me", async (req) => {
    const user = await app.requireUser(req);
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    return { user, addresses };
  });

  app.patch("/users/me", async (req) => {
    const user = await app.requireUser(req);
    const body = patchBody.parse(req.body ?? {});
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: body,
    });
    return { user: updated };
  });
};

export default routes;
