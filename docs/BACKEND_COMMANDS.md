# Why There is No Separate Backend Command Anymore

In the new project structure (built according to your uploaded **`README.md`**), **Nirapod Path** is a unified **Full-Stack Next.js 14 application with Server Actions**.

### 1. What This Means
* **There is NO separate Python `backend/` folder or `uvicorn` command anymore.**
* Your backend database (Drizzle ORM + Neon Postgres), Server Actions (`/actions/auth.ts`, `/actions/reports.ts`, `/actions/sos.ts`, `/actions/status.ts`), EdgeStore uploads, Pusher realtime alerts, and AI analysis are all built directly into Next.js.
* **Everything runs from ONE single command.**

---

## 2. All Commands You Need (Run inside `Desktop\Trojan_Horse`)

Open PowerShell inside `C:\Users\USER\Desktop\Trojan_Horse` and run:

```powershell
# 1. Install all dependencies
npm install

# 2. BACKEND DATABASE COMMANDS: Push schema and seed demo accounts & reports
npm run db:push
npm run db:seed

# 3. LAUNCH THE FULL PLATFORM (Frontend + Backend Server Actions together):
npm run dev
```

---

## 3. Where is the App Running?

Once you run `npm run dev`, open your browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

* **Frontend UI:** All 3 panels (Citizen Map `/user/map`, Management Panel `/management/1/reports`, City Corp Panel `/city-corp/1/reports`).
* **Backend APIs & Server Actions:** Automatically handled by Next.js at `http://localhost:3000/api/...` and `/actions/...`.
* **Database & Seed Status:** Already seeded with your 7 Role-Based Auth accounts, 8 Bangladesh reports, and active Emergency SOS alerts!
