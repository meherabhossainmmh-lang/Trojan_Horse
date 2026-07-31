# Why You Got That Error & How to Fix It in 10 Seconds

You received `ERROR: Error loading ASGI app. Could not import module "app.main"` because your laptop still has the old `backend\` folder from before we upgraded the project to the official **Next.js 14 Full-Stack structure** specified in your `README.md`.

When we shaped the project according to your `README.md`, **all backend APIs and database logic were moved directly into Next.js Server Actions (`/actions/` and `/db/`)**. The old Python `backend/` folder is no longer used!

---

## How to Clean Up & Run the Project Now

Copy and paste these commands into your PowerShell window:

### Step 1: Stop `uvicorn` and return to your main folder
1. Press **`Ctrl + C`** in PowerShell to stop the uvicorn error.
2. Go back to your main project directory:
   ```powershell
   cd "$HOME\Desktop\Trojan_Horse"
   ```

### Step 2: Remove the leftover old `backend` folder from your laptop
```powershell
Remove-Item -Recurse -Force backend
```
*(Now your laptop folder matches GitHub 100% cleanly!)*

---

### Step 3: Run the Complete Application (One Command!)

Now you only need to run these Node commands inside `Desktop\Trojan_Horse`:

```powershell
# 1. Install dependencies
npm install

# 2. Push database schema and seed your 7 demo accounts + 8 reports
npm run db:push
npm run db:seed

# 3. START THE FULL PLATFORM (Frontend + Backend together):
npm run dev
```

---

## Where to Open Your Browser
Once `npm run dev` says **`Ready in ... ms`**, open your web browser and go to:  
👉 **[http://localhost:3000](http://localhost:3000)**

Everything—including your interactive hotspot map, optional citizen reporting, DMB direct dispatch, 3-panel municipal accountability, and emergency SOS—is running live!
