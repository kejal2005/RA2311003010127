# 🔐 POSTMAN GUIDE - GET AUTH TOKEN

## STEP 1: Open Postman
- Launch Postman application
- Sign in or create account (if needed)

## STEP 2: Create New Request
- Click **+ (Plus icon)** at top left
- Select **Request**
- Name it: `Get Auth Token`
- Save to Collection: `My Collection` (or any collection)

## STEP 3: Configure Request

### URL Field:
```
http://20.207.122.201/evaluation-service/auth
```
(Ask instructor if this is wrong)

### Method Dropdown:
Select **POST**

## STEP 4: Set Headers

Click **Headers** tab and add:

| Key | Value |
|-----|-------|
| Content-Type | application/json |

## STEP 5: Add Request Body

Click **Body** tab

Select **raw** radio button

Make sure format dropdown shows **JSON**

Paste ONE of these:

### TRY FIRST: Using Access Code
```json
{
  "accessCode": "QkbpxH"
}
```

### IF ABOVE FAILS: Using Username/Password
```json
{
  "username": "YOUR_USERNAME",
  "password": "YOUR_PASSWORD"
}
```

### IF ABOVE FAILS: Direct Token Generation
```json
{
  "code": "QkbpxH"
}
```

## STEP 6: Send Request

Click **Send** button (blue button on right)

## STEP 7: Read Response

Look at **Response** tab at bottom

### SUCCESS - You'll see:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessToken": "real-token-value",
  "expiresIn": 3600
}
```

**Copy the entire token value** (the long string, not the curly braces)

### ERROR - You'll see:
```json
{
  "error": "Invalid access code",
  "message": "..."
}
```

If you get error:
- Check spelling of access code
- Ask instructor for correct endpoint URL
- Ask if you need username/password instead

## STEP 8: Save Token Somewhere Safe

Right-click in response and **Copy** the token value

Paste it in a text editor temporarily

---

## 🎯 WHAT A VALID TOKEN LOOKS LIKE:

### JWT Token (Starts with eyJ...)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### API Key Token
```
sk_test_51234567890abcdefg
```

### Bearer Token
```
Bearer eyJhbGciOiJIUzI1NiIs...
```

OR just the token part (without "Bearer"):
```
eyJhbGciOiJIUzI1NiIs...
```

---

## ✅ NEXT STEPS AFTER GETTING TOKEN:

1. Copy token from Postman response
2. Tell me the token value
3. I'll update `.env.local`
4. Restart dev server
5. Test app on http://localhost:3000

---

## 🆘 TROUBLESHOOTING IN POSTMAN

| Error | Solution |
|-------|----------|
| `Cannot POST /auth` | Check API endpoint URL |
| `Invalid access code` | Verify access code is correct: `QkbpxH` |
| `401 Unauthorized` | Credentials are wrong, ask instructor |
| `500 Internal Server Error` | API might be down, ask instructor |
| `Connection refused` | API server not running (ask instructor) |

