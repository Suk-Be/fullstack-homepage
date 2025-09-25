# Backend

## Tech Stack

-   **Core:** PHP 8.2+, Laravel 12
-   **Security & Auth:** Laravel Sanctum (Session-/Token-Auth), Laravel Socialite (Google & GitHub Login)
-   **Dev Tools:** Laravel Sail (Docker), Laravel Pint (Code Style), Laravel Tinker (CLI), Laravel Pail (Logging), Breeze (Starter-Kit)
-   **Testing:** Pest (mit Laravel Plugin), Faker, Mockery
-   **DB:** MySQL, SQLite (lokal für Testing)

👉 Alle Dependencies findest du in der [`composer.json`](./composer.json).

---

## Schnellstart

```bash
# In den Backend-Ordner wechseln
cd backend

# Dependencies installieren
composer install

# .env Datei anlegen
cp .env.example .env

# Application Key generieren
php artisan key:generate

# Migrationen ausführen (erstellt Tabellen)
php artisan migrate

# Development Server starten
php artisan serve
```

```bash
# Tests ausführen
php artisan test
```

---

## Scripts

```bash
- `php artisan serve` → Development-Server starten
- `php artisan migrate:fresh --seed` → Datenbank zurücksetzen und Seeder ausführen
- `php artisan queue:work` → Queue Worker starten (für lokales testen von emails mit mailpit)
- `php artisan test` → Tests ausführen (Pest/PHPUnit)
- `php artisan tinker` → CLI für interaktive DB-Checks
```

---

### Environment Variables

```env
# Server & API
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql

```

👉 Ein Beispiel für die Environment Variables findest du hier [`.env.example`](./.env.example).

### Projektstruktur (Kurzüberblick)

```bash
backend/
 ├─ app/                   # Business Logic (Models, Controllers, Services)
 │   ├─ Http/              # Controller & Middleware
 │   ├─ Models/            # Eloquent Models
 │   └─ ...
 ├─ bootstrap/             # App Bootstrap
 ├─ config/                # Konfigurationen
 ├─ database/
 │   ├─ factories/         # Testdaten Factories
 │   ├─ migrations/        # Tabellen-Migrationen
 │   └─ seeders/           # Seed-Daten
 ├─ public/                # Public Root (index.php)
 ├─ resources/             # Views, Blade Templates, lang Files
 ├─ routes/                # API & Web Routes
 ├─ storage/               # Logs, Cache, Uploads
 ├─ tests/                 # Tests (Pest)
 └─ artisan                # Artisan CLI

```

#### Testing

```markdown
-   **Unit & Feature Tests** mit [Pest](https://pestphp.com/)
-   **Factories & Seeders** für realistische Testdaten (Faker)
-   **Custom Helpers** (z. B. für Auth, Grids, External Services)
-   **Erweiterte Expectations** mit `expect()->extend()`
-   **Mocking (optional)**: [Mockery](https://github.com/mockery/mockery) wird in speziellen Szenarien genutzt, z. B. für OAuth-Tests mit Socialite.
```
