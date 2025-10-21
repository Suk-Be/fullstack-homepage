# Recaptcha im browser testen

Um das Recaptch im Browser zu testen werden Backend und Mailservice im Docker Containern benötigt.

Dafür Bedarf es Einstellungsänderungen an der env Datei (für lokale Enwicklung) damit die Datenbank, laravel und Mail Service miteinander kommunizeiren können.

## env einstellen

Die Host Namen der db und des mail Services benötigen die Host Namen der docker-compose.yml: db, mailpit. So können Sie miteinander kommunizieren.

```env
DB_HOST=db                  # lokal mit Docker
# DB_HOST=127.0.0.1         # lokal ohne Docker


# Mailpit
MAIL_HOST=mailpit               # lokal mit Docker
# MAIL_HOST=127.0.0.1            # lokal ohne Docker
```

### Frontend lokal, übrige Services in docker laufen lassen

Falls das laravel backend lokal noch läuft, schließen und anschleßend das backend in docker laufen lassen.

Hier folgt eine Anleitung für einen hard reset in docker Containern.

```bash initiale Einrichtung
# root der app
docker-compose --profile backend --profile mailpit down -v # -v löscht auch die volumes falls es fehlerhafte connection zwischen den containern gibt (mail feature konnte nicht mit der db user connencten)
docker-compose --profile backend --profile mailpit up -d
# Wichtig: Laravel cached manchmal die Konfiguration.
docker exec -it laravel_app php artisan config:clear
docker exec -it laravel_app php artisan cache:clear
# db erstellen
docker exec -it laravel_app php artisan migrate:fresh --seed
# mailing queue
docker exec -it laravel_app php artisan queue:work
```

```bash Änderungen im app code anzeigen
docker exec -it laravel_app php artisan config:clear
docker exec -it laravel_app php artisan cache:clear
docker exec -it laravel_app php artisan route:clear
docker exec -it laravel_app php artisan view:clear
```

Das frontend kann lokal ohne Docker laufen.

```bash
# frontend der app
npm run dev
```

## recaptcha tresholds

In der env Datei sind für dev, stage und production unterschiedliche Schwellenwerte eingetragen und getestet RECAPTCHA_SCORE_THRESHOLD. Die Schwellenwerte können bei Bedarf angepasst werden.

## recaptcha für die reset-password Route

Die routes ist zeitlich begrenzt verfügbar und per token und Email Versand geschützt. Daher gibt einen ausgeschalteten recaptcha guard. Sollte vermehrter Traffic Misbrauch auf der Route erscheinen dann in der RECAPTCHA_PROTECT_RESET_PASSWORD Variable auf true setzen.
