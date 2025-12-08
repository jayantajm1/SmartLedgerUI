# 🚀 Quick Reference - Backend Auto-Detection

## What Changed?
Your Angular app now **automatically detects** which backend port is running!

## Supported Backend Ports
✅ **Port 7257** (HTTPS - Primary)  
✅ **Port 5239** (HTTP - Secondary)  
✅ **Port 26624** (IIS Express)  
✅ **Port 8080** (Docker HTTP)  
✅ **Port 8081** (Docker HTTPS)  

## How to Use

### 1️⃣ Start Backend (Any Way)
```bash
# Option 1: Visual Studio - Press F5
# Option 2: Command line
dotnet run

# Option 3: Docker
docker-compose up
```

### 2️⃣ Start Frontend
```bash
npm start
```

### 3️⃣ Check Connection
Look at **bottom-right corner**:
- 🟢 Green = Connected
- 🔴 Red = Disconnected

## Files Modified
- `src/environments/environment.ts` ← Multiple API URLs
- `src/app/app.config.ts` ← Auto-detection on startup
- `src/app/services/api-config.service.ts` ← Detection logic
- `src/app/components/api-status/` ← Status indicator

## Quick Commands

### Check which backend is detected:
Open browser console (F12):
```javascript
localStorage.getItem('detectedApiUrl')
```

### Reset detection:
```javascript
localStorage.removeItem('detectedApiUrl')
location.reload()
```

### Or click "Refresh" button in status indicator!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Red dot showing | Start your backend |
| Wrong URL detected | Click "Refresh" button |
| Status not showing | Only shows in dev mode |
| CORS errors | Configure CORS in backend |

## Add Custom Port
Edit `src/environments/environment.ts`:
```typescript
apiUrls: [
  'https://localhost:7257',
  'http://localhost:YOUR_PORT',  // Add here
]
```

---

**That's it! Your app will automatically find the backend.** ✨
