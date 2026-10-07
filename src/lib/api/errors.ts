import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const badRequest = (message: string) => new ApiError(400, message);
export const unauthorized = (message = "Accès refusé.") =>
  new ApiError(401, message);
export const forbidden = (message = "Vous n'avez pas la permission.") =>
  new ApiError(403, message);
export const notFound = (message = "Ressource introuvable.") =>
  new ApiError(404, message);
export const conflict = (message: string) => new ApiError(409, message);

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Données invalides.", details: error.flatten() },
      { status: 400 },
    );
  }
  console.error("[FlambHub] Erreur serveur :", error);
  return NextResponse.json(
    { error: "Une erreur interne est survenue." },
    { status: 500 },
  );
}

type Handler = (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>;

export function withErrorHandling(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
