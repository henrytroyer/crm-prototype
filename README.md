# CRM Prototype

Volunteer operations dashboard UI prototype (mock data).

## View locally

```bash
cd crm-prototype
npm install
npm run dev
```

Open **http://localhost:5173**

## View on another screen or device

The dev server listens on your network (`host: true` in `vite.config.ts`). After `npm run dev`, the terminal prints two URLs:

```
  Local:   http://localhost:5173/
  Network: http://192.168.x.x:5173/
```

| Where you're viewing | URL to use |
|----------------------|------------|
| Second monitor on the **same Mac** | `http://localhost:5173` |
| Phone, tablet, or another computer on the **same Wi‑Fi** | The **Network** URL from the terminal |

Both devices must stay on the same Wi‑Fi. If the Network URL stops working after sleep, run `npm run dev` again and use the new IP.

### Bookmarking

You can save the URL in your browser. It works **only while** `npm run dev` is running on this Mac. Closing the terminal or shutting down the Mac stops the server — there is no permanent hosted address for local dev.

### macOS firewall

If another device cannot connect, allow incoming connections for Node when macOS prompts you, or check **System Settings → Network → Firewall**.

## Resume tomorrow

Your code is saved in git on this Mac. To pick up where you left off:

```bash
cd crm-prototype
npm run dev
```

Open `http://localhost:5173` (or your saved Network URL on another device).

## What to try

- **Applications** — pipeline stages; click a volunteer row to open the detail slide-over
- **Contacts** — master list with tag filters and detail panel
- **Email templates** — read-only template catalog
- **Forms / Automations** — placeholder pages for now

Mock pipeline: **26 volunteers** across five onboarding stages.

## Share publicly (GitHub Pages)

The prototype is deployed from this repo to **GitHub Pages** so anyone can open a permanent link and interact with the full UI (mock data only — no API keys).

**Live demo:** https://henrytroyer.github.io/crm-prototype/

### Redeploy after changes

Push to `main` on GitHub. The [Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow rebuilds and publishes automatically.

```bash
cd crm-prototype
git add -A
git commit -m "Your change description"
git push origin main
```

The site usually updates within one to two minutes. Check progress under **Actions** on GitHub.

### First-time setup (already done)

1. Repo: [github.com/henrytroyer/crm-prototype](https://github.com/henrytroyer/crm-prototype)
2. **Settings → Pages → Build and deployment:** GitHub Actions
3. Production builds set `GITHUB_PAGES=true` so asset paths use `/crm-prototype/`

### What reviewers can use

| Area | What works |
|------|------------|
| Applications | Pipeline, filters, volunteer detail, email modal, form drill-down |
| Contacts | Tag filters, detail panel, term overlay, donations, email thread |
| Recruitment | Prospect list and detail |
| Email templates | Read-only catalog |

No login required. Anyone with the URL can explore the demo.

## Related project

The monday.com Board View app lives at `Documents/Monday/monday` (port **4040**). See `docs/crm-local-dev.md` there for mock mode and live board setup.
