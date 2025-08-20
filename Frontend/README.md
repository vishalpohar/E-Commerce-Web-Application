# 🛒 E-Commerce Web Application – Frontend (Angular 19)

This is the **frontend** of the E-Commerce Web Application, built using **Angular 19 with Standalone Components**.  
It provides an interactive, responsive, and user-friendly interface for browsing products, managing cart/wishlist, placing orders, and handling user profiles.

---

## 🚀 Features
- OTP-based **Login & Registration** (via backend API).
- **Reusable Layouts**: Header (logo, search, cart, profile) & Footer.
- **Carousel-based promotions** and category-wise product browsing.
- **Product Search** with "Load More" pagination.
- **Cart & Wishlist** with reactive updates using **RxJS**.
- **Single-item & Multi-item Checkout** flows.
- **Order History** with pagination & grouping by Order ID.
- **Profile & Address Management** with real-time updates.

---

## 🛠️ Tech Stack
- **Framework:** Angular 19 (Standalone Components)
- **State Management:** RxJS (BehaviorSubject, Observables, switchMap, map, tap)
- **Routing & Guards:** RouterLink, navigate, navigateByUrl, AuthGuards
- **UI Styling:** Bootstrap 5, CSS3
- **Storage:** Session Storage (for login/session data)

---

## ⚙️ Installation & Setup
```bash
# Clone the repository
git clone https://github.com/vishalpohar/E-Commerce-Web-Applicatiion/Frontend.git

cd Frontend

# Install dependencies
npm install

# Run the development server
ng serve

