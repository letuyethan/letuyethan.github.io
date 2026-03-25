---
layout: page
title: "Spotify Dashboard: Visualizing My Listening Habits"
description: A Python data pipeline + Tableau dashboard to explore my Spotify listening history.
img:
importance: 8
category: fun
related_publications: false
---

## The Idea

Everyone gets their Spotify Wrapped once a year. But what if you could explore your listening data whenever you want, with interactive filters and custom visualizations?

That's what this project does. I built a **Python data pipeline** that pulls my recent listening history from the Spotify API, transforms it into an analysis-ready dataset, and feeds it into a **Tableau dashboard** where I can explore my music habits interactively.

**Links:** [GitHub repository](https://github.com/letuyethan/spotify_dashboard) | [Live Tableau dashboard](https://public.tableau.com/views/MySpotifyDashboard_17744647533350/Dashboard1)

---

## The Dashboard

<div class="l-page">
  <iframe src="https://public.tableau.com/views/MySpotifyDashboard_17744647533350/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link&:showVizHome=no&:embed=true" width="100%" height="800" frameborder="0" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>
</div>
<div class="caption">
    The interactive Tableau dashboard. Click on any artist or track to filter all charts. Click empty space to reset.
</div>

---

## How It Works

The project has two parts: a **Python pipeline** that extracts and transforms the data, and a **Tableau dashboard** that visualizes it.

### The Data Pipeline

```
Spotify API  →  Python (extract)  →  Python (transform)  →  CSV  →  Tableau
```

**Step 1: Extract** -- The pipeline authenticates with Spotify's OAuth 2.0 and fetches the last 50 recently played tracks via the `/me/player/recently-played` endpoint. For each track, it captures the timestamp, track name, artist, album, duration, and Spotify URI.

```python
# From src/extract.py
results = sp.current_user_recently_played(limit=50)
for item in results["items"]:
    track = item["track"]
    rows.append({
        "played_at": item["played_at"],
        "track_name": track["name"],
        "artist_name": track["artists"][0]["name"],
        "album_name": track["album"]["name"],
        "duration_ms": track["duration_ms"],
    })
```

**Step 2: Transform** -- The raw data is enriched with derived columns that make Tableau analysis easier: date, hour of day, day of week, minutes played, and a per-track listen count.

```python
# From src/transform.py
df["played_date"] = df["played_at"].dt.date
df["played_hour"] = df["played_at"].dt.hour
df["day_of_week"] = df["played_at"].dt.day_name()
df["minutes_played"] = df["duration_ms"] / 60_000
```

**Step 3: Export** -- The final `master_data.csv` is a flat table with one row per listening event, ready for Tableau.

### The Dashboard

The Tableau dashboard has 6 visualizations:

| Chart | What it shows |
|---|---|
| **Top Artists** | Horizontal bar chart of most-played artists |
| **Top Tracks** | Horizontal bar chart of most-played songs |
| **Listening by Hour** | When during the day I listen most |
| **Listening by Day** | Which days of the week I listen most |
| **Timeline** | Listening activity over time |
| **KPI Cards** | Total plays, unique artists, unique tracks, total minutes |

All charts are **cross-filtered**: clicking on an artist in the Top Artists chart filters every other chart to show only that artist's data.

---

## Project Structure

```
spotify-dashboard/
├── src/
│   ├── config.py         # Loads .env credentials, output paths
│   ├── auth.py           # Spotify OAuth 2.0
│   ├── extract.py        # Fetches recently played tracks
│   ├── transform.py      # Adds derived columns, builds master table
│   └── main.py           # Runs the full pipeline
├── output/               # Generated CSV (gitignored)
├── .env.example          # Credential template
├── requirements.txt      # spotipy, pandas, python-dotenv
├── TABLEAU_GUIDE.md      # Step-by-step dashboard building guide
└── README.md
```

---

## Challenges and Lessons Learned

**Spotify API restrictions** -- Since November 2024, Spotify requires the app owner to have a Premium subscription for most API endpoints (`/tracks`, `/artists`, `/audio-features`). This meant I couldn't fetch popularity scores, genres, or audio features (danceability, energy, etc.) with a free account. The pipeline was designed to gracefully handle this: it works with just the `/me/player/recently-played` endpoint, which is still available to free users.

**OAuth in a headless environment** -- The Spotify API requires user authorization via a browser redirect. This works fine when running locally, but can't be automated in a CI/CD pipeline or headless server. The token is cached after the first login, so subsequent runs are automatic.

**50-track limit** -- The recently played endpoint only returns the last 50 tracks. For a more comprehensive analysis, you'd need to request your full listening history through Spotify's privacy data export (which takes up to 30 days to receive).

---

## Skills and Tools

- **Python**: spotipy (Spotify API client), pandas (data manipulation), python-dotenv (credential management)
- **Tableau Public**: interactive dashboard design, cross-filtering, KPI cards
- **API integration**: OAuth 2.0 authentication, rate limiting, error handling
- **Data pipeline design**: modular Python package structure (config, auth, extract, transform)
