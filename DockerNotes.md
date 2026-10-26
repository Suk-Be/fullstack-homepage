# Docker services

Stand September 2025

Dieses Projekt nutzt Docker Compose für die lokale Entwicklung von Laravel (Backend) und optional React/Vite (Frontend).

```bash
project-root/
│
├── backend/ # Laravel
│ ├── Dockerfile
│ ├── composer.json
│ ├── composer.lock
│ ├── .env
│ └── ...
│
├── frontend/ # React
│ ├── Dockerfile
│ ├── package.json
│ ├── package-lock.json
│ └── ...
│
├── mailpit/ # Mail Dev (eigene Config optional, sonst nur Service in compose)
│
└── docker-compose.yml
```

Eigene Docker Images:

- backend
- queue
- frontend

Externe Docker Images:

- mariadb
- phpmyadmin
- mailpit

# Abstimmung der Laravel env und der docker-compose.yml

Es gibt unterschiedlich env Dateien die für dev, prod und staging genutzt werden.

Im development ist laravel env auf die Arbeit mit docker ausgerichtet und nutzt die Services aus der docker-compose.yml.

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sanctum_cookie
DB_USERNAME=laravel
DB_PASSWORD=secret
```

Passend dazu

```yml
db:
  environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: sanctum_cookie
      MYSQL_USER: laravel
      MYSQL_PASSWORD: secret
  ports:
      - '3306:3306
```

Wichtig: DB_HOST=db entspricht dem Servicenamen in Compose.

# Service ports

Laufen die docker Services können, dann können sie über die entsprechenden ports erreicht werden

```yml
backend:
  ports:
    - '8000:80'
db:
  ports:
    - '3306:3306'
phpmyadmin:
  ports:
    - '8080:80'
mailpit:
  ports:
    - '1025:1025'
    - '8025:8025'
```

Online erreichbar

- Laravel <http://localhost:8000/>
- phpmyadmin <http://localhost:8080/>
- mailpit <http://localhost:8025/>
- vite <http://localhost:5173/>

# 📧 Mail & Queue

Laravel verarbeitet Mails/Notifications nur mit aktivem Queue-Worker.

```bash
# ohne docker
cd backend
php artisan queue:work
```

In Docker übernimmt das der queue Service:

```yml
queue:
  command: php artisan queue:work --tries=3 --timeout=90
```

👉 Voraussetzung: QUEUE_CONNECTION ≠ sync

# frontend Einstellungen

Frontend wird meist lokal gestartet:

```bash
npm run dev
```

Die Frontend Einstellungen für docker sind wie die backend services nur auf die lokale Entwicklung ausgerichtet.

# Abstimmung der frontend env, vite.config und der docker-compose.yml

In der env Datei stehen API Endpunkte die je nach environment (dev, staging, prod) unterschiedlich eingestellt sind.

```ts
// host muss auf 0.0.0.0 umstellen, damit container und Rechner angesprochen werden können.
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: true, // verhindert automatisches Hochzählen des Ports
  // ...
},
```

```yml
frontend:
  ports:
    - '5173:5173'
  env_file:
    - ./frontend/.env
```

# Services nutzen 🚀

Es gibt drei Nutzungsszenarien. Mit Standard Dev werden die meisten Aufgaben erledigt alle Tests. Mails (und App) laufen nur im zweiten Szenario. Google Recaptcha (und App) laufen nur im dritten Szenario.

- Standard Dev (Laravel + DB + phpMyAdmin)
- Dev + Mail + Queue (Mail Queue läuft)
- Test Setup (einziges Szenario um externen Recaptcha Service von Google zu im Browser zu testen)

Über profiles können die entsprechenden services gebaut werden.

```bash
# Standard Dev
docker compose --profile dev up -d --build

# Dev + Mail + Queue
docker compose --profile dev --profile mail up -d --build

# Test Setup
docker compose --profile test up -d --build

# optional: Frontend im Container (Vite)
docker compose --profile dev --profile fe up -d --build
```

# Images neu bauen 🚀

Hier sind eher die eigene Services interessant. Updates von externe Images können side effects auf das gesamte framework haben und müssen vorher geprüft werden.

```bash
# Eigene Images (backend/frontend/queue) neu bauen:
docker compose --profile dev --profile fe --profile mail build --no-cache
```

- docker-compose build

```bash
# Externe Images (db/phpmyadmin/mailpit) holen:
docker compose --profile dev --profile mail pull

```

- docker-compose pull

# 🚀 TL;DR – Standard Start

Für 90% der Fälle:

```bash
docker compose --profile dev --profile mail up -d --build
```

# 🛑 Stoppen & Aufräumen

Da die Services über Profiles gestartet werden, sollten sie auch mit denselben Profiles gestoppt werden.

```bash
# dev und mail
docker compose --profile dev --profile mail down
# nur dev
docker compose --profile dev down
```

# Mit Volumes löschen

⚠️ Löscht Datenbank-Daten!

```bash
docker compose --profile dev --profile mail down -v

```

Sinnvoll bei:

- frischem Setup
- kaputter DB
- Reset auf Anfangszustand

Hard Reset (optional)

Stoppt alles und entfernt auch verwaiste Container:

```bash
docker compose --profile dev --profile mail down -v --remove-orphans
```

Quick-Check laufender Container
docker compose ps

## 💡 Merksatz

👉 Immer mit denselben Profiles stoppen, mit denen gestartet wurde.

Start:

```bash
docker compose --profile dev --profile mail up -d
```

Stop:

```bash
docker compose --profile dev --profile mail down
```

bash
docker compose --profile dev --profile mail down

````

# 🧰 Nützliche Interaktion mit Container Inhalt

In Backend Container:

```bash
docker compose exec backend sh
````

Artisan:

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan migrate:fresh --seed
```

Logs:

```bash
docker compose logs -f
docker compose logs -f backend
```

Logs:

```bash
docker compose logs -f
docker compose logs -f backend
```

| CONTAINER ID | IMAGE                 | COMMAND                | CREATED        | STATUS                  | PORTS                                                                                    | NAMES         |
| :----------- | :-------------------- | :--------------------- | :------------- | :---------------------- | :--------------------------------------------------------------------------------------- | :------------ |
| 757d16d40b6f | spa-backend           | "docker-php-entrypoi…" | 10 minutes ago | Up 10 minutes           | 0.0.0.0:8000->80/tcp, [::]:8000->80/tcp                                                  | laravel_app   |
| bcc1b80bec19 | spa-queue             | "docker-php-entrypoi…" | 10 minutes ago | Up 10 minutes           | 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp                                                  | spa-queue-1   |
| f63e9984fdc0 | phpmyadmin/phpmyadmin | "/docker-entrypoint.…" | 7 weeks ago    | Up 10 minutes           | 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp                                                  | pma           |
| 114dab1677e1 | axllent/mailpit       | "/mailpit"             | 7 weeks ago    | Up 10 minutes (healthy) | 0.0.0.0:1025->1025/tcp, [::]:1025->1025/tcp, 0.0.0.0:8025->8025/tcp, [::]:8025->8025/tcp | mailpit       |
| 8d3a8abf579d | mariadb:10.6          | "docker-entrypoint.s…" | 8 weeks ago    | Up 10 minutes           | 0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp                                              | mariadb_db    |
| d501e26dc198 | httpd:latest          | "httpd-foreground"     | 5 months ago   | Exited (0)              | 5 months ago                                                                             | apache_server |
