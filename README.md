# Project moved

This repository has been **archived**. The volunteer CRM now lives in a single project:

**https://github.com/henrytroyer/monday**

## Setup for collaborators

See **[COLLABORATOR_SETUP.md](https://github.com/henrytroyer/monday/blob/main/COLLABORATOR_SETUP.md)** in the monday repo.

```bash
git clone https://github.com/henrytroyer/monday.git
cd monday
npm install
npm run setup
# Edit .env for live Monday data
npm run dev:live
```

Open **http://localhost:4040**

The monday repo includes live monday.com board integration (Contacts, Applications, Donations). This crm-prototype repo was a mock-only UI demo and is no longer maintained.
