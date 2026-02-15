import sqlite3
import os

DB_PATH = os.path.join('instance', 'evaluation.db')

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}, skipping migration.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(answer_sheets)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'remarks' not in columns:
            print("Adding 'remarks' column...")
            cursor.execute("ALTER TABLE answer_sheets ADD COLUMN remarks TEXT")
        else:
            print("'remarks' column already exists.")
            
        if 'status' not in columns:
            print("Adding 'status' column...")
            cursor.execute("ALTER TABLE answer_sheets ADD COLUMN status VARCHAR(50) DEFAULT 'pending'")
        else:
            print("'status' column already exists.")
            
        conn.commit()
        print("Migration successful.")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
