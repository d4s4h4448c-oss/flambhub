import { forbidden } from "@/lib/api/errors";

export type FlambPermission =
  | "wheels.manage"
  | "wheels.delete"
  | "hunts.manage"
  | "hunts.delete";

/**
 * V1 — Mode communauté : aucune authentification utilisateur.
 *
 * La règle d'or « le backend décide » s'applique ici : le frontend ne décide
 * jamais des permissions. Toute action sensible passe par cette fonction,
 * exécutée uniquement côté serveur.
 *
 * Si ADMIN_API_TOKEN est défini dans l'environnement, les actions de gestion
 * exigent l'en-tête `x-admin-token` avec la bonne valeur.
 * Sinon, la V1 reste en mode communauté ouverte (lecture/écriture partagée).
 *
 * V2 — Discord : `resolveActor(req)` sera remplacé par la vérification du
 * Discord OAuth (session) + rôles Discord (via le bot) mappés sur des
 * permissions backend. La signature de cette fonction ne changera pas :
 * les route handlers n'auront rien à réécrire.
 */

export interface Actor {
  source: "public" | "discord";
  roles: string[];
}

export async function resolveActor(_req: Request): Promise<Actor> {
  // V2 : lire la session Discord OAuth ici et retourner les rôles Discord.
  void _req;
  return { source: "public", roles: [] };
}

const rolePermissions: Record<string, FlambPermission[]> = {
  // V2 : mapping rôles Discord -> permissions.
  // ex: admin: ["wheels.manage", "wheels.delete", "hunts.manage", "hunts.delete"],
};

export async function checkPermission(
  req: Request,
  permission: FlambPermission,
): Promise<boolean> {
  const actor = await resolveActor(req);
  void permission;
  if (rolePermissions[actor.source]?.length) {
    return true;
  }
  const token = process.env.ADMIN_API_TOKEN;
  if (token) {
    const provided = req.headers.get("x-admin-token");
    if (provided !== token) return false;
  }
  return true;
}

export async function assertCanManage(
  req: Request,
  permission: FlambPermission,
): Promise<void> {
  const allowed = await checkPermission(req, permission);
  if (!allowed) {
    throw forbidden();
  }
}
