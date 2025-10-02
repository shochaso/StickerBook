#!/usr/bin/env node
/**
 * Append a summarized prompt entry with timestamp into logs/prompt_history.json.
 *
 * Usage:
 *   node scripts/log_prompt.js <base64Json>
 *   # where base64Json decodes to: { summary?: string, prompt: string, timestamp?: string }
 *
 * Output:
 *   Prints the saved JSON entry object to stdout, then prints "[Sync OK]".
 */
const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function loadExistingHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If file is corrupted, start a fresh array while preserving old file
    return [];
  }
}

function decodePayloadArg(arg) {
  try {
    const json = Buffer.from(arg, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function summarizePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return '';
  const singleLine = prompt.replace(/\s+/g, ' ').trim();
  const maxLen = 140;
  return singleLine.length <= maxLen ? singleLine : singleLine.slice(0, maxLen - 1) + '…';
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const logsDir = path.join(repoRoot, 'logs');
  const logFile = path.join(logsDir, 'prompt_history.json');

  let payload = null;
  if (process.argv[2]) {
    payload = decodePayloadArg(process.argv[2]);
  }
  if (!payload && process.env.PAYLOAD_B64) {
    payload = decodePayloadArg(process.env.PAYLOAD_B64);
  }
  if (!payload) {
    // Fallback to env vars SUMMARY/PROMPT
    const envSummary = process.env.SUMMARY || '';
    const envPrompt = process.env.PROMPT || '';
    if (envSummary || envPrompt) {
      payload = { summary: envSummary, prompt: envPrompt };
    }
  }

  if (!payload || !payload.prompt) {
    console.error('Missing payload. Provide base64 JSON arg or set PAYLOAD_B64 or SUMMARY/PROMPT env vars.');
    process.exit(1);
  }

  const timestamp = payload.timestamp || new Date().toISOString();
  const entry = {
    timestamp,
    summary: payload.summary && payload.summary.trim() ? payload.summary.trim() : summarizePrompt(payload.prompt),
    prompt: payload.prompt
  };

  ensureDirectoryExists(logsDir);
  const history = loadExistingHistory(logFile);
  history.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(history, null, 2) + '\n', 'utf8');

  // Print JSON entry followed by sync marker
  process.stdout.write(JSON.stringify(entry) + '\n');
  process.stdout.write('[Sync OK]\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



