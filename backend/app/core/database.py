import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("placement_hub")

DATABASE_URL = settings.DATABASE_URL

# Check if PostgreSQL is available, else fallback to SQLite for easy local dev
try:
    if DATABASE_URL.startswith("postgresql"):
        # Test connection or create engine
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Attempt quick test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL database.")
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
except Exception as e:
    logger.warning(f"Could not connect to configured database at {DATABASE_URL}: {e}")
    logger.warning("Falling back to local SQLite database (placement_hub.db) for development.")
    DATABASE_URL = "sqlite:///./placement_hub.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
