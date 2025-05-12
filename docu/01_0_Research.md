# YouTube- und Spotify-API-Endpunkte für Musikplayer

## Übersicht

Dieses Dokument enthält die wesentlichen API-Endpunkte, die zum Erstellen eines Musikplayers erforderlich sind, der YouTube und Spotify integriert. Die App unterstützt die Verwaltung von Playlists, die Wiedergabe, die Songsuche, das An- und Abmelden von Benutzern sowie das Liken von Songs.

Die folgende Tabelle gruppiert die Endpunkte nach Kategorien und hebt etwaige Einschränkungen oder Abhängigkeiten hervor (z.B. Autorisierungsanforderungen).

| Kategorie               | YouTube-Endpunkte                                        | Spotify-Endpunkte                                                 |
| ----------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| **Login/Logout**        | `GET /oauth2/v4/token` - OAuth 2.0 Token-Austausch       | `POST /api/token` - OAuth 2.0 Token-Austausch                     |
|                         | Benutzerzustimmung für jede Sitzung erforderlich         | Erfordert Client-ID und Secret, PKCE für Mobile/Web               |
|                         | Scopes: `https://www.googleapis.com/auth/youtube`        | Scopes: `user-library-read`, `playlist-modify-public`, etc.       |
| **Play/Pause**          | YouTube Player API - Methoden `playVideo`, `pauseVideo`  | `PUT /v1/me/player/play`, `PUT /v1/me/player/pause`               |
|                         | Einbetten des YouTube IFrame Players erforderlich        | Erfordert aktives Gerät (eingeloggt über Spotify Connect)         |
| **Suche**               | `GET /youtube/v3/search` - Suche nach Videos             | `GET /v1/search` - Suche nach Titeln, Alben, Künstlern            |
|                         | Durch Kontingent begrenzt (tägliche API-Limits)          | Erfordert `user-read-private` Scope                               |
| **Playlist-Verwaltung** | `POST /youtube/v3/playlists` - Playlist erstellen        | `POST /v1/users/{user_id}/playlists` - Playlist erstellen         |
|                         | `DELETE /youtube/v3/playlists` - Playlist löschen        | `DELETE /v1/playlists/{playlist_id}` - Playlist löschen           |
|                         | `PUT /youtube/v3/playlistItems` - Elemente aktualisieren | `PUT /v1/playlists/{playlist_id}/tracks` - Elemente aktualisieren |
| **Song liken**          | `POST /youtube/v3/videos/rate` - Video liken             | `PUT /v1/me/tracks` - Titel speichern                             |

### Hinweise

* YouTube erfordert das Einbetten des Players zur Steuerung der Wiedergabe, was die Anpassungsmöglichkeiten einschränkt. Die YouTube IFrame Player API ermöglicht die Steuerung von Wiedergabe, Lautstärke und Videostatus.
* Die Spotify-Wiedergabe erfordert ein aktives Gerät, d.h. der Benutzer muss eingeloggt sein und den Spotify-Client auf mindestens einem Gerät aktiv nutzen.
* OAuth-Tokens sind für beide APIs erforderlich, mit unterschiedlichen Scopes je nach gewünschter Aktion.

### Request-Formate

**YouTube Login/Logout:**

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=authorization_code&code=AUTH_CODE&redirect_uri=REDIRECT_URI
```

**Spotify Login/Logout:**

```
POST https://accounts.spotify.com/api/token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=authorization_code&code=AUTH_CODE&redirect_uri=REDIRECT_URI
```

**YouTube Suche:**

```
GET https://www.googleapis.com/youtube/v3/search?part=snippet&q=QUERY&type=video&key=API_KEY
```

**Spotify Suche:**

```
GET https://api.spotify.com/v1/search?q=QUERY&type=track,album,artist&access_token=ACCESS_TOKEN
```

**YouTube Playlist-Erstellung:**

```
POST https://www.googleapis.com/youtube/v3/playlists
Content-Type: application/json

{
  "snippet": {
    "title": "Playlist-Name",
    "description": "Beschreibung",
    "privacyStatus": "public"
  }
}
```

**Spotify Playlist-Erstellung:**

```
POST https://api.spotify.com/v1/users/{user_id}/playlists
Content-Type: application/json
Authorization: Bearer ACCESS_TOKEN

{
  "name": "Playlist-Name",
  "description": "Beschreibung",
  "public": true
}
```

---

## [API Limitations](./01_1_api_limits.md)

---
## Quellen
[Spotify Web API](https://developer.spotify.com/documentation/web-api)  
[YouTube Player Iframe API](https://developers.google.com/youtube/iframe_api_reference)  
[YouTube Data API](https://developers.google.com/youtube/v3/docs)  
