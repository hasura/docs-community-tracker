# Docs Community Tracker

## Overview

This script is designed to aggregate all community-related issues into a single actionable list where we can keep
internal notes and not duplicate our efforts. It works by:

- Fetching new issues and discussions from [specified `hasura` GitHub repos](https://github.com/hasura/docs-community-tracker/blob/main/src/constants.ts#L1-L3)
- Fetching new threads from [selected channels](https://github.com/hasura/docs-community-tracker/blob/main/src/constants.ts#L7-L9) in Discord
- Taking the body of the issue or discussion and parsing it through an OpenAI model to summarize it succinctly
- Performing an ETL job via a service account to log this into a spreadsheet available to everyone in the org

## Usage

Hasura employees can access the file containing the values generated from this script [here](https://docs.google.com/spreadsheets/d/13tgD0IGwQm5W-98fPvEW9pEa28qyvQX8Vc_xUI8SwQM/edit?usp=sharing).

This runs each hour on the hour via a GitHub Action. If you want to run the script locally, follow the steps below.

## Development

### Step 1. Clone the repo

```sh
git clone https://www.github.com/hasura/docs-community-tracker
```

### Step 2. Add a .env

```sh
cd docs-community-tracker && cp .env.example .env
```

Grab the generic values from our 1Password vault by searching for `docs-community-tracker env`.

### Step 3. Create a GitHub PAT with SSO configured

Follow [these steps](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on) with `repo` permissions enabled.

Then, use this value to update the `GH_TOKEN` value in your `.env` file.

### Step 4. Create a development copy of the spreadsheet

We ask that you don't use the "production" spreadsheet for development and testing. Instead, create a copy of the
"production" Google Sheet
and then choose to share it the same users (`service-account@docs-community.iam.gserviceaccount.com` with `Editor` access) as the original.

You can then determine the spreadsheet's `id` by taking everything after `.../d/` and before `/edit...` in the sheet's
URL.

Use this value in your `.env` file instead of the one provided in the vault.

### Step 4. Run the script

Start watch mode:

```sh
npm run dev
```
