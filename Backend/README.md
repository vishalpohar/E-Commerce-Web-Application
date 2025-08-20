
---

## 📄 README for **Backend (.NET Core 9 Web API)**  

```markdown
# 🛒 E-Commerce Web Application – Backend (.NET Core 9 Web API)

This is the **backend** of the E-Commerce Web Application, developed using **.NET Core 9 Web API** with **Entity Framework Core (Code-First)** and **SQL Server/MySQL**.  
It provides RESTful APIs for authentication, product management, cart/wishlist, orders, and user profiles.

---

## 🚀 Features
- **OTP-based Authentication** using SMTP (for Login & Registration).
- **Product APIs**: Category-wise browsing, search with pagination, product details.
- **Cart & Wishlist APIs**: Add, remove, and update in real-time.
- **Order Management**: Single-item and multi-item checkout flows.
- **Order History**: Paginated, grouped by Order ID.
- **Profile & Address APIs**: CRUD operations with live updates.
- **CORS & Dependency Injection** for secure and maintainable architecture.

---

## 🛠️ Tech Stack
- **Framework:** .NET Core 9 Web API
- **ORM:** Entity Framework Core (Code-First)
- **Query Language:** LINQ
- **Database:** SQL Server / MySQL
- **Authentication:** SMTP (OTP-based)
- **Architecture:** MVC + RESTful APIs
- **Others:** Dependency Injection, CORS

---

## 📂 Database Schema (Key Entities)
- **User**
- **Product**
- **Cart**
- **Wishlist**
- **Address**
- **Order**
- **OrderDetails** (One `Order` → Many `OrderDetails`)

---

## ⚙️ Installation & Setup
```bash
# Clone the repository
git clone https://github.com/vishalpohar/E-Commerce-Web-Application/Backend.git

cd Backend

# Restore dependencies
dotnet restore

# Apply migrations (Code-First)
dotnet ef database update

# Run the application
dotnet run
