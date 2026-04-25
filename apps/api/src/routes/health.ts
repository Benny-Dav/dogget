import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/healthz", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, ts: new Date().toISOString() };
  });
};

export default routes;
