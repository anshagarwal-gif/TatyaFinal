# Tatya Project - Quick Start Guide

## ✅ Setup Complete!

Your backend is now configured and ready to run. Here's everything you need to know:

---

## 🚀 Starting the Backend

### **Method 1: Double-Click (Easiest)**

Just double-click: **`start-backend.bat`** in the backend folder

### **Method 2: VS Code Terminal**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### **Method 3: PowerShell Script**

```powershell
cd backend
.\start-backend.ps1
```

---

## 📊 Database Configuration

**Database:** MySQL  
**Name:** `tatyaapp`  
**Host:** `localhost:3306`  
**Username:** `root`  
**Password:** `root`

**Configuration File:** `backend/src/main/resources/application.properties`

---

## 🔍 How to Verify Everything is Working

### **1. Check Backend is Running**

- Look for: `Started TatyaApplication in X.XXX seconds`
- Server URL: http://localhost:8080

### **2. Check Database Connection**

- Look for: `HikariPool-1 - Start completed`
- This means database connected successfully!

### **3. Check Tables Were Created**

Open MySQL and run:

```sql
USE tatyaapp;
SHOW TABLES;
```

You should see these tables:

- availability
- booking
- drone
- drone_specification
- notification
- otp
- payment
- user
- vendor

---

## 🌐 Starting the Frontend

```powershell
cd ..  # Go back to TatyaFinal folder
npm run dev
```

Frontend will run on: http://localhost:5173

---

## 📝 Common Tasks

### **Change Database Name**

Edit `application.properties` line 5:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_NEW_NAME
```

### **Change Database Password**

Edit `application.properties` lines 6-7:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### **Insert Sample Data**

After starting backend once, run these SQL scripts:

- `INSERT_QUERIES.sql`
- `INSERT_AVAILABILITY.sql`

---

## 🛠️ Troubleshooting

### **"Communications link failure"**

- MySQL is not running
- Start MySQL service from Services app

### **"Access denied for user"**

- Wrong username/password in `application.properties`
- Check your MySQL credentials

### **"Unknown database 'tatyaapp'"**

- Database doesn't exist
- Create it: `CREATE DATABASE tatyaapp;`

### **Port 8080 already in use**

- Another app is using port 8080
- Change port in `application.properties`: `server.port=8081`

---

## 📞 API Endpoints

Once backend is running, test these:

- **GET** http://localhost:8080/api/drones - List all drones
- **GET** http://localhost:8080/api/bookings - List bookings
- **POST** http://localhost:8080/api/otp/send - Send OTP

---

## ⚡ Quick Commands

```powershell
# Backend
cd backend
.\mvnw.cmd spring-boot:run

# Frontend
npm run dev

# Build backend (creates JAR file)
cd backend
.\mvnw.cmd clean package
```

---

**All set! Your Tatya application is ready to run! 🎉**
