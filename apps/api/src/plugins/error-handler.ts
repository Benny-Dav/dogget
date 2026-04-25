import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const plugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, req, reply) => {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Request body failed validation",
        details: z.treeifyError(error),
      });
    }

    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      req.log.error({ err: error }, "internal error");
      return reply.status(500).send({
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      });
    }

    return reply.status(statusCode).send({
      code: error.code ?? "REQUEST_ERROR",
      message: error.message,
    });
  });
};

export default fp(plugin, { name: "error-handler" });
