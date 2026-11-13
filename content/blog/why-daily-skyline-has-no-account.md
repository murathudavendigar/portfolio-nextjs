---
title: "Why Daily Skyline has no account"
description: "Daily Skyline has no sign-up and no ads. The puzzle is generated on the device from the date, and even the leaderboard and the streak backup work without a Daily Skyline login."
metaDescription: "Why Daily Skyline has no account: a date-seeded puzzle made on the device, a leaderboard with no sign-up, and a streak backup through the phone."
date: "2026-11-26"
tags: ["react-native", "expo", "product"]
readTime: 4
projects: ["daily-skyline"]
image: ""
author: "Murat Hüdavendigâr Öncü"
---

You can open Daily Skyline and play today's 5×5 skyscraper puzzle straight away. There is no sign-up screen, no email form, no account. The board is just there.

I wanted something closer to Wordle for logic: five minutes, one puzzle per day, the same clues for everyone. A sign-up would fight that. If the session is a coffee or a commute, the first thing you see should be the grid, not a form asking you to create a profile for it.

## The board comes from the date

The puzzle does not need a server either. Daily Skyline generates one 5×5 board per calendar date, on the device. The seed is the date, so two phones that have never talked to each other still produce the same grid, the same clues and the same solution. An iPhone and an Android phone agree because the math says so, not because a puzzle API does.

I wrote about that at more length in [Shipping Daily Skyline to Android](/writing/shipping-daily-skyline-to-android). The short version is enough here: there is no puzzle catalog to host, and no account needed to fetch today's board.

## What still leaves the phone

Not everything stays on the device. Game Center on iOS and Google Play Games on Android are optional, if you want achievements or the store leaderboards.

Since 1 November 2026 there is also a global leaderboard of my own: today's fastest times on each difficulty, an overall board by Skyline Points, and the longest streaks, across iPhone and Android. It still has no sign-up. You get a random name, and you can change it, hide it, or remove yourself from the board in your profile.

The comparison with other players is the piece that has to live somewhere else. I did not want that to require a Daily Skyline login, and it does not.

## Keeping a streak without an account

No account means your progress lives on the phone. So far that has also meant a reinstall can drop a streak. Lower friction beat a cloud account for a daily puzzle, and that risk was part of the trade.

Version 1.32 closes most of that gap without adding a login. The app keeps a recovery key in the platform's own storage, iCloud on iOS and Google's Block Store on Android, which survives a reinstall and follows the same Apple or Google account to a new phone. On first launch it asks whether to bring back your streak and solved days, instead of restoring silently, because families share Apple IDs. Moving between an iPhone and an Android phone takes a recovery code from your profile, because neither platform can see the other's storage.

The streak can also survive a busy day or two. You can hold up to two Streak Freezes at a time, and you earn one for every seven days you keep the streak going. They cover missed days. They do not replace a backup.

## What I refused

Ads, accounts and endless puzzle catalogs all fight the habit I was trying to build. One shared board a day is the product. A feed of puzzles you can binge is a different game, and I did not want a sign-up wall in front of a five-minute grid.

The free game has no ads, and it is the same on iPhone and Android. On iOS there is also an optional Pro upgrade.

## What the constraint bought

Fixing the board to the calendar date, and refusing an account, removed a lot of product arguments I would otherwise still be having. How to sync progress. When to ask for an email. Whether today's puzzle should live behind a server. Even the leaderboard and the backup had to fit around that rule, and both did. The constraint did more than a longer feature list would have. You open the app, today's skyline is there, and you can start.

Daily Skyline is on the App Store and Google Play, in nine languages. There is also a 5×5 tutorial board in the browser, in the [lab](/lab/daily-skyline): it teaches the rules and does not keep a streak, and the shared daily lives in the app. The case study is on the [work page](/work/daily-skyline).
