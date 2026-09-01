// scripts/apply-migration.js
// Apply the combined v2 migration directly to Supabase using the service role key.
// Usage: node scripts/apply-migration.js

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ENV_PATH = path.join(__dirname, "..", ".env.local");
const env = fs
  .readFileSync(ENV_PATH, "utf8")
  .split("\n")
  .filter((l) => l.includes("="))
  .reduce((a, l) => {
    const [k, v] = l.split("=");
    a[k.trim()] = v.trim();
    return a;
  }, {});

const SQL_PATH = path.join(__dirname, "..", "supabase", "migrations", "0000_reset_and_seed.sql");
const sql = fs.readFileSync(SQL_PATH, "utf8");

// Supabase doesn't allow arbitrary DDL through PostgREST for security reasons.
// We have to either:
//   1) Use the Supabase dashboard SQL Editor (manual)
//   2) Use psql directly with the DB connection string
// The PostgREST API does NOT support DDL — so we can't run this from the supabase-js client.
//
// Instead, we'll print what to do and offer to chunk-execute via the supabase management API.
// As a fallback, we'll just verify the schema via the regular client and report.

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // Check current state
  const { data: sample, error } = await sb.from("contestants").select("*").limit(1).single();
  if (error) {
    console.log("❌ Error reading contestants:", error.message);
    return;
  }
  const cols = Object.keys(sample);
  const v2cols = ["ideal_type", "catchphrase", "marital_history", "is_final_couple", "final_choice", "recent_news", "data_source", "confidence", "hobbies", "eliminated_episode"];
  const present = v2cols.filter((c) => cols.includes(c));
  const missing = v2cols.filter((c) => !cols.includes(c));

  console.log("============================================");
  console.log("DB schema check");
  console.log("============================================");
  console.log("Total columns in contestants:", cols.length);
  console.log("v2 columns present:", present.length, "/", v2cols.length);
  if (missing.length > 0) {
    console.log("MISSING v2 columns:", missing.join(", "));
    console.log("");
    console.log("PostgREST API does not support DDL. To apply the v2 migration:");
    console.log("  1) Open https://supabase.com/dashboard/project/ateycwrxjiyogilsxwfn/sql/new");
    console.log("  2) Paste contents of: " + SQL_PATH);
    console.log("  3) Click Run");
    console.log("");
    console.log("Alternative: use psql with the direct connection string from Supabase dashboard.");
  } else {
    console.log("✅ All v2 columns present. Migration is applied.");
  }
})();
