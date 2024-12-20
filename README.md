# Docs Community Tracker

## Overview

This script is designed to aggregate all community-related issues into a single actionable list where we can keep
internal notes and not duplicate our efforts. It works by:

- Fetching new issues and discussions from `hasura` GitHub repos
- Taking the body of the issue or discussion and parsing it through an OpenAI model to summarize it succinctly
- Performing an ETL job via a service account to log this into a spreadsheet available to everyone in the org

The hope is to eventually include Discord threads and — if there's value — pipe this into the `hasura/docs-services`
repository for use in the dashboard and with PromptQL.

## Usage

Hasura employees can access the file containing the values generated from this script [here](https://docs.google.com/spreadsheets/d/13tgD0IGwQm5W-98fPvEW9pEa28qyvQX8Vc_xUI8SwQM/edit?usp=sharing).

This runs each day at the following times via a GitHub Action:

- 09:00 AM UTC
- 20:00 PM UTC

If you want to run the script locally, follow these steps:

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

### Step 4. Run the script

You can run the script:

```sh
npm run start
```

## Development

We ask that you don't use the "production" spreadsheet for development and testing. Instead, create a new Google Sheet
and then share it with `service-account@docs-community.iam.gserviceaccount.com` giving it `Editor` access.

You can then determine the spreadsheet's `id` by taking everything after `.../d/` and before `/edit...` in the sheet's
URL.

Use this value in your `.env` file instead of the one provided in the vault.

Follow the steps above but swap the `start` script with watch mode via nodemon:

```sh
npm run dev
```
