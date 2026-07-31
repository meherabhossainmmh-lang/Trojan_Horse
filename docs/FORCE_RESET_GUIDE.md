# Why Your Browser is Still Showing the Old Page & How to Force-Update It

If you are still seeing the old `"1-Click Hackathon Login"` navbar and `404` on `/demo`, it means **Git on your laptop did not overwrite your local files** (or Chrome is caching the old build in `.next\`).

---

## The 1-Line Command to Fix Everything (100% Guarantee)

Go to your PowerShell window, press **`Ctrl + C`** to stop the server, and paste this **exact 1-line command** inside `C:\Users\USER\Desktop\Trojan_Horse`:

```powershell
git fetch origin; git reset --hard origin/main; Remove-Item -Recurse -Force .next 2>$null; npm run dev
```

### What this line does:
1. **`git reset --hard origin/main`** — Forces your laptop files to match GitHub 100% (deletes any old local version).
2. **`Remove-Item -Recurse -Force .next`** — Clears Next.js's hidden build cache so it can't serve old cached pages.
3. **`npm run dev`** — Rebuilds and starts the fresh Government Portal.

---

## After It Starts: Clear Chrome's Cache!

When `Ready in ... ms` appears in PowerShell, open Chrome and:
* Press **`Ctrl + F5`** (or **`Ctrl + Shift + R`**) on **[http://localhost:3000](http://localhost:3000)** to force Chrome to load the new page!
* Now visit 👉 **[http://localhost:3000/demo](http://localhost:3000/demo)** — your 6 Hackathon Quick-Login cards are live!
