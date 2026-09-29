# Backend (planned)

The prototype runs fully in the browser with demo data. This folder is reserved for a
Python + FastAPI service. Planned endpoints:

- `POST /api/analyze`  - accept a waste image, return the structured analysis
  (`wasteType, category, confidence, condition, recoveryPotential, recommendedAction, reasoning`)
- `POST /api/reports`  - create a report
- `GET  /api/reports`  - list reports
- `PATCH /api/reports/{id}/status` - update status

The frontend talks to the backend only through `src/services/`, so switching from demo
data to a real API means changing the service layer, not the UI.
