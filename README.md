# Firmware Fleet Manager

**Enterprise-grade OTA firmware management platform with canary deployments and real-time fleet monitoring.**

A premium firmware fleet management platform for orchestrating OTA updates across device groups with canary deployment support. Built with React, FastAPI, and PostgreSQL—featuring real-time telemetry, rollout monitoring, and a high-end "LumaOS" interface.

![Dashboard](https://github.com/pradyumnakr/Firmware-Fleet-Manager/raw/main/docs/dashboard.png)

## ✨ Features

- **🚀 Canary Deployments**: Test firmware updates on small device groups before full rollout
- **📊 Real-time Monitoring**: Live dashboard with fleet health metrics and deployment status
- **🎯 Targeted Updates**: Deploy to specific device groups (canary, stable, custom segments)
- **📦 Version Management**: Upload, manage, and track firmware releases with changelogs
- **🔍 Device Inventory**: Comprehensive view of all devices with filtering and search
- **⚡ Modern UI**: Premium "LumaOS" interface with glassmorphism and smooth animations
- **🔄 Auto-rollback**: Safety mechanisms for failed deployments
- **📈 Analytics**: Deployment success rates and device health metrics

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS v3** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Python 3.13** - Runtime
- **FastAPI** - Modern async API framework
- **SQLAlchemy** - ORM for database operations
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Database
- **SQLite** (Development) - File-based database
- **PostgreSQL** (Production-ready) - Swap via `DATABASE_URL` env var

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.13+
- **Git**

### Clone Repository
```bash
git clone https://github.com/pradyumnakr/Firmware-Fleet-Manager.git
cd Firmware-Fleet-Manager
```

### Backend Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### Frontend Setup
```bash
# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
source venv/bin/activate
uvicorn backend.main:app --reload
```
The API will be available at **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

### Start Frontend (Terminal 2)
```bash
npm run dev
```
The UI will be available at **http://localhost:5173**

### Seed Sample Data
```bash
curl -X POST http://localhost:8000/seed
```

## 📁 Project Structure

```
Firmware-Fleet-Manager/
├── backend/
│   ├── main.py           # FastAPI application entry
│   ├── database.py       # Database connection
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── logic.py          # Deployment distribution logic
│   └── requirements.txt  # Python dependencies
├── database/
│   └── schema.sql        # SQL schema (PostgreSQL)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx    # Overview page
│   │   ├── Devices.jsx      # Fleet inventory
│   │   ├── Firmware.jsx     # Version management
│   │   └── Deployments.jsx  # Rollout console
│   ├── App.jsx           # Main layout & routing
│   ├── api.js            # Axios configuration
│   └── index.css         # Global styles
├── public/               # Static assets
└── package.json          # Node dependencies
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/devices` | List all devices |
| POST | `/devices` | Register new device |
| GET | `/firmwares` | List firmware versions |
| POST | `/firmwares` | Upload new firmware |
| POST | `/deploy` | Trigger deployment |
| GET | `/stats` | Fleet statistics |
| POST | `/seed` | Seed sample data |

## 🎨 Screenshots

### Dashboard
![Dashboard Overview](./docs/screenshots/dashboard.png)

### Fleet Inventory
![Device Fleet](./docs/screenshots/fleet.png)

### Firmware Management
![Firmware Vault](./docs/screenshots/firmware.png)

### Deployment Console
![Deployment Rollout](./docs/screenshots/deployment.png)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Database (optional - defaults to SQLite)
DATABASE_URL=postgresql://user:password@localhost:5432/fleet_db

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
```

### Switch to PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb fleet_db`
3. Run schema: `psql fleet_db < database/schema.sql`
4. Set `DATABASE_URL` in `.env`
5. Install driver: `pip install psycopg2-binary`

## 🧪 Testing Workflow

1. **Add Devices**: Use `/seed` endpoint or manually create devices
2. **Upload Firmware**: Go to "Firmware" tab, create version (e.g., `v2.0.0`)
3. **Deploy to Canary**: 
   - Navigate to "Deployments"
   - Select firmware version
   - Choose "Canary Group"
   - Click "Initialize Sequence"
4. **Monitor**: Check "Dashboard" for deployment status
5. **View Fleet**: Go to "Fleet" tab to see updated devices

## 🚀 Production Deployment

### Build Frontend
```bash
npm run build
```
Output: `dist/` folder

### Run Production Backend
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Serve Frontend
Use any static file server:
```bash
npx serve dist -p 3000
```

Or deploy to:
- **Vercel** (Frontend)
- **Railway/Render** (Backend)
- **AWS EC2/DigitalOcean** (Full Stack)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pradyumna K R**
- GitHub: [@pradyumnakr](https://github.com/pradyumnakr)

## 🙏 Acknowledgments

- Inspired by modern DevOps practices
- UI design influenced by Linear and Vercel
- Built for Tesla Low Voltage Software Team workflows

---

**⭐ Star this repo if you find it helpful!**
