# Installation

Wizard is designed to run entirely locally on your machine. You can install and run Wizard through pre-built standalone binaries, containerized via Docker Compose, or built directly from source.

---

## ⚡ Option 1: Pre-built Binary Packages (Recommended)

No compiler, Go toolchain, or git clone required. Download the pre-packaged zip for your platform:

| Platform | Architecture | Release Package |
|---|---|---|
| **macOS** | Apple Silicon (M1 / M2 / M3 / M4) | [**`Wizard-v1.0.1-darwin-arm64.zip`**](https://github.com/Wizard-AIA/Wizard-w2/releases/latest) |
| **macOS** | Intel x86_64 | [**`Wizard-v1.0.1-darwin-amd64.zip`**](https://github.com/Wizard-AIA/Wizard-w2/releases/latest) |
| **Linux** | x86_64 / amd64 | [**`Wizard-v1.0.1-linux-amd64.zip`**](https://github.com/Wizard-AIA/Wizard-w2/releases/latest) |
| **Linux** | ARM64 / aarch64 | [**`Wizard-v1.0.1-linux-arm64.zip`**](https://github.com/Wizard-AIA/Wizard-w2/releases/latest) |
| **Windows** | x86_64 | [**`Wizard-v1.0.1-windows-amd64.zip`**](https://github.com/Wizard-AIA/Wizard-w2/releases/latest) |

### Quick Start with CLI

1. Extract the downloaded zip file into any folder.
2. In your terminal, initialize and start the service:

```bash
./cli/wizard init       # Checks Python 3.12+/Node 20+ and installs dependencies
./cli/wizard start      # Launches backend + frontend daemon and opens your browser
```

3. Open **http://localhost:3000** in your browser.

---

## 🐳 Option 2: Running with Docker Compose

If you prefer full containerization:

```bash
git clone https://github.com/Wizard-AIA/Wizard-w2.git
cd Wizard-w2
docker compose up --build -d
```

Open **http://localhost:3000**. API documentation is available at **http://localhost:8000/docs**.

### Sandbox Tier Sizing

The sandbox container image ships in three toolkit tiers:

```bash
SANDBOX_TIER=core docker compose up --build -d   # pandas, numpy, pyarrow, duckdb, polars, matplotlib, openpyxl (default)
SANDBOX_TIER=standard docker compose up --build -d   # adds scikit-learn, statsmodels, scipy, seaborn
SANDBOX_TIER=full docker compose up --build -d   # adds survival analysis (lifelines) and geospatial (geopandas)
```

---

## 🛠️ Option 3: Building from Source

To run directly from source without the prebuilt binary:

```bash
git clone https://github.com/Wizard-AIA/Wizard-w2.git
cd Wizard-w2

# Build the CLI binary
cd cli && go build -o wizard ./cmd/wizard && cd ..

# Initialize and start
./cli/wizard init
./cli/wizard start
```

Or run services manually:

```bash
# Terminal 1: Backend
uv pip install -r requirements.txt -r requirements-local.txt
cd backend && uvicorn src.api.api:app --port 8000

# Terminal 2: Frontend
cd frontend && pnpm install && pnpm dev
```

---

## 🧠 Model Setup

You do **not** need to install a model before starting. Once the app is running:
1. Navigate to **/models** in the web interface.
2. Click **Install a model** to download starter models directly within the UI.

If you prefer pulling models via terminal:

```bash
# Recommended models
ollama pull qwen2.5:3b           # Reasoning Manager model
ollama pull qwen2.5-coder:7b     # Python Worker model
ollama pull embeddinggemma       # Semantic RAG embeddings (optional)
```

---

## ⚠️ Platform Notes

### macOS Host Mode & OpenMP
If you run `EXECUTION_BACKEND=host` on macOS and use machine learning packages (`xgboost`, `lightgbm`), install the OpenMP runtime library:

```bash
brew install libomp
```

This is an upstream requirement of compiled OpenMP wheels on macOS.
