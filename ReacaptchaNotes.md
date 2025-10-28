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

## recaptcha tresholds

In der env Datei sind für dev, stage und production unterschiedliche Schwellenwerte eingetragen und getestet RECAPTCHA_SCORE_THRESHOLD. Die Schwellenwerte können bei Bedarf angepasst werden.

## recaptcha für die reset-password Route

Die routes ist zeitlich begrenzt verfügbar und per token und Email Versand geschützt. Daher gibt einen ausgeschalteten recaptcha guard. Sollte vermehrter Traffic Misbrauch auf der Route erscheinen dann in der RECAPTCHA_PROTECT_RESET_PASSWORD Variable auf true setzen.
