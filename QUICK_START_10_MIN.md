# ⏱️ 10-MINUTE QUICK START GUIDE

## 🎯 YOUR MISSION:
Get real token → Update app → Test notifications load

---

## ⏰ TIMELINE

### Minutes 0-2: Find Auth Info
- [ ] Do you have the Auth API endpoint?
- [ ] Do you have username/password?
- [ ] OR just access code `QkbpxH`?

### Minutes 2-5: Get Token via Postman
- [ ] Open Postman
- [ ] Create POST request to Auth API
- [ ] Copy token from response

### Minutes 5-8: Update App
- [ ] Run: `powershell -ExecutionPolicy Bypass -File setup-token.ps1`
- [ ] Paste token when prompted
- [ ] Script automatically updates .env.local

### Minutes 8-10: Test App
- [ ] Run: `npm run dev` (in notification_app_fe folder)
- [ ] Open: `http://localhost:3000`
- [ ] Check if notifications appear!

---

## 🔍 STEP 1: FIND YOUR AUTH API INFO

You need to find ONE of these in your course materials:

### Option A: Auth Endpoint
```
http://20.207.122.201/evaluation-service/auth
OR
http://20.207.122.201/auth
OR
http://20.207.122.201/auth/token
```

### Option B: Login Endpoint
```
http://20.207.122.201/auth/login
OR
http://20.207.122.201/login
```

### Option C: Token Generation
```
http://20.207.122.201/evaluation-service/token
```

Check:
- [ ] Your course syllabus
- [ ] Your instructor's email
- [ ] Assignment document
- [ ] Course portal/LMS
- [ ] README file

---

## 📱 STEP 2: USE POSTMAN (Minutes 2-5)

### Open Postman → New Request

**URL:**
```
[Your Auth Endpoint Here]
```

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (try these in order):**

#### Try #1: Access Code (Most Likely)
```json
{
  "accessCode": "QkbpxH"
}
```
If works → Copy `token` value

#### Try #2: Email/Password
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```
If works → Copy `accessToken` value

#### Try #3: Direct Generate
```json
{
  "code": "QkbpxH"
}
```
If works → Copy whatever long string you get

---

## 🤖 STEP 3: AUTO-UPDATE (Minutes 5-8)

Open PowerShell and run:

```powershell
cd c:\Users\ruchi\OneDrive\Desktop\RA2311003010127
powershell -ExecutionPolicy Bypass -File setup-token.ps1
```

Script will:
1. Ask you to paste token
2. Automatically update .env.local
3. Test if token works
4. Show success/error

---

## 🚀 STEP 4: RUN APP (Minutes 8-10)

Open **NEW PowerShell window**:

```powershell
cd c:\Users\ruchi\OneDrive\Desktop\RA2311003010127\notification_app_fe
npm run dev
```

Wait for:
```
✓ Ready in XXXms
```

---

## 🌐 STEP 5: TEST IN BROWSER (Minute 10)

Open browser and go to:
```
http://localhost:3000
```

### ✅ SUCCESS - You should see:
- App loads
- Notifications appear
- Filter buttons work
- Pagination at bottom

### ❌ ERROR - You see:
- "Failed to load notifications"
- Click **RETRY** button
- Check DevTools Console (F12)

---

## 🔧 MANUAL TOKEN UPDATE (If script doesn't work)

Edit file: `notification_app_fe\.env.local`

Change this line:
```
NEXT_PUBLIC_AUTH_TOKEN=QkbpxH
```

To:
```
NEXT_PUBLIC_AUTH_TOKEN=YOUR_NEW_TOKEN_HERE
```

Then restart dev server.

---

## 📞 IF IT STILL DOESN'T WORK:

1. **Screenshot the Postman response** - Share what token you got
2. **Check these values** - Are they right?
   - Auth API endpoint?
   - Token format?
   - Access code?
3. **Ask your instructor** - Is the API running?
4. **Check Network tab** in DevTools (F12) - What error does it show?

---

## 💾 FILES CREATED FOR YOU:

- `POSTMAN_GUIDE.md` - Detailed Postman instructions
- `setup-token.ps1` - Automated setup script
- This file - 10-minute checklist

---

## ✨ GOOD LUCK! You've got this! 🎉

