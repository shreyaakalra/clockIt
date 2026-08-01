# Clock It

**Geofenced shift tracking for care homes and supported accommodations.**

Care workers clock in from verified on-site locations. Managers see who's on shift, where, and for how long, all in real time.

---

## Features

- **Perimeter-checked clock-in** : Staff can only clock in from inside a manager-defined radius around each site (Haversine distance check via browser GPS).
- **Live staff overview** : See who's clocked in right now, where, and since when.
- **Manager analytics** — Average hours per day, clock-ins per day, and total hours per staff member over the last 7 days (Chart.js).
- **Organization & invite codes** : Managers create an org with an auto-generated invite code; care workers join with that code.
- **Auth0 authentication** : Social login / SSO with role-based onboarding and dashboard routing.
- **Shift notes** : Optional notes attached to clock-in and clock-out events.
- **Responsive UI** : Built with Ant Design + Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Ant Design v6 |
| **Auth** | Auth0 Next.js SDK |
| **API** | GraphQL Yoga (single `/api/graphql` endpoint) |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` |
| **Database** | PostgreSQL |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons/Assets** | Next.js Image |

---

## 📁 Project Structure

```
├── app/
│   ├── (manager)/
│   │   ├── layout.tsx          # Manager auth guard + UserProvider
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Manager analytics dashboard
│   │   ├── staff/
│   │   │   └── page.tsx        # Staff list + shift history
│   │   └── settings/
│   │       └── page.tsx        # Invite code + add perimeter
│   ├── dashboard/
│   │   └── page.tsx            # Care worker clock-in/out page
│   ├── onboarding/
│   │   └── page.tsx            # Create or join organization
│   ├── launch/
│   │   └── page.tsx            # Post-login redirect router
│   ├── page.tsx                # Landing page (Hero + Features)
│   ├── layout.tsx              # Root layout (fonts, Antd, theme)
│   └── api/
│       └── graphql/
│           └── route.ts        # GraphQL Yoga server handler
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── ModeCard.tsx
│   ├── CreateOrgForm.tsx
│   ├── JoinOrgForm.tsx
│   └── Header.tsx
├── contexts/
│   └── UserContext.tsx         # Fetches appUser from GraphQL via Auth0 email
├── graphql/
│   ├── schema.ts
│   ├── typeDefs/
│   │   ├── index.ts
│   │   ├── organization.ts
│   │   ├── perimeter.ts
│   │   ├── shift.ts
│   │   └── user.ts
│   ├── resolvers/
│   │   ├── index.ts
│   │   ├── organization.ts
│   │   ├── perimeter.ts
│   │   ├── shift.ts
│   │   └── user.ts
│   └── types.ts
├── lib/
│   ├── auth0.ts                # Auth0 client + onCallback redirect logic
│   └── prisma.ts               # Prisma client singleton with pg adapter
├── config/
│   └── themeConfig.ts          # Ant Design theme tokens
├── generated/prisma/           # Prisma Client (generated output)
├── prisma/
│   └── schema.prisma           # Database schema
└── middleware.ts / proxy.ts    # Auth0 middleware proxy
```

---

## 🗄️ Database Schema

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  MANAGER
  CARE_WORKER
}

model Organization {
  id         Int    @id @default(autoincrement())
  name       String
  inviteCode String @unique

  perimeters Perimeter[]
  users      User[]
}

model Perimeter {
  id        Int      @id @default(autoincrement())
  name      String
  latitude  Float
  longitude Float
  radius    Float
  createdAt DateTime @default(now())

  orgId Int
  org   Organization @relation(fields: [orgId], references: [id])

  shifts Shift[]
  users  User[]

  @@unique([name, orgId])
}

model User {
  id     Int    @id @default(autoincrement())
  authId String @unique
  email  String @unique
  name   String
  role   Role

  organizationId Int
  organization   Organization @relation(fields: [organizationId], references: [id])

  perimeterId Int?
  perimeter   Perimeter? @relation(fields: [perimeterId], references: [id])

  createdAt DateTime @default(now())
  shifts    Shift[]
}

model Shift {
  id Int @id @default(autoincrement())

  userId Int
  user   User @relation(fields: [userId], references: [id])

  perimeterId Int
  perimeter   Perimeter @relation(fields: [perimeterId], references: [id])

  clockInTime      DateTime
  clockInLatitude  Float
  clockInLongitude Float
  clockInNote      String?

  clockOutTime      DateTime?
  clockOutLatitude  Float?
  clockOutLongitude Float?
  clockOutNote      String?

  createdAt DateTime @default(now())
}
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Auth0 account

### 1. Clone & Install

```bash
git clone <repo-url>
cd clock-it
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/clockit?schema=public"

# Auth0
AUTH0_SECRET="<generate-a-32-byte-secret>"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://<your-tenant>.auth0.com"
AUTH0_CLIENT_ID="<your-client-id>"
AUTH0_CLIENT_SECRET="<your-client-secret>"
APP_BASE_URL="http://localhost:3000"
```

### 3. Generate Prisma Client & Migrate

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Authentication Flow

1. User clicks **Sign In** → redirected to Auth0 Universal Login.
2. On callback, `auth0.ts` `onCallback` checks if the `authId` (Auth0 `sub`) exists in the `User` table.
3. **New user** → redirect to `/onboarding` to create or join an organization.
4. **Existing user** → redirect based on role:
   - `MANAGER` → `/manager/dashboard`
   - `CARE_WORKER` → `/dashboard`

---

## Clock-In Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Care Worker │────▶│ Browser GPS API │────▶│ checkPerimeter() │
└─────────────┘     └─────────────────┘     └──────────────────┘
                                                     │
                                                     ▼
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Shift saved │◀────│   clockIn()     │◀────│ Haversine check  │
│  in DB      │     │   mutation      │     │ distance ≤ radius│
└─────────────┘     └─────────────────┘     └──────────────────┘
```

- The browser requests GPS coordinates via `navigator.geolocation.getCurrentPosition()`.
- `checkPerimeter(perimeterId, lat, lng)` calculates Haversine distance against the stored perimeter center.
- If within radius → `clockIn` mutation creates a `Shift` record.
- If outside radius → GraphQL error: *"You are outside the allowed perimeter to clock in."*

---

## GraphQL API

### Queries

| Query | Args | Description |
|-------|------|-------------|
| `getUserInformation(id: Int!)` | `id` | Get user by DB ID |
| `getUserInformationByEmail(email: String!)` | `email` | Get user + shifts by email |
| `usersByOrganization(organizationId: Int!)` | `organizationId` | List care workers in org |
| `organizationById(id: Int!)` | `id` | Get org by ID |
| `organizationByInviteCode(inviteCode: String!)` | `inviteCode` | Get org by invite code |
| `showPerimeter(orgId: Int!)` | `orgId` | List perimeters for org |
| `showShiftDetails(userId: Int!)` | `userId` | List shifts for user |
| `checkPerimeter(perimeterId, latitude, longitude)` | geo coords | Boolean: inside radius? |

### Mutations

| Mutation | Args | Description |
|----------|------|-------------|
| `createOrganization(name: String!)` | `name` | Create org + auto invite code |
| `addPerimeter(name, latitude, longitude, radius, orgId)` | geo + org | Add geofenced site |
| `addNewUser(authId, email, name, role, organizationId)` | user data | Register user in DB |
| `clockIn(userId, perimeterId, clockInLatitude, clockInLongitude, clockInNote)` | geo + note | Start shift |
| `clockOut(shiftId, clockOutLatitude, clockOutLongitude, clockOutNote)` | geo + note | End shift |

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **MANAGER** | Create org, add perimeters, view invite code, see analytics dashboard, view all staff & shift history |
| **CARE_WORKER** | Join org via invite code, clock in/out (geofenced), view personal shift history |

---

## Dev Dependencies

```

 "dependencies": {
    "@ant-design/nextjs-registry": "^1.3.0",
    "@auth0/nextjs-auth0": "^4.26.0",
    "@prisma/adapter-pg": "^7.9.1",
    "@prisma/client": "^7.9.1",
    "antd": "^6.5.2",
    "chart.js": "^4.5.1",
    "dotenv": "^17.4.2",
    "graphql": "^16.14.2",
    "graphql-tag": "^2.12.7",
    "graphql-yoga": "^5.21.2",
    "nanoid": "^6.0.0",
    "next": "16.2.12",
    "pg": "^8.22.0",
    "react": "19.2.4",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/pg": "^8.20.0",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "prisma": "^7.9.1",
    "tailwindcss": "^4",
    "tsx": "^4.23.1",
    "typescript": "^5"
  }

```

---

