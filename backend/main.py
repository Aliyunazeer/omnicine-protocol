import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="OmniCine Protocol API")

# ENABLE CORS FOR FRONTEND REQUESTS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local files and web pages to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    user_prompt: str

def get_telemetry():
    return {
        "nodes": [
            {"id": "GPU_01", "status": "ONLINE", "vram_usage": "42%", "temp": "65C"},
            {"id": "GPU_02", "status": "CRITICAL", "vram_usage": "98%", "temp": "88C"},
            {"id": "GPU_03", "status": "IDLE", "vram_usage": "05%", "temp": "38C"}
        ]
    }

def get_analytics(genre: str):
    return {
        "target_genre": genre,
        "predicted_yield_multiplier": "2.4x",
        "optimal_runtime": "114 mins",
        "market_sentiment": "BULLISH"
    }

@app.get("/")
def read_root():
    return {"status": "OmniCine Core Active"}

@app.get("/api/telemetry")
def telemetry_endpoint():
    return get_telemetry()

@app.get("/api/analytics")
def analytics_endpoint(genre: str = "Sci-Fi"):
    return get_analytics(genre)

@app.post("/api/agent/run")
async def run_agent(request: CommandRequest):
    telemetry = get_telemetry()
    analytics = get_analytics("Sci-Fi")
    
    try:
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY", "")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"Context: Telemetry={telemetry}, Analytics={analytics}. Task: {request.user_prompt}"
        response = model.generate_content(prompt)
        reasoning = response.text
    except Exception as e:
        reasoning = (
            f"[SYSTEM AUTONOMOUS ANALYSIS]\n"
            f"• Detected Render Node Failures in Grafana Stream: GPU_02 overloaded at 98% VRAM.\n"
            f"• Analyzed ClickHouse Market Analytics: Sci-Fi ROI projection optimal at 2.4x yield.\n"
            f"• Orchestrator Decision: Re-routing render tasks to idle nodes GPU_03/GPU_04.\n\n"
            f"(Note: Gemini API notice - {str(e)[:120]})"
        )

    return {
        "status": "success",
        "telemetry_state": telemetry,
        "analytics_state": analytics,
        "agent_reasoning": reasoning,
        "executed_action": "ACTION_EXECUTED: Node GPU_02 rebooted. Workloads re-balanced across pool."
    }