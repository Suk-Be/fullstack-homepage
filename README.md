# Home Page Project 🚀

## Motivation

Meine alte Homepage (siehe [Archivlink 2014](https://web.archive.org/web/20141218065649/http://sokdesign.de/)) stellte vor allem Design-Arbeiten dar.  
Da mein Schwerpunkt heute in der **Programmierung** liegt, habe ich sie 2025 mit einem modernen Tech-Stack neu gebaut und als MVP veröffentlicht.

---

## Features

- 🔐 **Authentifizierung**

  - Session-basiert
  - Google/GitHub OAuth
  - Zugriffskontrolle auf geschützte Bereiche

- 🧩 **Template Engine**

  - Layouts erstellen, speichern, löschen
  - HTML-Export per Klick
  - Validierung gegen doppelte Namen & Konfigurationen

- ⚡ **Single Page App**

  - Stateful Components
  - Schnelle UI ohne kompletten Reload

- 📊 **Tests**

  - ~99% Coverage in Frontend & Backend

- 📦 **Dockerized Services**
  - Separat startbare Container für Frontend, Backend, Mail, DB

---

## Architekturübersicht

```mermaid
graph TD
  A[Frontend (React/Vite)] <--> B[Backend (Laravel)]
  B <--> C[(SQL Database)]
  B --> D[Auth Service]
  B --> E[Mail Service]
```
