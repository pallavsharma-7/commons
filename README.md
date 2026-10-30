# COMMONS — Shared Resources. Better Access.

> College Hackathon Prototype for **"Unlock Underused Equipment and Spaces"**  
> **Repository Owner:** Pallav Sharma ([@pallavsharma-7](https://github.com/pallavsharma-7))  
> **Collaborator:** Anushka  

---

## 🏛️ Project Overview

**COMMONS** connects institutions that own underused equipment, specialized laboratory facilities, and academic spaces with students, research scholars, and eligible peers who need access to them.

Built as an enterprise-grade SaaS resource-management system rather than a generic hackathon landing page, COMMONS features:
- A strict three-part dashboard canvas:
  1. **Narrow vertical left sidebar** (~18% width) with line icons and subtle active indicator.
  2. **Wide central dashboard area** with key metric cards, weekly resource utilization analytics, upcoming activity alerts, recent requisitions, and a functional semicircular booking progress gauge.
  3. **Compact right-side information panel** highlighting cataloged resources.
- Interactive multi-role evaluation switch (Student Researcher, Resource Custodian / Owner, System Administrator).
- Live resource discovery with search, category filtering, and cards/table toggle.
- Detailed resource specifications, booking schedule calendar representations, and custodian ownership profiles.

---

## 🎨 Design System & Visual Specification

Built with a restrained, institutional palette (zero gradients, zero glassmorphism, no neon/purple AI aesthetics):

| Token | Hex Value | Description |
|---|---|---|
| **Primary Green** | `#176B4A` | Brand accent, primary buttons, active badges, gauge |
| **Dark Green** | `#104B36` | Button hover states, active navigation text |
| **Light Green** | `#E7F2EC` | Active navigation pill, subtle badge backgrounds |
| **Outer Background** | `#F3F4F3` | Contained application backdrop |
| **Card Background** | `#FFFFFF` | Content surfaces and cards |
| **Primary Text** | `#202B3C` | High-contrast typography |
| **Secondary Text** | `#858D91` | Labels, subtitles, neutral metadata |
| **Border** | `#E8EBE9` | Thin divider and card borders |

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (configured with COMMONS color tokens)
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React
- **Typography:** Inter (via Google Fonts)

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/pallavsharma-7/commons.git
cd commons

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 📂 Project Architecture

```
src/
├── assets/
├── components/
│   ├── common/
│   │   ├── ActivityItem.tsx     # Standardized audit feed item
│   │   ├── FilterBar.tsx        # Category and availability pill filters
│   │   ├── Logo.tsx             # Hand-coded minimal geometric SVG logo
│   │   ├── SearchBar.tsx        # Global & local search input
│   │   └── StatusBadge.tsx      # Restrained status pill component
│   ├── dashboard/
│   │   ├── AnalyticsCard.tsx    # Weekly Resource Usage bar chart (Mon-Sun)
│   │   ├── MetricCard.tsx       # 4 top dashboard KPI cards
│   │   ├── ProgressGauge.tsx    # Semicircular Booking Overview gauge
│   │   ├── RecentlyAdded.tsx    # 5 sample resources in compact right panel
│   │   ├── RecentRequests.tsx   # Lower left requisition activity
│   │   └── UpcomingActivity.tsx # Milestone alerts & return deadlines
│   ├── layout/
│   │   ├── AppLayout.tsx        # Outer grey background + contained canvas
│   │   ├── Header.tsx           # Institutional header, search, user pill
│   │   └── Sidebar.tsx          # 18% width navigation & role perspective
│   └── resources/
│       ├── RequestModal.tsx     # Access requisition dialog
│       ├── ResourceCard.tsx     # Resource grid card
│       └── ResourceTable.tsx    # Resource data table
├── data/
│   └── mockData.ts              # Realistic institutional datasets & metrics
├── hooks/
│   └── useResources.ts          # Custom resource filtering hook
├── lib/
│   └── utils.ts                 # Styling & date formatting helpers
├── pages/
│   ├── ActivityPage.tsx         # Full campus audit history log
│   ├── AdminDashboardPage.tsx   # Campus-wide governance & department matrix
│   ├── BookingsPage.tsx         # User's active & completed bookings
│   ├── DashboardPage.tsx        # Primary 3-part dashboard screen
│   ├── DiscoverPage.tsx         # Resource catalog search & filters
│   ├── HelpPage.tsx             # Policies, FAQ & coordinator contact
│   ├── OwnerDashboardPage.tsx   # Department custodian approval queue
│   ├── RequestsPage.tsx         # Requisition tracking & review state
│   ├── ResourceDetailPage.tsx   # Specs, schedule & custodian profile
│   └── SettingsPage.tsx         # User profile, RFID tag & role toggle
├── types/
│   └── index.ts                 # Domain TypeScript interfaces
├── App.tsx                      # Route definition & global role state
├── index.css                    # Tailwind directives & base styles
└── main.tsx                     # React DOM entry point
```

---

## 🤝 Integration Notes for Anushka (Part 2)

Welcome to Part 2, Anushka! Here is the clean foundation prepared for your workflow:

1. **State Persistence & Backend / LocalStorage Hookup:**
   - In `src/data/mockData.ts`, mock records are defined according to the domain types in `src/types/index.ts`.
   - You can replace or wrap `sampleBookings` and `recentRequests` with a persistent Zustand, React Context, or API client.

2. **Booking Lifecycle & Approval Workflow:**
   - The UI currently features a `RequestModal` in `src/components/resources/RequestModal.tsx`.
   - In Part 2, connect form submissions to the Custodian queue (`OwnerDashboardPage.tsx`) and the User's `RequestsPage.tsx`.

3. **Status Transitions:**
   - Standardized `BookingStatus` and `ResourceStatus` enums are ready in `src/types/index.ts`.
   - `StatusBadge` in `src/components/common/StatusBadge.tsx` automatically maps any valid status to its compliant palette.
