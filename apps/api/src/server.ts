import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";

import { env } from "./config/env.js";
import { initFirebaseAdmin } from "./lib/firebase-admin.js";
import { prisma } from "./lib/prisma.js";

import errorHandler from "./plugins/error-handler.js";
import auth from "./plugins/auth.js";

import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

async function build() {
  // Fail-closed if Firebase Admin can't initialise.
  initFirebaseAdmin();

  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
    trustProxy: true,
  });

  await app.register(sensible);
  await app.register(helmet);
  await app.register(cors, {
    origin: env.WEB_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 60,
    timeWindow: "1 minute",
  });

  await app.register(errorHandler);
  await app.register(auth);

  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(userRoutes, { prefix: "/api/v1" });

  return app;
}

async function start() {
  const app = await build();

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "shutting down");
    try {
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, "shutdown failed");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error({ err }, "failed to start");
    process.exit(1);
  }
}

void start();
