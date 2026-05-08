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
- [7. To Do](#7-to-do)
  - [7.1. Config Tidying](#71-config-tidying)
  - [7.2. Scale Window Controls](#72-scale-window-controls)
  - [7.3. Better Offline Handling](#73-better-offline-handling)
- [8. Contributing](#8-contributing)

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
npm run dev-xxxx
```

(See package.json for available dev scripts.)

At the moment, macOS builds will attempt and fail to notorize the app when using the following scripts.

Notorization was intentionally prevented to speed these builds up for development, but I couldn't find a proper way to conditionally prevent it from attempting notorization in the first place.

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

# 7. To Do

## 7.1. Config Tidying

The biggest to do for me right now in terms of code tidying is moving all of the Electron config out of package.json and into js config files for different environments.

I found quite a nice example of this on another open source project [here](https://github.com/mockoon/mockoon/tree/main/packages/app/build-configs).

## 7.2. Scale Window Controls

I need to scale/reposition the macOS window controls proportionally with the main app, when using ⌘+ or ⌘- to zoom in and out.

This is so that they stay in line with the forwards / back buttons.

## 7.3. Better Offline Handling

If the app is opened when offline, it should keep re-checking for an internet connection every 5 seconds, but I'm not sure this is working properly.

# 8. Contributing

Please refer to the readme file in the [primary web app repo](https://github.com/chromatix-app/chromatix-app) for more information on contributing to the Chromatix.
