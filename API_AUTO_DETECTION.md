# Backend API Auto-Detection Configuration

## 🎯 Overview

Your Angular frontend now **automatically detects and connects** to whichever backend port is available! No more manual configuration needed.

---

## ✨ What's Been Configured

### 🔍 Automatic Port Detection
The app will automatically try these backend URLs in order:
1. `https://localhost:7257` (HTTPS - Primary)
2. `http://localhost:5239` (HTTP - Secondary)
3. `http://localhost:26624` (IIS Express)
4. `http://localhost:8080` (Docker HTTP)
5. `https://localhost:8081` (Docker HTTPS)

### 📁 Files Created/Updated

1. **`src/environments/environment.ts`** - Development environment with multiple API URLs
2. **`src/environments/environment.prod.ts`** - Production environment configuration
3. **`src/app/services/api-config.service.ts`** - Service to detect available backend
4. **`src/app/components/api-status/api-status.component.ts`** - Visual status indicator
5. **`src/app/app.config.ts`** - Updated to initialize API detection on startup
6. **`src/app/app.component.ts`** - Added API status component
7. **`src/app/app.component.html`** - Added status indicator to UI

---

## 🚀 How It Works

### Startup Process
```
1. App starts
    ↓
2. APP_INITIALIZER runs
    ↓
3. Tries each backend URL in order
    ↓
4. Tests /swagger/index.html endpoint
    ↓
5. First URL that responds = Selected ✅
    ↓
6. All API calls use detected URL
    ↓
7. URL cached in localStorage
```

### Visual Indicator
- **Green dot** = Backend connected
- **Red dot** = Backend disconnected
- Shows current backend URL
- "Refresh" button to re-detect

---

## 🎮 Usage

### 1. Start Your Backend (Any Profile)
```bash
# Using Visual Studio - select any profile:
- http (Port 5239)
- https (Port 7257)
- IIS Express (Port 26624)
- Docker (Port 8080/8081)
```

### 2. Start Angular Frontend
```bash
npm start
```

### 3. Automatic Connection
The app will:
- ✅ Detect which backend is running
- ✅ Connect automatically
- ✅ Show status in bottom-right corner
- ✅ Cache the detected URL

---

## 🔧 Configuration

### Development (Multiple Backends)
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrls: [
    'https://localhost:7257',  // Add/remove URLs as needed
    'http://localhost:5239',
    // Add your custom ports here
  ],
  apiUrl: 'https://localhost:7257', // Default fallback
  apiTimeout: 5000 // Detection timeout (ms)
};
```

### Production (Single Backend)
Edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrls: [
    'https://your-production-api.com'
  ],
  apiUrl: 'https://your-production-api.com',
  apiTimeout: 5000
};
```

---

## 🎨 Visual Status Indicator

### Features
- **Only shows in development** (not in production)
- **Fixed position** - bottom-right corner
- **Live status** - updates automatically
- **Manual refresh** - click to re-detect
- **Shows current URL** - know which backend you're using

### Colors
- 🟢 **Green** = Connected and working
- 🔴 **Red** = No backend detected

### Actions
- Click **"Refresh"** to re-detect backend
- Status updates automatically on startup

---

## 🧪 Testing Different Backends

### Test HTTPS Backend (Port 7257)
1. Start backend with HTTPS profile
2. Start Angular app
3. Should show: "Connected: https://localhost:7257"

### Test HTTP Backend (Port 5239)
1. Stop HTTPS backend
2. Start backend with HTTP profile
3. Refresh Angular app or click "Refresh" button
4. Should show: "Connected: http://localhost:5239"

### Test IIS Express (Port 26624)
1. Start backend with IIS Express profile
2. Refresh Angular app
3. Should show: "Connected: http://localhost:26624"

### Test Docker (Port 8080/8081)
1. Start backend in Docker container
2. Refresh Angular app
3. Should show: "Connected: http://localhost:8080" or "https://localhost:8081"

---

## 🔍 Troubleshooting

### Issue: "API Disconnected" shown
**Causes:**
- Backend not running
- Backend running on different port
- CORS not configured
- Firewall blocking connection

**Solutions:**
1. Make sure backend is running
2. Check backend console for port number
3. Add port to `environment.ts` if not listed
4. Click "Refresh" button
5. Check browser console for errors

### Issue: Wrong backend URL detected
**Solution:**
1. Click "Refresh" button in status indicator
2. Or clear localStorage: `localStorage.removeItem('detectedApiUrl')`
3. Reload page

### Issue: Status indicator not showing
**Reason:** Only shows in development mode
**Solution:** Run `npm start` (not production build)

### Issue: CORS errors
**Solution:** Configure CORS in your .NET backend:
```csharp
// In Program.cs or Startup.cs
services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

app.UseCors("AllowAngular");
```

---

## 📝 How Detection Works

### Detection Process
```typescript
1. Loop through each URL in apiUrls array
2. Try to fetch /swagger/index.html
3. Set 5-second timeout
4. If response status = 200 → Backend found!
5. Cache URL in localStorage
6. Use this URL for all API calls
7. If all fail → Use default apiUrl
```

### Caching Strategy
- Detected URL stored in `localStorage`
- Key: `detectedApiUrl`
- Survives page refreshes
- Cleared on "Refresh" click
- Re-detected on app startup

---

## 🎯 Benefits

✅ **No Manual Configuration** - Automatically finds backend
✅ **Multiple Environments** - Works with any backend profile
✅ **Developer Friendly** - See connection status at a glance
✅ **Fast Switching** - Change backends without code changes
✅ **Cached Detection** - Fast subsequent loads
✅ **Visual Feedback** - Know if backend is connected
✅ **Easy Debugging** - Status indicator helps troubleshoot

---

## 🚀 Advanced Usage

### Add Custom Backend URL
Edit `src/environments/environment.ts`:
```typescript
apiUrls: [
  'https://localhost:7257',
  'http://localhost:5239',
  'http://localhost:3000',  // Add your custom port
  'https://dev.myapi.com'   // Add remote dev server
]
```

### Change Detection Timeout
Edit `src/environments/environment.ts`:
```typescript
apiTimeout: 10000  // 10 seconds instead of 5
```

### Disable Status Indicator
Remove from `app.component.html`:
```html
<!-- Remove this line -->
<app-api-status></app-api-status>
```

### Programmatic Access
Use in any component:
```typescript
constructor(private apiConfig: ApiConfigService) {}

async ngOnInit() {
  const apiUrl = await this.apiConfig.detectApiUrl();
  console.log('Using API:', apiUrl);
}
```

---

## 📊 Port Priority Order

The detection tries URLs in this order:

| Priority | URL | Profile | Use Case |
|----------|-----|---------|----------|
| 1 | https://localhost:7257 | HTTPS | Primary development (secure) |
| 2 | http://localhost:5239 | HTTP | Secondary development |
| 3 | http://localhost:26624 | IIS Express | IIS testing |
| 4 | http://localhost:8080 | Docker HTTP | Container testing |
| 5 | https://localhost:8081 | Docker HTTPS | Container testing (secure) |

---

## 🎉 Summary

Your SmartLedger frontend now:
- ✅ **Auto-detects** available backend on startup
- ✅ **Supports all** .NET launch profiles
- ✅ **Shows visual status** indicator (dev mode only)
- ✅ **Caches detection** for fast reloads
- ✅ **Manual refresh** capability
- ✅ **Production ready** with single URL config

**Just start your backend with ANY profile, and the frontend will find it automatically!** 🚀
