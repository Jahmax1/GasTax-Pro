# GasTax Pro

A full-stack application for tracking gas transactions, calculating taxes, and managing advertisements. Built with Node.js, Express, MongoDB, React, and TailwindCSS.

## Project Structure
- `backend/`: Node.js/Express/MongoDB backend with Socket.IO for real-time transaction updates.
- `frontend/`: React/Vite/TailwindCSS frontend with Chart.js for visualizations and Framer Motion for animations.

## Features
- Three user roles: Customer, Gas Station, and Revenue Authority.
- Real-time transaction tracking via Socket.IO.
- Tax calculation and analytics with Chart.js visualizations.
- Advertisement management for gas stations.
- Customer transaction history and reporting.
- Pagination for large datasets (transactions and reports).
- Secure JWT authentication with rate limiting using `express-rate-limit`.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend