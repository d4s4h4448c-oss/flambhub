# 🔥 FlambHub

La plateforme de la communauté **Flambette** : roues personnalisées, suivi de
Bonus Hunts, et bien plus à venir.

- **Accueil** — landing page communautaire
- **🎡 Roue** — roues personnalisées avec entrées pondérées, animation et historique (le tirage est calculé et enregistré **côté serveur**, protégé contre les doubles tirages par idempotency key)
- **🎰 Bonus Hunt** — hunts avec montant de départ, slots avec mise par spin et statuts (En attente / En cours / Collecté), profit, break even fixe & évolutif, providers, machines remarquables et graphiques
- **🔜 À venir** — profils, Discord, XP, classements… (V2)

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Drizzle ORM** + **Turso/libSQL** (SQLite en local, base gratuite en production)
- **Zod** pour la validation côté serveur
- **Recharts** pour les graphiques
- Déploiement **Vercel** (serverless, aucune configuration locale obligatoire)

> Règle d'or : **le frontend affiche, le backend décide.** Tirages, statistiques,
> permissions et validations sont calculés côté serveur. Aucune clé secrète côté
> client, jamais de `NEXT_PUBLIC_` pour un secret.

## Démarrage rapide (local)

```bash
npm install
npm run db:migrate   # crée la base SQLite locale ./data/flambhub.db
npm run dev          # http://localhost:3000
```

## Déploiement sur Vercel

1. Pousse ce dépôt sur GitHub.
2. Crée une base gratuite sur [turso.tech](https://turso.tech) (`flambhub`) et
   génère un token d'authentification.
3. Sur Vercel : **Add New Project** → ton dépôt → **Environment Variables** :
   - `TURSO_DATABASE_URL` = `libsql://flambhub-….turso.io`
   - `TURSO_AUTH_TOKEN` = le token généré
   - `ADMIN_API_TOKEN` (optionnel) = si défini, les actions de gestion
     (création / modification / suppression) exigent l'en-tête HTTP
     `x-admin-token` avec cette valeur.
4. **Deploy**. Le build applique automatiquement les migrations
   (`npm run db:migrate && next build`), et chaque `git push` redéploie.

## Variables d'environnement

Voir `.env.example` :

| Variable              | Obligatoire | Description                                                          |
| --------------------- | ----------- | -------------------------------------------------------------------- |
| `TURSO_DATABASE_URL`  | non (local) | URL libSQL (`file:./data/flambhub.db` en local, URL Turso en prod)   |
| `TURSO_AUTH_TOKEN`    | non (local) | Token Turso (production)                                             |
| `ADMIN_API_TOKEN`     | non         | Token optionnel pour protéger les actions de gestion (V1)            |

## Scripts

| Commande              | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Serveur de développement                      |
| `npm run build`       | Migrations + build de production              |
| `npm run start`       | Lance le build de production                  |
| `npm run db:generate` | Génère une migration depuis le schéma         |
| `npm run db:migrate`  | Applique les migrations à la base             |
| `npm run lint`        | ESLint                                        |

## Extension Chrome (encoche flottante Bonus Hunt)

L'extension injecte une **petite encoche flottante en haut à droite de toutes
les pages** (y compris les casinos). Un clic ouvre le panneau juste à côté,
directement sur la page : tu peux ajouter et collecter tes bonus **sans jamais
quitter ton casino**, et cliquer sur la page ne le ferme pas.

### Installer (mode développeur)

1. Chrome → `chrome://extensions`
2. Active **Mode développeur** (en haut à droite)
3. **Charger l'extension non empaquetée** → sélectionne le dossier `extension/`
4. Épingle l'extension (icône puzzle → 📌)
5. L'encoche apparaît sur toutes les pages — clique dessus pour ouvrir le
   panneau (un clic sur l'icône de l'extension le masque/rouvre aussi)
6. Première utilisation : réglages → URL du serveur + code de liaison
   - En ligne : `https://flambhub.vercel.app`
   - Local : `http://localhost:3007`

### Fonctionnement

- L'extension appelle directement l'API FlambHub (`/api/hunts…`). Le CORS est
  géré par `src/proxy.ts` : seules les routes `/api/*` acceptent les requêtes
  externes, tout le reste du site n'est pas affecté.
- Les données restent enregistrées côté serveur : ce que tu fais dans
  l'extension apparaît sur le site et inversement.
- Le serveur recalcule toutes les statistiques (profit, break even…) : aucune
  valeur ne vient du client.

### Mettre à jour l'extension

Après une modification des fichiers `extension/`, retourne sur
`chrome://extensions` et clique **⟳ Recharger** sur l'extension.

## Liaison site ↔ extension (code unique)

Chaque personne peut lier son extension à ses hunts du site avec un **code
unique** :

1. Sur le site : **Bonus Hunt → « Lier l'extension »** → clique
   **Générer mon code** (ex : `A1B2-C3D4-E5F6`) puis **Copier**.
2. Dans l'extension : réglages → colle le **code de liaison** + l'URL du site.
3. C'est lié : les hunts créés depuis l'extension apparaissent sur le site
   (avec RTP, stats et graphiques) et inversement.

- Le code est enregistré dans le navigateur (localStorage côté site,
  `chrome.storage` côté extension) et envoyé dans l'en-tête `x-flamb-code`.
- Chaque code ne voit que ses propres hunts (les autres reçoivent un 404).
- Sans code, on reste en mode communauté (hunts partagés, V1).

## Architecture

```
src/
├── app/                 # Pages (App Router) + API Route Handlers
│   ├── api/             # Routes API : wheels, spins, hunts, slots, catalogue
│   ├── roue/            # Page Roue
│   ├── bonus-hunt/      # Page Bonus Hunt
│   └── a-venir/         # Page À venir
├── components/          # UI (Navbar, ui/*, wheel/*, hunt/*)
└── lib/
    ├── db/              # Schéma Drizzle + client libSQL + migrations
    ├── data/            # Catalogue de slots (providers)
    ├── validation/      # Schémas Zod (validation serveur)
    ├── services/        # Logique métier : roues, tirages, hunts, stats
    ├── auth/            # Couche permissions (prête pour Discord OAuth en V2)
    └── api/             # Helpers d'erreurs API
```

### Préparation Discord (V2)

Discord n'est **pas** intégré en V1. La couche `src/lib/auth/permissions.ts`
expose déjà `resolveActor()` / `assertCanManage()` : en V2, il suffira de
brancher Discord OAuth + rôles Discord à cet endroit, sans toucher aux routes.

```text
Discord → Bot → API backend → Base de données → FlambHub
```

### Sécurité de la roue

1. Le client envoie `POST /api/wheels/:id/spin` avec un identifiant unique.
2. Le serveur vérifie la roue et les entrées, choisit le gagnant (poids
   respectés, aléa crypto) et **enregistre** le tirage avant de répondre.
3. Le frontend ne fait qu'**animer** la roue vers le résultat reçu.
4. Le même identifiant de tirage renvoie toujours le même résultat
   (idempotence) : pas de doublons même en cas de double-clic ou d'onglets
   multiples.
