import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { firebaseAuth } from "../lib/firebase-admin.js";
import { prisma } from "../lib/prisma.js";
import type { User } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    firebaseUid?: string;
    email?: string;
    user?: User;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest) => Promise<void>;
    requireUser: (req: FastifyRequest) => Promise<User>;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  const verifyToken = async (req: FastifyRequest): Promise<void> => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw app.httpErrors.unauthorized("Missing or malformed Authorization header");
    }
    const idToken = header.slice("Bearer ".length).trim();
    try {
      const decoded = await firebaseAuth().verifyIdToken(idToken);
      req.firebaseUid = decoded.uid;
      req.email = decoded.email;
    } catch (err) {
      req.log.debug({ err }, "verifyIdToken failed");
      throw app.httpErrors.unauthorized("Invalid or expired ID token");
    }
  };

  app.decorate("requireAuth", verifyToken);

  app.decorate("requireUser", async (req: FastifyRequest) => {
    if (!req.firebaseUid) await verifyToken(req);
    const user = await prisma.user.findUnique({ where: { firebaseUid: req.firebaseUid! } });
    if (!user) throw app.httpErrors.unauthorized("No user record for this token");
    if (user.bannedAt) throw app.httpErrors.forbidden("Account is banned");
    if (user.deletedAt) throw app.httpErrors.gone("Account has been deleted");
    req.user = user;
    return user;
  });
};

export default fp(plugin, { name: "auth" });
