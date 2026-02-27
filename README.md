
## 🏥 **Admin Dashboard README.md** (`maloof-health-admin/README.md`)

```markdown
# 🏥 Maloof Health Systems — Clinical Admin Dashboard

This repository contains the **Clinical Admin Dashboard** for Maloof Health Systems — a powerful control center where healthcare staff can manage appointments, approve bookings, monitor patients, and control medical services visibility.

> **Note:**  
Some email features and certain design elements may look slightly off because no custom domain has been purchased yet.

---

## 🚀 Features

### 📋 **1. Appointment Management**
Admins can:
- View **all patient appointments**
- Sort appointments by date and status
- Filter by medical specialty
- Approve, cancel, or complete appointments in one click
- View detailed appointment information

### 👨‍⚕️ **2. Patient Management**
- Complete patient database
- Track patient communication preferences
- View patient history
- Export patient data to CSV
- Search and filter patients

### 📊 **3. Dashboard Analytics**
Real-time insights including:
- Total appointments
- Pending approvals
- Completed appointments
- Patients seen today
- Appointment trends over time
- Patient satisfaction ratings

### 📧 **4. Email Automation**
When admin updates an appointment:
- System automatically sends confirmation/cancellation emails
- Email includes:
  - Patient name
  - Appointment date
  - Appointment time
  - Doctor/department information

### 👥 **5. Staff Management**
- Manage clinical staff profiles
- Role-based access control:
  - Medical Directors
  - Physicians
  - Nurses
  - Specialists
  - Technicians
- Track staff specialties and credentials
- Invite new team members

### 🏥 **6. Services Management**
- Add/edit medical services
- Manage service availability
- Set pricing and duration
- Assign specialists to services
- Update service descriptions and images

### 🔐 **7. Secure Admin Authentication**
- Google OAuth
- Email/Password login
- Role-based access (Director vs Clinical Staff)
- Session management
- Audit logging

### 🗄️ **8. MongoDB Integration**
Dashboard fetches:
- Patient appointments
- User accounts
- Staff information
- Medical services
- Real-time database updates

### 🚦 **9. API Endpoints for Admin Control**
Includes routes:
- `/api/dashboard-data`
- `/api/appointments`
- `/api/patients`
- `/api/staff`
- `/api/services`
- `/api/approve/[id]` (approve appointment)
- `/api/auth` (NextAuth)

### 🎨 **10. UI/UX**
Built using:
- **Next.js 15 App Router**
- **Shadcn UI**
- **Tailwind CSS**
- **Framer Motion** animations
- Responsive panels, modals, cards, and tables
- Glassmorphism effects
- Dark mode optimized

---

## 🏗️ How It Was Built

### ⚙️ Tech Stack
- **Next.js 15 (App Router)**
- **TypeScript**
- **Shadcn UI**
- **Tailwind CSS**
- **MongoDB + Mongoose**
- **NextAuth.js**
- **Nodemailer**
- **SWR** (data fetching)
- **Recharts** (analytics)
- **Framer Motion** (animations)

### 🔌 Architecture
- Separate DB connection for admin & patient sides
- Mongoose factory pattern
- Dynamic routes: `/api/appointments/[id]`
- API validation through TypeScript
- Admin-only pages protected using server-side session checks
- Role-based middleware for route protection

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Gmail account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevMaloof/maloof-health-admin.git
   cd maloof-health-admin