# 🚀 PORTO PORTFOLIO - QUICK SETUP (5 MINUTES)

## Prerequisites Check
```bash
php -v          # Should be 8.2+
node -v         # Should be 16+
npm -v          # Should be 8+
composer -v     # Should be installed
```

## Step 1: Backend Setup (2 min)

```bash
cd backend

# Generate APP_KEY
php artisan key:generate

# Create database and run migrations
php artisan migrate

# Create admin user
php artisan tinker
>>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password')])
>>> exit
```

## Step 2: Start Servers (Terminal 1 & 2)

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```
Output: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```
Output: `http://localhost:5173`

## Step 3: Test the App

1. **Portfolio View:** http://localhost:5173
   - See all sections
   - Submit message in guestbook

2. **Admin Login:** http://localhost:5173/login
   - Email: `admin@example.com`
   - Password: `password`

3. **Admin Dashboard:** http://localhost:5173/admin
   - Manage all portfolio content
   - CRUD for Skills, Achievements, Education

---

## 🔑 Key Files Modified/Created

### Fixed/Updated:
- ✅ `frontend/src/App.jsx` - Added React Router configuration
- ✅ `frontend/src/main.jsx` - Wrapped with AuthProvider
- ✅ `frontend/src/pages/admin/AdminLayout.jsx` - Created admin dashboard layout

### Already Complete:
- ✅ Backend API (all controllers, models, migrations)
- ✅ Frontend Components (all sections, pages, context)
- ✅ Database Schema (all 10 tables)
- ✅ Authentication (Sanctum + CSRF)
- ✅ CORS Configuration

---

## 🆘 Common Issues

### "Cannot find module" errors
```bash
cd frontend
npm install
```

### Database errors
```bash
cd backend
php artisan migrate:fresh  # Reset database
```

### Port already in use
```bash
# Change frontend port
npm run dev -- --port 3000

# Or change backend port
php artisan serve --port 8001
# Then update VITE_API_URL in frontend/.env
```

### Login not working
1. Check admin user exists: `php artisan tinker` → `User::all()`
2. Clear Laravel cache: `php artisan cache:clear`
3. Check CSRF cookie: Open DevTools, go to Application/Cookies, look for `XSRF-TOKEN`

---

## 📱 Responsive Admin Dashboard

- Desktop: Full sidebar navigation
- Mobile: Hamburger menu (click top-left button)
- All screens: Logout button in bottom of sidebar

---

## 🎯 Next Time Running the Project

```bash
# Terminal 1
cd backend && php artisan serve

# Terminal 2
cd frontend && npm run dev

# Then visit http://localhost:5173
```

---

**That's it! Your portfolio is ready to use.** 🎉

For detailed information, see `PROJECT_SETUP_GUIDE.md`
