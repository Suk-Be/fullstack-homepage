# Backend

## Tech Stack

-   **Core:** PHP 8.2+, Laravel 12
-   **Security & Auth:** Laravel Sanctum (Session-/Token-Auth), Laravel Socialite (Google & GitHub Login)
-   **Dev Tools:** Laravel Sail (Docker), Laravel Pint (Code Style), Laravel Tinker (CLI), Laravel Pail (Logging), Breeze (Starter-Kit)
-   **Testing:** Pest (mit Laravel Plugin, auf PHPUnit basierend), Faker, Mockery
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

# Migrationen ausführen (erstellt Tabellen mit Test Daten)
php artisan migrate --seed

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
- `php artisan serve` → Startet den Development-Server
- `php artisan migrate:fresh --seed` → Setzt die DB zurück und führt Seed-Daten aus
- `php artisan queue:work` → Startet den Queue Worker (z.B. für Mail-Handling)
- `php artisan test` → Führt Unit & Feature Tests aus (Pest/PHPUnit)
- `php artisan tinker` → Interaktive Konsole für DB-Checks & Debugging
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
 ├─ app/
 │   ├─ Http/
 │   │    ├─ Controllers/
 │   │    │     ├─ Api/
 │   │    │     │   ├─ Auth/SpaAuth/  # AuthController
 │   │    │     │   └─ Grid/          # GridController
 │   │    │     └─ Auth               # Authorization token
 │   │    └─ Resources/               # Grid & User JSON
 │   ├─ Models/                       # Eloquent Models
 │   ├─ Notifications/                # Reset password emails
 │   ├─ Policies/                     # User & Grid Policies
 │   ├─ Providers/                    # App Provider & Auth Provider
 │   └─ Traits/                       # ApiResponses, CommonPolicyMethods
 ├─ bootstrap/                        # App Bootstrap: Sanctum stateful API, EnsureEmailIsVerified
 ├─ config/                           # sanctum, cors, mail, session, queue, services, providers
 ├─ database/
 │   ├─ factories/                    # Grid, User Testdaten Factories
 │   ├─ migrations/                   # Tabellen-Migrationen
 │   └─ seeders/                      # Seed-Daten für Grid & User mit unterschiedlichen Rollen
 ├─ public/                           # Public Root (index.php)
 ├─ routes/                           # API & Web Routes
 ├─ storage/                          # Logs, Cache, Uploads
 └─ tests/                            # Tests (Pest), Feature, Unit und Helpers

```

#### Testing

```markdown
-   **Unit & Feature Tests** mit [Pest](https://pestphp.com/)
-   **Factories & Seeders** für realistische Testdaten (Faker)
-   **Custom Helpers** (z. B. für Auth, Grids, External Services)
-   **Erweiterte Expectations** mit `expect()->extend()`
-   **Mocking (optional)**: [Mockery](https://github.com/mockery/mockery) wird in speziellen Szenarien genutzt, z. B. für OAuth-Tests mit Socialite.
```
