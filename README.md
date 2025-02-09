# Chromatix - Electron Wrapper

This is a simple wrapper for the Chromatix web app. It uses Electron to create a desktop app that can be run on various platforms.

This repo does not contain source code for the Chromatix web app itself, this is just an Electron wrapper that displays the web app from a remote URL.

## 1.0 Installation

```bash
npm install
```

## 2.0 Running locally

```bash
npm start
```

## 3.0 Building (quick dev build)

```bash
npm run dev-xxxx
```
(See package.json for available dev scripts.)

At the moment, macOS builds will attempt and fail to notorize the app when using the following scripts.

Notorization was intentionally prevented to speed these builds up for development, but I couldn't find a proper way to conditionally prevent it from attempting notorization in the first place.

## 4.0 Building (proper build + signing / notorization)

```bash
npm run build-xxxx
```
(See package.json for available build scripts.)

### 4.1 Prerequisites

Notorization for macOS can only be completed on a Mac, and requires a valid Apple Developer account, development team, and app-specific password.

A provisioning profile must be created and installed on the build machine.

Environment variables must also be set: please see `.env.sample` for the required variables.

### 4.2 Entitlements

The `entitlements` folder contains the required entitlements for the app to run on macOS.

These may not be populated 100% correctly, but took a lot of trial and error to get something that worked.

## 5.0 Build and ship to GitHub

```bash
npm run ship-xxxx
```
(See package.json for available ship scripts.)

> Please refer to the notes in section 4.0 about prerequisites and environment variables.

## 6.0 Troubleshooting

If there is a problem deploying to GitHub, check that your GitHub token is valid.

## 7.0 To Do

### A) Config Tidying

The biggest to do for me right now in terms of code tidying is moving all of the Electron config out of package.json and into js config files for different environments.

I found quite a nice example of this on another open source project [here](https://github.com/mockoon/mockoon/tree/main/packages/desktop/build-configs).

### B) Scale Window Controls

I need to scale/reposition the macOS window controls proportionally with the main app, when using ⌘+ or ⌘- to zoom in and out.

So that they stay in line with the forwards / back buttons.

Ideally using .env files instead of the

### C) Better Offline Handling

If the app is opened when offline, it should keep re-checking for an internet connection every 5 seconds, but I'm not sure this is working properly.
