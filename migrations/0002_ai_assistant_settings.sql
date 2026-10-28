-- Cloudflare D1 Migration: AI Assistant configuration (non-secret settings)
-- Provider credentials must be set as Cloudflare secrets (TTS_API_KEY, TTS_PROVIDER), never in this table.

CREATE TABLE IF NOT EXISTS ai_assistant_config (
  id TEXT PRIMARY KEY,
  assistant_name TEXT NOT NULL,
  welcome_message TEXT,
  avatar_url TEXT,
  ai_enabled INTEGER DEFAULT 1,
  greeting_behavior TEXT DEFAULT 'delayed',
  voice_provider TEXT DEFAULT 'browser',
  voice_id TEXT DEFAULT '',
  speaking_rate REAL DEFAULT 1.0,
  pitch REAL DEFAULT 1.0,
  default_voice_volume REAL DEFAULT 1.0,
  background_sound_enabled INTEGER DEFAULT 0,
  background_sound_asset TEXT,
  background_sound_volume REAL DEFAULT 0.2,
  suggested_questions_json TEXT,
  human_support_phone TEXT,
  human_support_whatsapp TEXT,
  human_support_email TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);