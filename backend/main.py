from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
from pydantic import BaseModel


load_dotenv()

DB_HOST = os.getenv("DATABASE_HOST")
DB_PORT = os.getenv("DATABASE_PORT")
DB_NAME = os.getenv("DATABASE_NAME")
DB_USER = os.getenv("DATABASE_USER")
DB_PASS = os.getenv("DATABASE_PASSWORD")

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, future=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#----------------- Models ----------------

class PersonCreate(BaseModel):
    personid: int
    name: str
    role: str | None = None
    contact: str | None = None
    biometric_data: str | None = None

class PersonUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    contact: str | None = None
    biometric_data: str | None = None


class VisitorBandCreate(BaseModel):
    visit_bandid: int
    issue_date: str | None = None
    expiry_date: str | None = None

class VisitorBandUpdate(BaseModel):
    issue_date: str | None = None
    expiry_date: str | None = None


class VisitorCreate(BaseModel):
    visitorid: int
    host_id: int | None = None
    purpose: str | None = None
    visit_bandid: int | None = None

class VisitorUpdate(BaseModel):
    host_id: int | None = None
    purpose: str | None = None
    visit_bandid: int | None = None


class VehicleCreate(BaseModel):
    license_plate: str
    type: str | None = None
    personid: int | None = None

class VehicleUpdate(BaseModel):
    type: str | None = None
    personid: int | None = None

# ---------------- PERSON CRUD ----------------
@app.get("/person/all")
def get_all_persons():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM person ORDER BY personid;"))
        rows = [dict(r._mapping) for r in result]
    return rows

@app.post("/person/insert")
def add_person(data: PersonCreate):
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO person (personid, name, role, contact, biometric_data)
            VALUES (:personid, :name, :role, :contact, :biometric_data);
        """), data.model_dump())
    return {"message": "Person added successfully."}


@app.put("/person/update/{personid}")
def update_person(personid: int, data: PersonUpdate):
    with engine.begin() as conn:
        conn.execute(text("""
            UPDATE person
            SET name = COALESCE(:name, name),
                role = COALESCE(:role, role),
                contact = COALESCE(:contact, contact),
                biometric_data = COALESCE(:biometric_data, biometric_data)
            WHERE personid = :personid;
        """), {**data.model_dump(), "personid": personid})
    return {"message": "Person updated successfully."}

@app.delete("/person/delete/{personid}")
def delete_person(personid: int):
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM person WHERE personid = :personid"), {"personid": personid})
    return {"message": "Person deleted successfully."}


# ---------------- VISITOR BAND CRUD ----------------
@app.get("/visitor_band/all")
def get_all_bands():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM visitor_band ORDER BY visit_bandid;"))
        rows = [dict(r._mapping) for r in result]
    return rows

@app.post("/visitor_band/insert")
def add_visitor_band(data: VisitorBandCreate):
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO visitor_band (visit_bandid, issue_date, expiry_date)
            VALUES (:visit_bandid, :issue_date, :expiry_date);
        """), data.model_dump())
    return {"message": "Visitor Band added successfully."}


@app.put("/visitor_band/update/{visit_bandid}")
def update_visitor_band(visit_bandid: int, data: VisitorBandUpdate):
    with engine.begin() as conn:
        conn.execute(text("""
            UPDATE visitor_band
            SET issue_date = COALESCE(:issue_date, issue_date),
                expiry_date = COALESCE(:expiry_date, expiry_date)
            WHERE visit_bandid = :visit_bandid;
        """), {**data.model_dump(), "visit_bandid": visit_bandid})
    return {"message": "Visitor Band updated successfully."}

@app.delete("/visitor_band/delete/{visit_bandid}")
def delete_visitor_band(visit_bandid: int):
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM visitor_band WHERE visit_bandid = :visit_bandid"), {"visit_bandid": visit_bandid})
    return {"message": "Visitor Band deleted successfully."}


# ---------------- VISITOR CRUD ----------------
@app.get("/visitor/all")
def get_all_visitors():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM visitor ORDER BY visitorid;"))
        rows = [dict(r._mapping) for r in result]
    return rows

@app.post("/visitor/insert")
def add_visitor(data: VisitorCreate):
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO visitor (visitorid, host_id, purpose, visit_bandid)
            VALUES (:visitorid, :host_id, :purpose, :visit_bandid);
        """), data.model_dump())
    return {"message": "Visitor added successfully."}


@app.put("/visitor/update/{visitorid}")
def update_visitor(visitorid: int, data: VisitorUpdate):
    with engine.begin() as conn:
        conn.execute(text("""
            UPDATE visitor
            SET host_id = COALESCE(:host_id, host_id),
                purpose = COALESCE(:purpose, purpose),
                visit_bandid = COALESCE(:visit_bandid, visit_bandid)
            WHERE visitorid = :visitorid;
        """), {**data.model_dump(), "visitorid": visitorid})
    return {"message": "Visitor updated successfully."}

@app.delete("/visitor/delete/{visitorid}")
def delete_visitor(visitorid: int):
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM visitor WHERE visitorid = :visitorid"), {"visitorid": visitorid})
    return {"message": "Visitor deleted successfully."}


# ---------------- VEHICLE CRUD ----------------
@app.get("/vehicle/all")
def get_all_vehicles():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM vehicle ORDER BY license_plate;"))
        rows = [dict(r._mapping) for r in result]
    return rows

@app.post("/vehicle/insert")
def add_vehicle(data: VehicleCreate):
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO vehicle (license_plate, type, personid)
            VALUES (:license_plate, :type, :personid);
        """), data.model_dump())
    return {"message": "Vehicle added successfully."}


@app.put("/vehicle/update/{license_plate}")
def update_vehicle(license_plate: str, data: VehicleUpdate):
    with engine.begin() as conn:
        conn.execute(text("""
            UPDATE vehicle
            SET type = COALESCE(:type, type),
                personid = COALESCE(:personid, personid)
            WHERE license_plate = :license_plate;
        """), {**data.model_dump(), "license_plate": license_plate})
    return {"message": "Vehicle updated successfully."}

@app.delete("/vehicle/delete/{license_plate}")
def delete_vehicle(license_plate: str):
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM vehicle WHERE license_plate = :license_plate"), {"license_plate": license_plate})
    return {"message": "Vehicle deleted successfully."}

# ---------------- VIEW QUERY ----------------

@app.get("/query/{query_id}")
def run_predefined_query(query_id: str):
    queries = {
        "all_visitors": "SELECT * FROM visitor ORDER BY visitorid;",
        "all_vehicles": "SELECT v.license_plate, v.type, p.name FROM vehicle v JOIN person p ON v.personid = p.personid;",
        "active_bands": "SELECT * FROM visitor_band WHERE expiry_date >= CURRENT_DATE;",
    }

    if query_id not in queries:
        return {"error": "Unknown query id"}

    with engine.connect() as conn:
        result = conn.execute(text(queries[query_id]))
        rows = [dict(r._mapping) for r in result]
    return rows
