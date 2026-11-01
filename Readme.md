# CLEAN - O · ক্লিন - ও

A web platform for transparent household waste collection in Dhaka: pickup confirmations, fees, e-receipts and complaints in one shared record for residents, caretakers, collectors, zonal officers and service providers.

Built with Next.js (App Router, TypeScript) from the [CLEAN - O Figma file](https://www.figma.com/design/no1CcDsLa0UKE9Q4LuteGF/CLEAN-O). All names, addresses and figures are dummy data.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build` then `npm start`.

## Start here

Open http://localhost:3000 for the landing page. From there:

- **Check your ward** opens the public ward dashboard (no login).
- **Log in** (or a "Continue as …" role card) opens the login screen. Pick a role, enter any 11-digit number starting with `01`, press **Send code**, then type any 6 digits.
- Every signed-in screen has a way out: the avatar menu (**Switch role**, **Log out**) on resident, caretaker and collector screens, and **Log out** in the officer and provider sidebars.

## Screens

| Screen | Route | Role |
| --- | --- | --- |
| Landing page | `/` | Everyone |
| S1 Public ward dashboard | `/wards` (try `/wards?q=17`) | Public |
| S2 Log in | `/login` (preselect a role: `/login?role=collector`) | All |
| S3 Resident dashboard | `/resident` | Resident |
| Resident pickups | `/resident/pickups` | Resident |
| Caretaker dashboard | `/caretaker` | Building caretaker |
| S4 Caretaker pickup log | `/caretaker/pickups` | Building caretaker |
| S5 Report a problem | `/report` (anonymous: `/report?anonymous=1`) | Resident, caretaker, public |
| My reports | `/reports` | Resident, caretaker |
| S6 Report status tracking | `/reports/SC-1042` | Resident, caretaker |
| S7 Digital fee receipt | `/receipts/RC-2610-0412` | Resident, caretaker |
| S8 Collector route (Bangla) | `/collector` | Collector |
| S9 Building check-in (Bangla) | `/collector/check-in/r4-h2?via=qr` | Collector |
| S10 Zonal officer overview | `/officer` | Zonal officer |
| S11 Complaint queue and detail | `/officer/complaints` | Zonal officer |
| S12 Weekly zone report | `/officer/weekly-report` (public copy: `/weekly-report`) | Zonal officer, public |
| S13 Service provider console | `/provider` | Service provider |
| Settings | `/officer/settings`, `/provider/settings` | Officer, provider |

`/how-it-works` links to every screen, grouped by role.

## How it is put together

- `src/components/sds/` – React versions of the Simple Design System (SDS) components the design uses (Button, Tag, Navigation Pill, fields, Notification…), styled with the SDS tokens in `src/app/globals.css`. Icons come from `react-feather` (the SDS icon set).
- `src/data/` – dummy data. Totals are consistent across screens (e.g. Zone 1's 37 open complaints add up per ward on S10, S11 and S12).
- `public/figma/` – logo, status dots and QR code exported from the Figma file.
- Collector check-ins (S8/S9) are saved in the browser's localStorage, so they survive reloads and also update Route 2 on the provider console (S13). Use "ডেমো তথ্য রিসেট করুন" on S8 to reset.
- The role chosen at login is kept in a `cleano_role` cookie (demo only, no real authentication). Pages several roles can reach, such as reports and receipts, show the header for that role. `/logout` clears it.
- Other actions (caretaker confirmation, complaint actions, payments, settings) are kept in page state and reset on reload. There is no backend.
- The বাংলা / EN switch explains that translation is coming. Only the collector screens are in Bangla so far.
