# DustHotel

Next.js hotelsite med dynamiske anmeldelser via API og PostgreSQL.

## Hurtig setup (lokalt)

1. Installer dependencies:

```bash
npm install
```

2. Opret env-fil ved siden af package.json:

```bash
cp .env.example .env.local
```

3. Udfyld minimum disse variabler i .env.local:

```env
DATABASE_URL=postgres://...
DATABASE_SSL=
BACKUP_TARGET=backups/reviews
BACKUP_RETENTION_DAYS=3650
REVIEWS_SYNC_TOKEN=vælg-en-lang-tilfældig-hemmelig-token
```

Tip: Hvis din provider kræver no-ssl lokalt, sæt DATABASE_SSL=disable.

4. Kør DB-check:

```bash
npm run db:check
```

5. Migrer gamle fil-anmeldelser til database:

```bash
npm run db:migrate-reviews
```

6. Start app:

```bash
npm run dev
```

## Database scripts

- DB forbindelse og tabelcheck:

```bash
npm run db:check
```

- Migrer eksisterende anmeldelser fra data/reviews.json:

```bash
npm run db:migrate-reviews
```

- Opret backupfil:

```bash
npm run db:backup-reviews
```

- Tjek review storage/sync-status (beskyttet endpoint):

```bash
curl -H "Authorization: Bearer $REVIEWS_SYNC_TOKEN" http://localhost:3000/api/reviews/sync
```

- Replay fil-baserede reviews til DB (beskyttet endpoint):

```bash
curl -X POST -H "Authorization: Bearer $REVIEWS_SYNC_TOKEN" http://localhost:3000/api/reviews/sync
```

- Restore fra seneste backup (eller specifik sti):

```bash
npm run db:restore-reviews
npm run db:restore-reviews -- backups/reviews/reviews-2026-01-01T00-00-00-000Z.json
```

## GitHub Actions backup

Workflowen i .github/workflows/reviews-backup.yml kører automatisk daglig backup.

Sæt følgende GitHub Secrets:

- DATABASE_URL
- DATABASE_SSL (valgfri)

Workflowen:

1. Henter alle anmeldelser
2. Gemmer snapshot i backups/reviews
3. Commiter backupfiler tilbage til repo

## Deployment checklist

Hvis du deployer appen, skal disse miljøvariabler være sat i hosting-platformen:

1. `DATABASE_URL` - påkrævet. Uden den bliver anmeldelser kun gemt i fallback-filen.
2. `DATABASE_SSL` - valgfri. Sæt `disable` hvis din database kræver det lokalt.
3. `REVIEWS_SYNC_TOKEN` eller `CRON_SECRET` - påkrævet hvis du vil bruge `/api/reviews/sync`.

Hvis `DATABASE_URL` mangler eller peger på en død database, vil kommentarer stadig blive skrevet til `data/reviews.json`, men den fil er kun en fallback og bør ikke være din eneste langsigtede lagring.

## Langtidsbevaring (grov strategi)

For høj robusthed over mange år:

1. Behold PostgreSQL som primær datakilde.
2. Kør daglig backup (workflow er allerede sat op).
3. Gem repo-backups flere steder (GitHub + separat cloud storage).
4. Test restore mindst kvartalsvist med db:restore-reviews.

## Automatisk replay til DB (cron)

`/api/reviews/sync` kan bruges af et cron-job for at re-sync'e `data/reviews.json` til DB.

1. Sæt `REVIEWS_SYNC_TOKEN` i deployment-miljøet (eller brug `CRON_SECRET`).
2. Kald endpointet periodisk med `Authorization: Bearer <token>`.
3. Brug `GET /api/reviews/sync` til status og `POST /api/reviews/sync` til sync.

