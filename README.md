# Chromatix - Electron Wrapper

This is a simple wrapper for the Chromatix web app. It uses Electron to create a desktop app that can be run on various platforms.

This repo does not contain source code for the Chromatix web app itself, this is just an Electron wrapper that displays the web app from a remote URL.

## Installation

`npm install`

## Running locally

`npm start`

## Building

At the moment, macOS builds will attempt and fail to notorize the app when using the following scripts.

Notorization was intentionally prevented to speed these builds up for development, but I couldn't find a proper way to conditionally prevent it from attempting notorization in the first place.

`npm run build-xxxx` (See package.json for available build options)

## Build and sign / notarize

Notorization for macOS can only be completed on a Mac, and requires a valid Apple Developer account, development team, and app-specific password.

A provisioning profile must be created and installed on the build machine.

Environment variables must also be set: please see `.env.sample` for the required variables.

`npm run noto-xxxx` (See package.json for available noto options)

### Entitlements

The `entitlements` folder contains the required entitlements for the app to run on macOS.

These may not be populated 100% correctly, but took a lot of trial and error to get something that worked.

## Build and ship to GitHub

`npm run ship-all`

## Troubleshooting

If there is a problem deploying to GitHub, check that your GitHub token is valid.
