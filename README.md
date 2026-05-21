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

## Langtidsbevaring (grov strategi)

For høj robusthed over mange år:

1. Behold PostgreSQL som primær datakilde.
2. Kør daglig backup (workflow er allerede sat op).
3. Gem repo-backups flere steder (GitHub + separat cloud storage).
4. Test restore mindst kvartalsvist med db:restore-reviews.

