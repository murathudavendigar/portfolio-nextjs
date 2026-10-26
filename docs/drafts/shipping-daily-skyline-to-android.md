---
title: "Shipping Daily Skyline to Android"
description: "Porting a daily puzzle from iOS to Google Play took less code than I expected and more process. What the date seed saved me, what Google's 14-day closed test caught, and why every version now ships on both stores."
date: "2026-11-02"
tags: ["react-native", "expo", "android", "google-play"]
readTime: 6
image: ""
author: "Murat Hüdavendigâr Öncü"
---

<!--
DRAFT, not published. To publish: check every fact below, edit in your
own voice, then move this file to content/blog/ (the date sets the order).
Facts come from the Daily Skyline repo (docs/roadmap/launches.md,
shipped.md, decisions.md and the archived todo list).
-->

Daily Skyline went live on Google Play on 26 October 2026. It had been on the App Store for a while, and people kept asking the same question in replies: "Android when?" The honest answer was that the code was mostly ready a long time before the store was.

This is what the port actually took.

## The date seed did the hard part

Daily Skyline is one 5×5 skyscraper puzzle per calendar date. The puzzle is generated on the device from a seed, and the seed is the date. Two phones that have never talked to each other produce the same grid, the same clues and the same solution.

I made that choice for iOS, to avoid running a puzzle API. It paid off again on Android: there was nothing to sync, migrate or keep consistent between platforms. An Android player and an iPhone player get the same board on the same day because the math says so, not because a server says so.

The app is Expo and React Native, so the board, the reducer, the streak logic and the archive were already shared. Most of the Android work was in the places where the two platforms are genuinely different.

## Where the platforms actually differ

**Store identity.** Game Center on iOS, Google Play Games on Android. Achievements and boards had to exist twice, and the global leaderboard I built later takes the player's name from whichever one they use.

**Purchases.** The paywall read the App Store's introductory offer to show the free trial. Play describes trials differently, so the first Android builds simply did not show the trial. Small fix, but only visible on a real Android device.

**Backups.** Keeping a streak through a reinstall needs iCloud on iOS and Google's Block Store on Android. Same feature, two native APIs.

None of this is hard. It is just work that does not exist until you ship the second platform, and it is easy to underestimate.

## Google's 14-day rule

The part I did not plan well was the process. A new personal developer account on Google Play cannot go straight to production. You need at least 12 testers in a closed test, kept for 14 consecutive days, and then you apply.

So Android shipped twice: first to a closed test, to a small group of real people I recruited, and only after two weeks to everyone. The closed test opened on 14 October, I applied on 25 October, and access was granted the next day.

I expected those two weeks to be a formality. They were not.

## What the closed test caught

A tester sent a screen recording of the completion screen. It flickered once a second, and the "top %" line was wrong. I fixed it the same day and shipped a new build to the testers.

When I looked closer, the same bug existed on iOS, and on iOS it was worse. The Android test found an iPhone bug that real iPhone players had been seeing. That fix went into the next iOS build too.

The early builds also had a crash that only showed up with testers using the app every day. Sentry caught it, I fixed it, and the next build ran clean while the closed testers were active.

Fourteen days of real people opening the app every morning is a better test than anything I would have scripted for a daily game.

## A rule I did not expect: the address

Google Play shows a personal developer's address on the store listing once the account sells in-app products. I did not want my home address on a puzzle game.

So Pro is hidden on Android for now. It is behind a remote switch, so I can turn it on later without a new build once the account setup allows it. The free game is the same on both platforms.

It is a good reminder that "porting" is not only code. Store rules shape the product.

## One release, two stores

Since version 1.29, every version ships on iOS and Android together, with the same features. No "Android gets it later." That decision changed how I work more than any line of code:

- Every release gets tagged per store build, so I always know which commit is on which store.
- Rollouts are staged on both: iOS phased release over a week, and Android from 20% to 50% to 100% with a clean day between steps. Google's first production release cannot be staged, so that was the only one that went straight to 100%.
- I check new screens on a real Android phone before a build, not after.

## What I would tell myself before starting

1. **Make the core platform-independent first.** The date seed meant the riskiest part of the game needed no Android work at all.
2. **Start the closed test early.** Fourteen days is fixed. Start it when the build is "good enough for testers", not when you think it is finished.
3. **Read the store rules before building store features.** The address rule changed my paywall plan more than any API did.
4. **Treat the second platform as a free QA pass for the first.** The worst bug Android found was an iOS bug.

Daily Skyline is now on [the App Store](https://apps.apple.com/app/id6791111716) and [Google Play](https://play.google.com/store/apps/details?id=com.dailyskyline.app). Same puzzle for everyone, every day, whatever phone they carry. The case study is on the [work page](/work/daily-skyline).
