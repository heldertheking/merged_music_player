# 🎧 Spotify & YouTube API – Übersicht

## 🔒 API-Limitationen

### **Spotify API**
- **Anfragen pro Sekunde**: Max. 10 pro Client-IP
- **Rate Limit**: Keine offizielle Tagesgrenze, aber individuelle Limits je nach Endpoint
- **Audiozugriff**: Kein direkter Zugriff auf den Audiostream
- **Nur Steuerung möglich**: Play, Pause, Skip über Web Playback SDK
- **OAuth erforderlich**: Zugriff nur mit Nutzerfreigabe

### **YouTube Data API**
- **Quota System**: 10.000 Units pro Tag (Standardkontingent)
- **Beispiel**: 1 Video-Search = 100 Units, 1 Video-Details = 1 Unit
- **Kein Direktstreaming**: Zugriff nur auf Metadaten, keine Audiostreams
- **Download & Scraping verboten**
- **API-Key erforderlich**

---

## 📢 Werbung im Audiostream?

### **Spotify**
- Keine Werbung über API abrufbar
- Werbung wird clientseitig (z. B. in der App) eingeblendet
- API gibt **keinen Zugriff auf Free-User-Werbeslots**

### **YouTube**
- Kein direkter Audiostream über API → keine Werbung enthalten
- Werbung nur über offiziellen YouTube-Player sichtbar
- API liefert nur Metadaten – nicht den Stream selbst

---

## 📌 Sonstiges

- **Musikrechte beachten**: API-Zugriff ≠ Nutzungserlaubnis
- **Verstoß gegen Nutzungsbedingungen** = API-Key kann gesperrt werden
- **Empfohlene Nutzung**:
  - Anzeige von Song-/Video-Metadaten
  - Steuern von Wiedergabe auf autorisierten Geräten
  - Playlist-Integration mit OAuth
- **Alternative Tools**:
  - Spotify Web Playback SDK
  - YouTube IFrame Player API
  - Kein vollwertiger Ersatz für Streaming-Dienste

---

✅ Für Projekte mit legaler API-Nutzung geeignet  
⚠️ Kein Ersatz für vollständige Streaming- oder Downloadfunktionen
