# front-elara

Frontend Next.js d'elaraMed — interface patient pour l'orientation par symptômes, l'analyse IRM (preuve de concept), et un chatbot médical assisté par l'API Claude.

## Rôle dans l'architecture globale

```
front-elara (ce repo)
   → Supabase Edge Functions
      ├── elaramed-chat     → API Claude (déjà fonctionnel)
      └── elaramed-predict  → elaraMed-api (modèle ML réel)
```

Voir aussi : [elaraMed](https://github.com/akmeonuzraa/elaraMed) (notebooks) et [elaraMed-api](https://github.com/akmeonuzraa/elaraMed-api) (backend Python).

## Installation locale

```bash
npm install
```

## Variables d'environnement

Crée `.env.local` (jamais commité) :
```
NEXT_PUBLIC_SUPABASE_URL=https://<ton-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ta clé anon Supabase>
```

## Lancer en local

```bash
npm run dev
```
→ http://localhost:3000

## Configuration Supabase (backend)

1. Exécuter la migration SQL : `supabase/migrations/*.sql`
2. Déployer les Edge Functions :
   ```bash
   supabase functions deploy elaramed-chat
   supabase functions deploy elaramed-predict
   ```
3. Secrets requis côté Supabase :
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=<clé API Claude>
   supabase secrets set ELARAMED_API_URL=<url publique de elaraMed-api>
   supabase secrets set ELARAMED_API_KEY=<clé interne partagée avec elaraMed-api>
   ```

## Déploiement

Configuré pour Netlify (`netlify.toml`). Ajouter les mêmes variables d'environnement dans les settings Netlify.

## Fonctionnalités
- Formulaire symptômes → prédiction de spécialité (via elaraMed-api)
- Upload IRM → analyse (actuellement placeholder, module CNN en cours)
- Chatbot médical (API Claude, contraint pour ne jamais poser de diagnostic ferme)

## Avertissement
Outil pédagogique à but de démonstration — ne remplace pas un avis médical professionnel.

## TODO
- [ ] Ajouter des champs formulaire (âge, intensité douleur, zone corporelle) pour des prédictions plus précises
- [ ] Brancher le vrai module IRM une fois le CNN preuve de concept prêt
