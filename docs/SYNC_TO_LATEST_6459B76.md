# Why You Are Seeing 404 (You Were at Commit `12b873d`, Latest is `6459b76`)

In your previous terminal screenshot, PowerShell printed:  
`HEAD is now at 12b873d`  

That happened because you ran `git fetch` right before we pushed the newest update! The latest commit on GitHub is **`6459b76`**, which contains the dedicated `/admin/login` portal, `/register` page, `/demo` sandbox, and the Government-Style Navbar.

---

## 1. How to Sync to Commit `6459b76` Right Now

In your PowerShell window, press **`Ctrl + C`** to stop the server, and paste this line inside `C:\Users\USER\Desktop\Trojan_Horse`:

```powershell
git fetch origin; git reset --hard origin/main; Remove-Item -Recurse -Force .next 2>$null; npm run dev
```

### How to Verify It Worked:
Look at what PowerShell prints after running `git reset --hard origin/main`. It should now say:  
👉 **`HEAD is now at 6459b76 docs: document separate citizen and government authority authentication portals`**  
*(Once you see `6459b76`, your laptop has 100% of the new files!)*

---

## 2. After `Ready in ... ms`: Clear Chrome's Cache!

1. Open Chrome and press **`Ctrl + F5`** (or **`Ctrl + Shift + R`**) on **[http://localhost:3000](http://localhost:3000)**!  
   *Notice the new Government Navbar (`Hotspot Map`, `Report Hazard`, `Login` button)! No demo cards anywhere!*
2. Visit 👉 **[http://localhost:3000/login](http://localhost:3000/login)**  
   *Dedicated Citizen Authentication Portal (`/login`) & Registration (`/register`).*
3. Visit 👉 **[http://localhost:3000/admin/login](http://localhost:3000/admin/login)**  
   *Dedicated Official Authority Admin & Super Admin Login Portal.*
4. Visit 👉 **[http://localhost:3000/demo](http://localhost:3000/demo)** *(or `/demo-login`)*  
   *Your Hidden Hackathon Quick-Login Sandbox with all 6 role cards is live!*
