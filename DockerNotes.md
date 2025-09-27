# Docker services

Stand September 2025

### Projektverzeichnis

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

# Anpassungen in der lokalen laravel Entwicklungsumgebung

In der env Datei gibt es configurationen für database, session und mail, die für docker und für lokale Entwicklung unterschiedlich sein können.

Das Setup ist so konfiguriert dass die session, mail und database Docker unabhängig sind und so dass entwickelt werden kann ohne dass man docker apis 'docker exec' verwendet werden muss.

```yml docker-compose.yml
DB_HOST=127.0.0.1               # lokal ohne Docker
#DB_HOST=db                     # lokal mit Docker

# SESSION_DRIVER=database       # lokal mit Docker
SESSION_DRIVER=cookie           # lokal ohne Docker

# MAIL_HOST=mailpit             # lokal mit Docker
MAIL_HOST=127.0.0.1             # lokal ohne Docker
```

Die Einstellung kann geändert werden um einem Test Team einen fixen Stand im Docker Container auszuliefern. Dieses Szenraio existiert aktuell nicht.

# phpmyadmin im browser

## ui

phpmyadmin url

<http://localhost:8080/>

## db login

user und login für phpmyadmin

```yml docker-compose.yml
DB_USERNAME=laravel
DB_PASSWORD=secret # standard password
```

## mailpit

url

<http://localhost:8025/>

FYI: damit die mails (notifications in php) abgearbeitet werden können muss der laravle queue aktic sein.

```bash
cd backend
php artisan queue:work
```

# frontend Einstellungen

host musss umbenannt werde, zuvor war der Rechner/Machine eingetrage mit 127.0.0.1. Auf 0.0.0.0 umstellen, damit container als auch machine und container ansgesprochen werden können.

## vite.config

Einstellung des host und des ports

```ts
server: {
  host: '0.0.0.0', // <- wichtig, sonst nur localhost erreichbar
  port: 5173,
  strictPort: true, // verhindert automatisches Hochzählen des Ports
  // ...
},
```

url im browser
<http://localhost:5173/>

# Cheatsheet: Interaktion mit Inhalten von containern (wird nicht genutzt zu umständlich)

Es flexibler und simpler mit dem cheatsheet: 'Für Frontend und Backend Entwicklung: db und mailpit zur Verfügun stellen.' zu arbeiten.

## backend

- docker exec: Führt einen Befehl in einem laufenden Container aus.
- -it: Ermöglicht die interaktive Eingabe (-i) und weist ein Pseudo-Terminal zu (-t), damit du das Passwort eingeben kannst.
- laravel_app: Der Name deines Containers.
- php artisan config:clear: der laravel Befehl

```bash
# default set laravel_app
docker exec -it laravel_app php artisan config:clear
docker exec -it laravel_app php artisan cache:clear
docker exec -it laravel_app php artisan config:cache

# provide test data
docker exec -it laravel_app php artisan migrate:fresh --seed
# provide queue for mail
docker exec -it laravel_app php artisan queue:work

# run front tests
docker exec -it vite_frontend npm run test
```

# Alle container services neu bauen 🚀

## docker-compose down

Stoppt alle laufenden Container, die zu deiner Compose-Datei gehören.

Entfernt die gestoppten Container → sie existieren danach nicht mehr.

Netzwerke, die Docker Compose automatisch für die Services erstellt hat, werden ebenfalls gelöscht.

Volumen bleiben standardmäßig erhalten, außer du gibst -v an.

Beispiel: docker-compose down -v → löscht auch alle benutzerdefinierten Volumes (z. B. db_data)

## docker-compose pull

Lädt die neueste Version der Images herunter, die in deiner docker-compose.yml definiert sind.

Ersetzt nicht automatisch laufende Container – es lädt nur die Images.

## docker-compose --profile backend --profile mailpit up -d

docker-compose → startet Container basierend auf deiner docker-compose.yml.

--profile backend --profile mailpit → sagt Docker, welche Profile aktiviert werden sollen.

In deiner Compose-Datei haben viele Services ein Profil:

backend: profiles: [backend]
db: profiles: [backend]
phpmyadmin: profiles: [backend]
mailpit: profiles: [mailpit]
frontend: profiles: [frontend]

Nur Services mit einem aktivierten Profil werden gestartet.

Hier werden alle Services aus backend und mailpit gestartet.

up → Container hochfahren

-d → „detached mode“, d. h. die Container laufen im Hintergrund

### docker-compose --profile backend --profile mailpit up

1. Aktivierte Services:

- backend (Profil backend)
- db (Profil backend)
- phpmyadmin (Profil backend)
- mailpit (Profil mailpit)

2. Nicht aktivierte Services:

- frontend (Profil frontend) → wird nicht gestartet, da das Profil nicht angegeben wurde

3. Abhängigkeiten (depends_on) werden aufgelöst:

- backend hängt von db und mailpit ab
- Jetzt existieren beide Container → backend startet erfolgreich

4. Container laufen im Hintergrund, du kannst Logs ansehen mit:

```bash
docker-compose logs -f
```

# Cheatsheet: einzelne Container entfernen 🚀

## docker ps -a

ps: zeigt laufende container an
-a: zeigt alle container an

### Beispiel Anzeige der container

```bash
CONTAINER ID    IMAGE                   COMMAND                   CREATED           STATUS                   PORTS                                          NAMES
47287c7ce41c    mariadb:10.6            "docker-entrypoint.s…"    15 minutes ago    Up 15 minutes            0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp    mariadb_db
35a0e53b3e87    spa-backend             "docker-php-entrypoi…"    3 hours ago       Exited (0) 2 hours ago                                                  laravel_app
1a98cd111492    phpmyadmin/phpmyadmin   "/docker-entrypoint.…"    4 weeks ago       Up 3 hours               0.0.0.0:8080->80/tcp, [::]:8080->80/tcp        pma
b7ce58d34eba    axllent/mailpit         "/mailpit"                4 weeks ago       Up 3 hours (healthy)     0.0.0.0:1025->1025/tcp, [::]:1025->1025/tcp,   mailpit
                                                                                                             0.0.0.0:8025->8025/tcp, [::]:8025->8025/tcp
d501e26dc198    httpd:latest            "httpd-foreground"        5 weeks ago       Exited (0) 4 weeks ago                                                  apache_server
```

## docker rm <id | name>

rm: entfernt einen container, der muss allerdings benannt sein
<id|name>: entfernt benannten container

### docker rm e729de77d3ec

Beispiel: Dieser Befehl entfernt den backend container mit id e729de77d3ec

### docker rm laravel_app

macht das gleiche

# container mit profile starten. Mit profiles container flexibel ansprechen 🚀

profile Übersicht: backend, frontend und mailpit

```yml
backend: profiles: [backend]
db: profiles: [backend]
phpmyadmin: profiles: [backend]
frontend: profiles: [frontend]
mailpit: profiles: [mailpit]
```

## docker-compose --profile backend --profile mailpit up -d

container backend app (und sql) und mailpit starten. frontend nicht im container starten aber mit 'npm run dev' entwickeln.

```bash
docker-compose --profile backend --profile mailpit up -d
cd frontend
npm run dev
```

## docker compose --profile backend --profile mailpit --profile frontend build frontend

```bash
docker-compose down
docker-compose pull
docker compose --profile backend --profile mailpit --profile frontend build frontend
```

# Cheatsheet

copy & paste Befehle zu Entwicklung mit docker

## Für Tests: Alle services (aktueller branch) neu bauen und in container zur Verfügung stellen

1. docker-compose → das Tool zum Verwalten von Docker-Containern über die Compose-Datei.

--profile backend --profile mailpit → aktiviert nur die Services, die diesen Profilen zugeordnet sind.

2. up -d

up → startet die Container, erstellt sie bei Bedarf neu.

-d → „detached mode“, Container laufen im Hintergrund.

3. Welche Container laufen danach?

Alle Services, die zu den aktivierten Profilen gehören:

backend → laravel_app

db → mariadb_db

phpmyadmin → pma

mailpit → mailpit

Services, die nicht zu diesen Profilen gehören, wie frontend, werden nicht gestartet.

```bash
docker-compose down
docker-compose pull
docker-compose --profile backend --profile mailpit up -d
```

## Für Frontend und Backend Entwicklung: db und mailpit zur Verfügun stellen

--profile backend → aktiviert db + phpmyadmin

--profile mailpit → aktiviert mailpit

up -d db pma mailpit → startet nur diese Services im Hintergrund

```bash
docker-compose --profile backend --profile mailpit up -d db mailpit
cd ../backend
php artisan serve

# neuer tab backend test daten (nur lokale Entwicklung)
php artisan migrate:fresh --seed

# neuer tab zum testen von mail
php artisan queue:work

# neuer tab
cd ../frontend
npm run dev
```
