import json
import os
import uuid
from typing import List, Dict
from datetime import datetime

LEADS_FILE = "leads.json"

class JSONStorage:
    def __init__(self):
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(LEADS_FILE):
            with open(LEADS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read_file(self) -> List[Dict]:
        try:
            with open(LEADS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _write_file(self, data: List[Dict]):
        with open(LEADS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def create_lead(self, lead_data: Dict) -> Dict:
        leads = self._read_file()
        
        new_lead = {
            "id": str(uuid.uuid4()),
            "nome": lead_data["nome"],
            "email": lead_data["email"],
            "created_at": datetime.now().isoformat(),
            "ip": lead_data.get("ip")
        }
        
        leads.append(new_lead)
        self._write_file(leads)
        return new_lead

    def get_leads(self) -> List[Dict]:
        return self._read_file()

storage = JSONStorage()
