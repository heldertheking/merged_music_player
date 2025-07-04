# Music Web UI Integration

## Project Overview

### Description
The **Music Web UI Integration** project is a modern web application designed to provide seamless integration of Spotify and YouTube Music. It aims to unify music playback from these platforms into a single, user-friendly, and highly functional interface, primarily focused on playlist management, music discovery, and media playback.

### Objectives
- Enabling a unified music streaming experience across Spotify and YouTube Music.
- Enhancing user experience through a centralized interface combining both platforms.
- Providing a responsive and aesthetically pleasing user interface.
- Allowing for searchable playlist management and cross-platform integration.
- Ensuring user authentication and account personalization.

## Project Timeline
- **Start Date:** 12 May 2025
- **End Date:** 4 July 2025

## Stakeholders
- **Client:** Berrin Ileri
- **Project Leaders:**
  - Davide D'Andrea
  - Hèlder Oliveira
- **Development Team:**
  - Frontend Developers
  - UI/UX Designers

## Features

- **Music Playback:**
  - Plays music seamlessly via Spotify's and YouTube Music's APIs.
  - Provides play, pause, and other essential media controls.

- **Search Functionality:**
  - Cross-platform music search across Spotify and YouTube libraries.
  - Supports intuitive search by song, album, or artist.

- **Playlist Management:**
  - Cross-platform playlist creation, modification, and deletion.
  - Liking and saving music to personal libraries.

- **User Authentication:**
  - Secure login/logout options with OAuth 2.0 for both Spotify and YouTube.
  - Authenticated access to personalized music libraries.

- **Responsive Design:**
  - Fully responsive and optimized for various devices and screen sizes.

- **API Integration:**
  - Utilizes YouTube Data API and Spotify Web API to power the entire functionality.

---

## Assumptions & Constraints

### Assumptions
- Users have valid Spotify and/or YouTube Music accounts.
- The application operates with a stable internet connection.
- API structures for Spotify and YouTube remain consistent throughout development.

### Constraints
- Daily API usage limits and other restrictions imposed by Spotify and YouTube.
- Legal and licensing restrictions on music playback.
- Browser compatibility (supports only modern browsers).
- Compliance with GDPR and other data protection regulations.

---

## Development Information

### Technical Stack
- **Frontend Framework:** Angular 19.2.0
- **Language:** TypeScript 5.7.2
- **UI Libraries:**
  - Angular Material 19.2.15
  - PrimeNG 19.1.2
- **State Management:** RxJS 7.8.0
- **Database:** IndexedDB for local caching (`idb` 8.0.3)
- **APIs:**
  - Spotify Web API
  - YouTube Data API & YouTube IFrame Player API

### Development Environment
- **Version Control:** Git
- **Node.js & npm:** Required for dependency management and local development.
- **Browser Compatibility:** Chrome, Firefox, Safari, Edge (latest versions).

### Prerequisites
- Install Node.js and npm.
- Obtain API keys for Spotify and YouTube services.

---

## Key API Endpoints

### Authentication
- **Spotify OAuth:** `POST /api/token`
- **YouTube OAuth:** `POST /oauth2/v4/token`

### Search
- **Spotify:** `GET /v1/search?q=QUERY`
- **YouTube:** `GET /youtube/v3/search?part=snippet&q=QUERY&type=video`

### Playlist Management
- **Spotify Playlist Creation:** `POST /v1/users/{user_id}/playlists`
- **YouTube Playlist Creation:** `POST /youtube/v3/playlists`

### Playback Controls
- **Spotify Play/Pause:** `PUT /v1/me/player/play` / `PUT /v1/me/player/pause`
- **YouTube Play/Pause:** YouTube IFrame Player API's `playVideo` / `pauseVideo`

---
