# PowerShell Instructions with Exact Folder Paths

Whenever you open a PowerShell window on your machine, always check the path shown at your command prompt. Follow the steps below in order.

---

## Step 1: Go to your project folder
**Where to run this:** Any PowerShell window (even when it first opens at `C:\Users\USER`)

```powershell
cd C:\Users\USER\Desktop\Trojan_Horse
```

*(Your PowerShell prompt should now say: `PS C:\Users\USER\Desktop\Trojan_Horse>`)*

---

## Step 2: Stop background Python processes and remove the old `backend` folder
**Where to run this:** Inside `C:\Users\USER\Desktop\Trojan_Horse`

```powershell
taskkill /F /IM python.exe /T 2>$null; taskkill /F /IM uvicorn.exe /T 2>$null; Start-Sleep -Seconds 2; Remove-Item -Recurse -Force backend
```

---

## Step 3: Install dependencies, set up database, and run the app
**Where to run this:** Inside `C:\Users\USER\Desktop\Trojan_Horse`

```powershell
npm install; npm run db:push; npm run db:seed; npm run dev
```

---

## Step 4: Open the App in Your Browser
Once `npm run dev` displays **`Ready in ... ms`**, open your web browser and navigate to:  
👉 **[http://localhost:3000](http://localhost:3000)**

* **To report a hazard or check the map:** Simply use the app immediately (sign-in is optional).
* **To test Hackathon Judging / Official Panels:** Click **`Sign In / Register`** in the top right header and click any button under **"Quick Demo Accounts (1-Click Hackathon Login)"**!
