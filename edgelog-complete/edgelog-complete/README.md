# EDGELOG — Journal de Trading Professionnel

> Plateforme SaaS complète pour analyser vos trades, identifier vos patterns et progresser.

---

## Structure du projet

```
edgelog/
├── frontend/          # React + Vite + Recharts
│   ├── src/
│   │   ├── App.jsx    # Application complète (5 100+ lignes)
│   │   └── main.jsx   # Point d'entrée React
│   ├── public/
│   │   └── manifest.json
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/           # Node.js + Express + Prisma + PostgreSQL
│   ├── src/
│   │   ├── index.js              # Serveur Express
│   │   ├── lib/
│   │   │   ├── jwt.js            # Gestion tokens JWT
│   │   │   ├── plans.js          # Enforcement plans/limites
│   │   │   ├── email.js          # Emails transactionnels (Resend)
│   │   │   ├── prisma.js         # Singleton Prisma
│   │   │   ├── brokers.js        # Adapters broker (Binance, MT5…)
│   │   │   ├── cron.js           # Jobs planifiés
│   │   │   └── oauth.js          # Google OAuth
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # authenticate, requirePlan, errorHandler
│   │   └── routes/
│   │       ├── auth.js           # Register, login, refresh, logout
│   │       ├── user.js           # Profil utilisateur
│   │       ├── accounts.js       # Comptes de trading
│   │       ├── trades.js         # CRUD trades
│   │       ├── analytics.js      # 6 endpoints stats
│   │       ├── stripe.js         # Checkout, webhook, portal
│   │       ├── import.js         # Import CSV/broker
│   │       ├── mentor.js         # Coach & mentors
│   │       ├── broker.js         # Sync broker API
│   │       └── oauth.js          # Routes Google OAuth
│   ├── prisma/
│   │   ├── schema.prisma         # Schéma PostgreSQL
│   │   └── seed.js               # Données de démo
│   ├── __mocks__/
│   │   └── prisma.js             # Mock Prisma pour Jest
│   ├── __tests__/                # 103 tests Jest
│   ├── jest.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Plans tarifaires

| Feature | Basic (gratuit) | Premium (9,99€/mois) | Pro (sur demande) |
|---|---|---|---|
| Trades | 15 max | 100 max | Illimité |
| Historique | 30 jours | 90 jours | Illimité |
| Calendrier P&L | ✗ | ✓ | ✓ |
| Analyses avancées | ✗ | ✓ | ✓ |
| Import CSV/Broker | ✗ | ✗ | ✓ |
| IA comportementale | ✗ | ✗ | ✓ |
| Essai psychologie | 30 jours | Inclus | Inclus |

---

## Installation rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm 9+

---

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:5173
```

### 2. Backend

```bash
cd backend
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (DATABASE_URL, JWT_SECRET, etc.)

# Base de données
npx prisma db push        # Crée les tables
npm run db:seed           # Données de démo

# Démarrer
npm run dev
# → http://localhost:4000
```

**Compte démo après seed :**
```
Email    : demo@edgelog.app
Password : demo1234
Plan     : Premium
```

---

## Lancer sur StackBlitz / CodeSandbox

> **Note :** Le projet complet (frontend + backend) ne tourne pas directement sur StackBlitz car il nécessite PostgreSQL. Options recommandées :

### Option A — Frontend seul sur StackBlitz ✅

Le frontend fonctionne en mode démo (données locales) sans backend :
1. Importer uniquement le dossier `frontend/` sur StackBlitz
2. L'application démarre avec des données de démonstration intégrées
3. Toutes les pages sont navigables sans connexion API

### Option B — Projet complet en local ✅ Recommandé

```bash
# PostgreSQL requis
createdb edgelog_dev

git clone <votre-repo>
cd edgelog

# Backend
cd backend && npm install && cp .env.example .env
# → Éditer .env avec votre DATABASE_URL
npx prisma db push && npm run db:seed && npm run dev &

# Frontend
cd ../frontend && npm install && npm run dev
```

### Option C — Deploy Railway + Vercel ✅

- Backend → Railway (PostgreSQL intégré, variables env via dashboard)
- Frontend → Vercel (définir `VITE_API_URL=https://votre-api.railway.app/api`)

---

## Variables d'environnement requises

### Backend (.env)

| Variable | Description | Obligatoire |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `JWT_SECRET` | Secret JWT (64+ chars) | ✅ |
| `JWT_REFRESH_SECRET` | Secret refresh token | ✅ |
| `STRIPE_SECRET_KEY` | Clé Stripe (sk_test_...) | Pour Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | Pour Stripe |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | ID prix Stripe | Pour Stripe |
| `RESEND_API_KEY` | Clé API Resend | Pour emails |
| `GOOGLE_CLIENT_ID` | Client ID Google | Pour OAuth |
| `BROKER_CIPHER_KEY` | Clé AES-256 (64 chars hex) | Pour brokers |

### Frontend (.env.local)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL du backend (vide en dev avec proxy Vite) |

---

## Tests

```bash
cd backend
npm test                  # 103 tests (auth, plans, trades, analytics, stripe)
npm run test:coverage     # Rapport de couverture HTML dans /coverage
npm run test:verbose      # Détail par test
npx jest trades --watch   # Mode watch sur un fichier
```

---

## API — Endpoints principaux

```
POST   /api/auth/register         Créer un compte
POST   /api/auth/login            Se connecter
POST   /api/auth/refresh          Renouveler le token
POST   /api/auth/logout           Se déconnecter
GET    /api/auth/me               Profil utilisateur

GET    /api/trades                Liste des trades (avec filtre plan)
POST   /api/trades                Créer un trade
PUT    /api/trades/:id            Modifier un trade
DELETE /api/trades/:id            Supprimer un trade

GET    /api/analytics/overview    KPIs (winRate, PF, drawdown…)
GET    /api/analytics/streak      Série actuelle wins/losses
GET    /api/analytics/assets      Stats par actif
GET    /api/analytics/emotions    Stats par émotion
GET    /api/analytics/hours       Stats par heure
GET    /api/analytics/heatmap     Calendrier P&L

POST   /api/stripe/checkout       Créer session paiement
POST   /api/stripe/portal         Portail billing
POST   /api/stripe/cancel         Résilier abonnement
POST   /api/stripe/webhook        Webhooks Stripe

GET    /api/accounts              Liste des comptes
POST   /api/accounts              Créer un compte
```

---

## Stack technique

**Frontend**
- React 18 + Hooks
- Recharts (graphiques)
- Vite (bundler)
- PWA (Service Worker)

**Backend**
- Node.js 18 + Express
- Prisma ORM (PostgreSQL)
- JWT (access + refresh tokens)
- Stripe (paiements)
- Resend (emails)
- node-cron (jobs planifiés)
- Passport.js (Google OAuth)

**Tests**
- Jest 29 + Supertest
- 103 tests unitaires
- Mock Prisma complet
- Coverage > 75%
