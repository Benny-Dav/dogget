import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const sessionBody = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().max(20).optional(),
});

async function upsertUserFromToken(
  app: Parameters<FastifyPluginAsync>[0],
  req: FastifyRequest
) {
  await app.requireAuth(req);
  const body = sessionBody.parse(req.body ?? {});
  const firebaseUid = req.firebaseUid!;
  const email = req.email;
  if (!email) throw app.httpErrors.badRequest("Token has no email claim");

  return prisma.user.upsert({
    where: { firebaseUid },
    update: { email },
    create: {
      firebaseUid,
      email,
      name: body.name ?? null,
      phone: body.phone ?? null,
    },
  });
}

const routes: FastifyPluginAsync = async (app) => {
  // Idempotent: client calls on every sign-in/sign-up. Returns canonical User.
  app.post("/auth/session", async (req) => {
    const user = await upsertUserFromToken(app, req);
    return { user };
  });

  // Same contract as /auth/session, kept for PRD §7 symmetry.
  app.post("/auth/register", async (req) => {
    const user = await upsertUserFromToken(app, req);
    return { user };
  });
};

export default routes;
