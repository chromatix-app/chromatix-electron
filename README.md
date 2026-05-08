# Chromatix - Electron Wrapper<!-- omit in toc -->

Chromatix is a desktop music player for Plex, that transforms your listening experience and makes interacting with your music libraries a joy.

Get started at [https://chromatix.app/](https://chromatix.app/)

This is a simple Electron wrapper for the Chromatix web app, used to create a desktop app that can be run on macOS and Windows.

This repo does not contain source code for the Chromatix web app itself - that is a separate repo which can be found [here](https://github.com/chromatix-app/chromatix-app).

# Table of Contents<!-- omit in toc -->

- [1. Installation](#1-installation)
- [2. Running locally](#2-running-locally)
- [3. Building (quick dev build)](#3-building-quick-dev-build)
- [4. Building (proper build + signing / notorization)](#4-building-proper-build--signing--notorization)
  - [4.1. Prerequisites](#41-prerequisites)
  - [4.2. Entitlements](#42-entitlements)
- [5. Build and ship to GitHub](#5-build-and-ship-to-github)
- [6. Troubleshooting](#6-troubleshooting)
- [7. Use of AI](#7-use-of-ai)
- [8. To Do](#8-to-do)
  - [8.1. Linux Builds](#81-linux-builds)
  - [8.2. Scale Window Controls](#82-scale-window-controls)
  - [8.3. Better Offline Handling](#83-better-offline-handling)
- [9. Contributing](#9-contributing)

# 1. Installation

```bash
npm install
```

# 2. Running locally

```bash
npm start
```

# 3. Building (quick dev build)

```bash
npm run draft-xxxx
```

(See package.json for available dev scripts.)

# 4. Building (proper build + signing / notorization)

```bash
npm run build-xxxx
```

(See package.json for available build scripts.)

## 4.1. Prerequisites

Notorization for macOS can only be completed on a Mac, and requires a valid Apple Developer account, development team, and app-specific password.

A provisioning profile must be created and installed on the build machine.

Environment variables must also be set: please see `.env.sample` for the required variables.

## 4.2. Entitlements

The `entitlements` folder contains the required entitlements for the app to run on macOS.

These may not be populated 100% correctly, but took a lot of trial and error to get something that worked.

# 5. Build and ship to GitHub

```bash
npm run ship-xxxx
```

(See package.json for available ship scripts.)

> [!NOTE]
> The steps and requirements in section 4 [section 4](#4-building-proper-build--signing--notorization) apply to this section as well.

# 6. Troubleshooting

If there is a problem deploying to GitHub, check that your GitHub token is valid.

# 7. Use of AI

AI is an obviously common but controversial tool in software development right now. After years of building websites and web apps by hand, and over a year of building and maintaining Chromatix manually, I do now use [GitHub Copilot](https://github.com/features/copilot) and I want to be transparent about that.

I have no interest in AI slop. All AI-assisted code is manually reviewed before it's committed. AI can be wrong, inconsistent, and confidently incorrect, so I treat it as a tool that needs oversight rather than a source of truth.

In practice, I use it for various tasks throughout the codebase. A `.github/copilot-instructions.md` file is included in this repo, which documents project conventions and guides Copilot towards consistent output.

I also use GitHub Copilot code review, which has been useful for catching minor mistakes and oversights that are easy to miss in a manual review.

I appreciate that some people have strong feelings about AI in open source projects. I respect that, and I try to use it carefully and responsibly.

# 8. To Do

## 8.1. Linux Builds

Linux builds need to be setup, tested and enabled.

## 8.2. Scale Window Controls

I need to scale/reposition the macOS window controls proportionally with the main app, when using ⌘+ or ⌘- to zoom in and out.

This is so that they stay in line with the forwards / back buttons.

## 8.3. Better Offline Handling

If the app is opened when offline, it should keep re-checking for an internet connection every 5 seconds, but I'm not sure this is working properly.

# 9. Contributing

Please refer to the readme file in the [primary web app repo](https://github.com/chromatix-app/chromatix-app) for more information on contributing to Chromatix.
