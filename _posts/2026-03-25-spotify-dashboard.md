---
layout: distill
title: "Building a Spotify Dashboard: From API to Tableau"
description: How I built a Python data pipeline to fetch my Spotify listening history and visualized it in an interactive Tableau dashboard.
tags: python data-analysis tableau
categories: data-analysis
date: 2026-03-25
featured: false

authors:
  - name: Tuyet-Han LE
    url: "https://letuyethan.github.io"
    affiliations:
      name: University of Orleans

toc:
  - name: The Motivation
  - name: Architecture Overview
  - name: "Step 1: Authentication"
  - name: "Step 2: Extracting the Data"
  - name: "Step 3: Transforming for Tableau"
  - name: Running the Pipeline
  - name: The Spotify API Premium Wall
  - name: Building the Tableau Dashboard
  - name: What I Would Do Differently
---

## The Motivation

Spotify Wrapped comes once a year. But I wanted to explore my listening habits *whenever I wanted* -- which artists I'm gravitating toward this week, what time of day I listen most, whether my taste changes between weekdays and weekends.

So I built a small data project: a **Python pipeline** that pulls my recent listening history from the Spotify API, transforms it into an analysis-ready dataset, and feeds it into a **Tableau dashboard** where I can explore everything interactively.

The full code is on [GitHub](https://github.com/letuyethan/spotify_dashboard), and the live dashboard is on [Tableau Public](https://public.tableau.com/views/MySpotifyDashboard_17744647533350/Dashboard1).

---

## Architecture Overview

The project is intentionally simple -- no databases, no cloud services, just Python scripts and a CSV:

```
Spotify API  →  Python (extract)  →  Python (transform)  →  CSV  →  Tableau
```

The code is organized as a Python package with clear separation of concerns:

```
spotify-dashboard/
├── src/
│   ├── config.py      # Credentials and paths
│   ├── auth.py        # OAuth 2.0 authentication
│   ├── extract.py     # API calls
│   ├── transform.py   # Data enrichment
│   └── main.py        # Pipeline orchestration
├── output/            # Generated CSV (gitignored)
├── .env.example       # Credential template
└── requirements.txt
```

Each module has a single responsibility. If I later want to swap the data source (e.g., use Spotify's full privacy export instead of the API), I only change `extract.py` -- everything else stays the same<d-footnote>This is the Single Responsibility Principle in practice. It's not just academic advice -- when Spotify's API broke on me mid-project, having isolated modules made debugging much faster.</d-footnote>.

---

## Step 1: Authentication

Spotify's API uses **OAuth 2.0** for endpoints that access user data. This is different from simpler API key auth -- it requires a browser-based login flow:

```python
# src/auth.py
from spotipy.oauth2 import SpotifyOAuth

auth_manager = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="user-read-recently-played",
)
sp = spotipy.Spotify(auth_manager=auth_manager)
```

The `scope` parameter is important -- it tells Spotify exactly what data your app wants to access. I only need `user-read-recently-played`, which is the minimum scope for this project.

On the first run, a browser window opens for you to authorize the app. After that, `spotipy` caches the token in a `.cache` file, so subsequent runs are automatic. This is why `.cache` is in `.gitignore` -- it contains your access token.

---

## Step 2: Extracting the Data

The `/me/player/recently-played` endpoint returns the last 50 tracks you listened to. Each item contains the track metadata and a timestamp:

```python
# src/extract.py
results = sp.current_user_recently_played(limit=50)

for item in results["items"]:
    track = item["track"]
    rows.append({
        "played_at": item["played_at"],
        "track_name": track["name"],
        "artist_name": track["artists"][0]["name"],
        "album_name": track["album"]["name"],
        "track_uri": track["uri"],
        "duration_ms": track["duration_ms"],
    })
```

A few design choices worth noting:

**Why `track["artists"][0]` instead of all artists?** Many tracks have multiple artists (features, collaborations). I take only the primary artist to keep the data clean for aggregation. If you grouped by all artists, a song like "It Ain't Me" by Kygo feat. Selena Gomez would appear under both artists, inflating counts.

**Why keep `track_uri`?** The URI is Spotify's unique identifier for a track. Two different versions of the same song (e.g., "Love Story" and "Love Story (Taylor's Version)") have different URIs. This prevents false deduplication.

**Why `duration_ms` instead of the actual time spent listening?** The recently-played endpoint doesn't tell you how long you actually listened -- only what track was playing. The duration is the track's full length, which is the best proxy we have<d-footnote>Spotify's full privacy export includes `ms_played` (actual milliseconds you listened), which would be more accurate. But that data takes up to 30 days to request and receive.</d-footnote>.

---

## Step 3: Transforming for Tableau

Raw timestamps aren't very useful in Tableau. The transform step adds derived columns that enable time-based analysis:

```python
# src/transform.py
df["played_date"] = df["played_at"].dt.date
df["played_hour"] = df["played_at"].dt.hour
df["day_of_week"] = df["played_at"].dt.day_name()
df["minutes_played"] = df["duration_ms"] / 60_000

# How many times each track appears in the dataset
counts = df.groupby("track_uri").size().reset_index(name="listen_count")
df = df.merge(counts, on="track_uri", how="left")
```

**Why not do this in Tableau?** You could -- Tableau has calculated fields. But doing it in Python means the CSV is self-contained. Anyone can open it in Excel, Google Sheets, or any other tool without needing to recreate the calculations. It also makes the Tableau workbook simpler.

**The `listen_count` column** is a denormalization<d-footnote>Denormalization means adding redundant data to avoid repeated computation. Each row stores how many times that track appears in the full dataset. In a normalized design, you'd compute this on the fly. Here, pre-computing it makes Tableau visualizations faster and simpler to build.</d-footnote>. Every row for "Where Is The Love?" by Black Eyed Peas shows `listen_count = 4` because that track appears 4 times in my last 50 plays. This makes it trivial to create a "most played tracks" chart in Tableau.

---

## Running the Pipeline

The entire pipeline runs with one command:

```bash
python -m src.main
```

Output:

```
============================================================
Spotify Recently Played -- Data Pipeline
============================================================

[1/3] Authenticating with Spotify...

[2/3] Fetching recently played tracks...
  Fetched 50 recently played tracks.

[3/3] Building master table...
  Master table: 50 rows, 12 columns.

  Unique tracks:  46
  Unique artists: 36
  Date range:     2026-03-08 to 2026-03-22
  Total minutes:  189.2

============================================================
Done! Output files:
  output/listen_data.csv
  output/master_data.csv
============================================================
```

50 tracks, 36 unique artists, spanning two weeks. Not a huge dataset, but enough to reveal patterns.

---

## The Spotify API Premium Wall

Here's something I didn't expect: **Spotify now requires a Premium subscription for most API endpoints**.

Since November 2024, endpoints like `/audio-features`, `/tracks`, and `/artists` return `403 Forbidden` unless the app owner has Premium. This means I couldn't fetch:

- **Audio features** (danceability, energy, valence, tempo)
- **Track popularity** scores
- **Artist genres**

My original pipeline had enrichment steps for all of these. When they broke, I had two choices:

1. Pay for Premium to unlock the API
2. Redesign the pipeline to work without enrichment

I chose option 2. The recently-played endpoint still works on free accounts, and the data it returns -- track names, artists, albums, timestamps, durations -- is sufficient for a meaningful dashboard. You just can't do genre analysis or audio feature comparisons.

The lesson: **always design data pipelines with graceful degradation in mind**. If an external API changes or breaks, your pipeline should still produce useful output, not crash entirely.

---

## Building the Tableau Dashboard

I built the dashboard in **Tableau Public** (free, browser-based). The layout:

```
┌──────────┬──────────┬──────────┬──────────┐
│  Total   │  Unique  │  Unique  │  Total   │
│  Plays   │  Artists │  Tracks  │  Minutes │
├──────────┴──────────┼──────────┴──────────┤
│   Top Artists       │   Top Tracks        │
├─────────────────────┼─────────────────────┤
│  Listening by Hour  │  Listening by Day   │
├─────────────────────┴─────────────────────┤
│              Timeline                     │
└───────────────────────────────────────────┘
```

The key interactive feature: **cross-filtering**. Clicking on an artist in the Top Artists chart filters every other chart to show only that artist's data. This is set up via Dashboard → Actions → Filter in Tableau.

One gotcha I ran into: Tableau Public in the browser doesn't have a "Number of Records" field like the desktop version. The workaround is creating a calculated field called `Plays` with the formula `1`, then using `SUM(Plays)` as your count measure<d-footnote>This is a common Tableau beginner trap. Tableau Desktop auto-creates "Number of Records" but Tableau Public in the browser does not. The `1` calculated field is the standard workaround.</d-footnote>.

---

## What I Would Do Differently

If I were to extend this project, here's what I'd change:

**Use the full privacy export** instead of the API. Spotify lets you request your complete listening history (every track you've ever played) through their privacy settings. The data includes actual milliseconds played per track, which is much more accurate than using track duration as a proxy. The downside: it takes up to 30 days to receive.

**Add genre analysis.** With a Premium account, the `/artists` endpoint returns genre tags for each artist. This would enable a "What genres do I listen to most?" chart -- arguably the most interesting part of Spotify Wrapped.

**Schedule automatic runs.** Right now the pipeline is manual. A cron job or GitHub Actions workflow could run it daily and append to a growing dataset, giving a much richer picture over time.

**Try an alternative to Tableau.** Tableau Public is powerful but has limitations on Linux (no desktop app). Python alternatives like **Plotly Dash** or **Streamlit** would let me build a fully custom, code-driven dashboard that runs locally.
