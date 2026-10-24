import os
import sqlite3
from typing import Optional, Dict, Any, List

PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "processed_data"))
USER_DB_PATH = os.path.join(PROCESSED_DIR, "user_data.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(USER_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_user_db():
    os.makedirs(os.path.dirname(USER_DB_PATH), exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        onboarding_completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # User Profile table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profiles (
        user_id INTEGER PRIMARY KEY,
        dob TEXT,
        age INTEGER,
        gender TEXT,
        allergies TEXT,
        health_notes TEXT,
        profile_photo TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # User Conditions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_conditions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        condition_name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # User Medications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        drug_id TEXT,
        drug_name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        start_date TEXT,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Emergency Contacts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        relationship TEXT NOT NULL,
        phone TEXT NOT NULL,
        is_primary INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # User Screening History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        medications_json TEXT NOT NULL,
        conditions_json TEXT NOT NULL,
        summary_json TEXT NOT NULL,
        results_json TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Create Indexes for fast lookups
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_conditions ON user_conditions (user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_meds ON user_medications (user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_contacts ON emergency_contacts (user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_history ON user_history (user_id);")

    conn.commit()
    conn.close()

# Auto-initialize tables when imported
init_user_db()
