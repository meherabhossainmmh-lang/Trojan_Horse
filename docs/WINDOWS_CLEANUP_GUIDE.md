# How to Fix "Access Denied / File in Use" & Launch the App

That error happened because **Python and `uvicorn.exe` are still running in the background on your Windows machine**, which locks the files in the `backend\` folder so Windows won't let you delete them.

---

## 1. Command to Stop Background Python & Delete the Folder

Copy and paste this entire line into your PowerShell window and press Enter:

```powershell
taskkill /F /IM python.exe /T 2>$null; taskkill /F /IM uvicorn.exe /T 2>$null; Start-Sleep -Seconds 2; Remove-Item -Recurse -Force backend
```

*(This cleanly closes any hidden Python/uvicorn background processes, waits 2 seconds for Windows to release file locks, and deletes the `backend` folder).*

---

## 2. Command to Run the Complete Application

Now copy and paste this command inside `C:\Users\USER\Desktop\Trojan_Horse`:

```powershell
npm install; npm run db:push; npm run db:seed; npm run dev
```

---

## Where to Open Your Browser
Once `npm run dev` displays **`Ready in ... ms`**, open your browser and go to:  
👉 **[http://localhost:3000](http://localhost:3000)**

Everything—including your interactive hotspot map, optional citizen reporting, DMB direct dispatch, 3-panel municipal accountability, and emergency SOS—is running live!
