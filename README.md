# CraftBid 🎨

<p align="center">
  <img src="UI_CraftBid/public/image.png" alt="CraftBid Login Page" width="800">
</p>

<p align="center">
  <strong>Experience The Souk Modernized</strong>
</p>

<p align="center">
  A modern online auction platform connecting artisans with buyers, built with Laravel and React.
</p>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

CraftBid is a full-stack e-commerce auction platform designed to modernize traditional souk (marketplace) experiences. It enables artisans to showcase and sell their handmade products through online auctions, while buyers can discover unique items and participate in real-time bidding.

### Key Concepts

- **Artisans**: Verified craft makers who can create products and manage auctions
- **Buyers**: Users who browse and bid on auction items
- **Admins**: Platform administrators managing users, categories, and system settings
- **Real-time Bidding**: Live auction updates using Laravel Reverb and WebSockets

## ✨ Features

### For Artisans
- ✅ Product management (create, edit, delete products)
- ✅ Auction creation and management
- ✅ Dashboard with statistics and analytics
- ✅ Revenue tracking and charts
- ✅ Profile verification system
- ✅ ID document upload for verification
- ✅ Withdrawal requests

### For Buyers
- ✅ Browse active auctions
- ✅ Real-time bidding with instant updates
- ✅ Bid history tracking (Winning, Outbid, Won, Lost)
- ✅ Wallet management
- ✅ Transaction history
- ✅ Watchlist functionality

### For Admins
- ✅ User management
- ✅ Category CRUD operations
- ✅ Artisan verification system
- ✅ Product and auction management
- ✅ Withdrawal request approval
- ✅ Financial reports
- ✅ System settings management

### Platform Features
- 🔐 Authentication with email verification
- 🔑 Google OAuth integration
- 💰 Wallet system with bid holds
- 📊 Real-time auction updates
- 🔔 Notification system
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Anti-sniping protection

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Reverb
- **OAuth**: Laravel Socialite (Google)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Laravel Echo + Pusher

### Development Tools
- **Build Tool**: Vite
- **Package Manager**: npm
- **Testing**: Pest PHP
- **Code Quality**: ESLint, Laravel Pint

## 🚀 Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ibrahim-Lmlilas/craft.git
   cd CraftBid
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Storage link**
   ```bash
   php artisan storage:link
   ```

### Frontend Setup

1. **Navigate to UI directory**
   ```bash
   cd UI_CraftBid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create `.env` file in `UI_CraftBid/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

### Running the Application

**Option 1: Run separately**

Backend:
```bash
php artisan serve
php artisan reverb:start
```

Frontend:
```bash
cd UI_CraftBid
npm run dev
```

**Option 2: Run together (recommended)**
```bash
composer dev
```

This will start:
- Laravel server (http://localhost:8000)
- Queue worker
- Laravel Pail (logs)
- Vite dev server (http://localhost:5173)

## ⚙️ Configuration

### Google OAuth Setup

1. Create a Google OAuth application at [Google Cloud Console](https://console.cloud.google.com/)
2. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
   ```

### Database Configuration

Update `.env` with your database credentials:
```env
DB_CONNECTION=sqlite
# Or for MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=craftbid
# DB_USERNAME=root
# DB_PASSWORD=
```

### Reverb Configuration

Configure broadcasting in `.env`:
```env
BROADCAST_DRIVER=reverb
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_HOST=localhost
REVERB_PORT=8080
```

## 📁 Project Structure

```
CraftBid/
├── app/
│   ├── Console/Commands/      # Artisan commands
│   ├── Events/                # Event classes
│   ├── Http/
│   │   ├── Controllers/       # API controllers
│   │   └── Middleware/        # Custom middleware
│   ├── Models/                # Eloquent models
│   ├── Services/              # Business logic services
│   └── Traits/                # Reusable traits
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── routes/
│   └── api.php                # API routes
├── UI_CraftBid/               # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   └── lib/               # Utilities
│   └── public/                # Static assets
└── resources/
    └── views/                 # Blade templates
```

## 🔌 API Documentation

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/auth/google/redirect` - Google OAuth redirect
- `GET /api/auth/google/callback` - Google OAuth callback

### Auctions
- `GET /api/auctions` - List all auctions
- `GET /api/auctions/{id}` - Get auction details
- `POST /api/auctions/{auction}/bids` - Place a bid

### User
- `GET /api/user` - Get authenticated user
- `GET /api/user/verification-status` - Get verification status
- `GET /api/bids` - Get user's bids

### Artisan
- `GET /api/artisan/dashboard/statistics` - Dashboard statistics
- `POST /api/artisan/profile` - Create/update artisan profile

### Admin
- `GET /api/admin/users` - List users
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category

## 👥 User Roles

### Buyer
- Browse auctions
- Place bids
- Manage wallet
- View bid history

### Artisan
- Create products
- Manage auctions
- View dashboard analytics
- Request withdrawals

### Admin
- Manage all users
- Verify artisans
- Manage categories
- Approve withdrawals
- View financial reports

## 🧪 Testing

Run tests with Pest:
```bash
php artisan test
```

## 📝 Seeding

Seed the database with initial data:
```bash
php artisan db:seed
```

This will create:
- Admin user (hakari@gmail.com / BABAmama-123)
- Roles and permissions
- Categories
- System settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👨‍💻 Authors

- **Ibrahim Lmlilas** - [GitHub](https://github.com/Ibrahim-Lmlilas)

## 🙏 Acknowledgments

- Laravel framework
- React community
- All contributors and supporters

---

<p align="center">
  Made with ❤️ for artisans and craft lovers
</p>
