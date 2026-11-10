---
title: "Reading CS2 and Dota 2 Without Touching the Game"
description: "NODEZERO coaches you from a second monitor using only Valve's Game State Integration: a config file, a local HTTP port, and JSON the game already sends. How the receiver works, what the data can and cannot tell you, and why the limits made the product better."
date: "2026-11-12"
tags: ["rust", "tauri", "typescript", "gaming", "desktop"]
readTime: 7
projects: ["nodezero"]
image: ""
author: "Murat Hüdavendigâr Öncü"
---

<!--
DRAFT, not published. Written from the second-monitor-app repo
(src-tauri/src/gsi.rs, src/cs2Economy.ts, README). Before publishing:
- Read every "I" sentence and rewrite anything that is not how you would say it.
- Check the numbers against the current release (port, throttle, heartbeat,
  economy values, the ~0.2% CPU figure from the README).
- Move this file to content/blog/ to publish.
-->

NODEZERO is a Windows app for your second monitor. While you play Counter-Strike 2 or Dota 2, it shows the next buy, the money you will have next round, rune and Roshan timers, and your own history. It does all of that without reading game memory, injecting anything, or drawing an overlay. The game sends the data to it, because Valve built a way for that.

That way is called Game State Integration, or GSI. This post is about how small it is, how I wired it into a Tauri app, and why its limits ended up shaping the product.

## A config file and a port

GSI is opt-in from the game's side. You drop a file named `gamestate_integration_*.cfg` into the game's config folder, and the game starts posting JSON to the address in that file. For CS2 that folder is `game/csgo/cfg`; Dota 2 uses `game/dota/cfg/gamestate_integration` and also needs the `-gamestateintegration` launch option.

NODEZERO writes the file for you from Setup. The CS2 version looks like this:

```
"NODEZERO"
{
    "uri"        "http://127.0.0.1:47321/"
    "timeout"    "5.0"
    "buffer"     "0.1"
    "throttle"   "0.5"
    "heartbeat"  "10.0"
    "auth"
    {
        "token"  "<random per install>"
    }
    "data"
    {
        "provider"            "1"
        "map"                 "1"
        "map_round_wins"      "1"
        "round"               "1"
        "phase_countdowns"    "1"
        "player_id"           "1"
        "player_state"        "1"
        "player_weapons"      "1"
        "player_match_stats"  "1"
    }
}
```

`throttle` keeps the game from posting more than twice a second. `heartbeat` makes it post at least every 10 seconds even when nothing changes, so a quiet freeze time still looks alive. Dota 2 gets a 30-second heartbeat and a different `data` block: `player`, `hero`, `abilities`, `items`, `events`, and `buildings`.

## The receiver is about 50 lines of Rust

On the app side there is a plain HTTP listener on `127.0.0.1:47321`, built on `tiny_http` and running on its own thread. Every request goes through the same few checks:

1. Anything that is not a `POST` gets a `405`.
2. The body is read with a 2 MB cap.
3. The JSON must carry the install's token in `auth.token`, or the request gets a `401`.
4. `provider.appid` decides whether it is CS2 or Dota 2.
5. The `auth`, `previously`, and `added` sections are dropped before the state goes to the UI.

The token exists because the port is open to every program on the PC. Without it, anything local could post a fake game state. It is generated on first run and stored in the app's data folder, and the same value is written into the config file.

The other thing I learned the hard way: one bad payload must not kill the listener. Each request is handled inside `catch_unwind`, so a panic turns into a `500` for that request and the next one is read as usual. A second monitor that silently goes blank mid-match is worse than one that skips a frame.

## What the game does not tell you

GSI only sends what the player could already see. In CS2 that means your money, your health and armour, your weapons, the score, and the round history. It does not send your teammates' money, and it never sends anything about the other team.

That decided what the economy card can be. The buy advice in NODEZERO is personal. It reads `map.round_wins` to work out your team's loss bonus, then projects your own money for next round if you win or lose. The rules live in one file, `cs2Economy.ts`: $3,250 for a win, $3,500 for an objective win, a loss bonus that starts at $1,400 and goes up by $500 to five levels, $800 extra for T after a plant, and a $16,000 cap. From that it picks one of a few calls: FULL BUY, SAVE, FORCE BUY, KEEP YOUR GUN, SPEND ALL on the last round of a half, PISTOL ROUND, or OVERTIME BUY.

Sometimes the game removes a field. CS2 stopped sending `round_totaldmg` to players, so live ADR now shows N/A, and the real number comes from the match's demo afterwards. I would rather show N/A than a number I cannot back up.

## Fair play as a feature

Because NODEZERO only uses data the game hands to the player, the anti-cheat question has a short answer: nothing is read from memory, and the live screens never show the other team. Enemies appear only in post-match demo analysis.

Some things are still a judgement call. A CS2 bomb timer built from `phase_countdowns` is exact, and reading official GSI data is not a VAC risk. FACEIT and some leagues still forbid second-screen bomb timers, so in NODEZERO it ships off by default, and Setup says why.

## Designed for a one-second glance

A second monitor is read in the middle of a round, not studied. The default layout has three large cards whose colour carries the message: green for go, amber for careful, red for danger. In CS2 those are the buy call, your money with the minimum you will have next round, and your health. The charts are hidden until you switch to the detail layout.

The app also has to stay out of the game's way. It runs at "below normal" Windows priority and uses about 0.2% of total CPU while a game is running.

## What I would tell someone starting with GSI

- Start from the config file. Ask only for the `data` sections you will use; less JSON per post is less to parse and less to get wrong.
- Treat the local port as untrusted. Use the token.
- Keep the listener alive no matter what one payload does.
- Write the game rules down as data in one place. When Valve changes the economy, that is the only file that should change.

NODEZERO is free, and the installer and release notes are on [nodezero.muratoncu.com](https://nodezero.muratoncu.com). The full case study, with the trade-offs I made around privacy and code signing, is at [/work/nodezero](/work/nodezero).
