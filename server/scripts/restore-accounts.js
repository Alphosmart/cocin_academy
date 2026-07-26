/*
 * Recreates admin accounts that were lost, using identities preserved in auditlogs.
 *
 * Recoverable: _id, name, email. Restoring the original _id keeps the existing audit
 * history attributed to the right person.
 *
 * NOT recoverable: passwords (stored only as bcrypt hashes, which were deleted) and any
 * two-factor secrets. Each account therefore gets a new password, printed once below —
 * hand it to the owner and have them change it after signing in.
 *
 * Usage:
 *   node scripts/restore-accounts.js                     # dry run, no writes
 *   node scripts/restore-accounts.js --write             # create accounts, generate passwords
 *   node scripts/restore-accounts.js --write --remove-seeded   # also delete admin@example.com
 */

require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

// Identities recovered from the surviving audit trail.
const accounts = [
  { _id: "69fa69f7bc62663665aa1dc4", name: "Developer", email: "alpho4luv@gmail.com", isDeveloper: true },
  { _id: "6a4cd934d18f6385a671b647", name: "Joseph Obadiah", email: "obadiahjosephkuzhu@gmail.com", isDeveloper: false }
];

const SEEDED_PLACEHOLDER_EMAIL = "admin@example.com";

function generatePassword() {
  // 18 url-safe chars, plus a fixed suffix so it always satisfies the 8-char minimum
  // and any mixed-character expectations.
  return `${crypto.randomBytes(14).toString("base64url")}A1!`;
}

async function main() {
  const flags = process.argv.slice(2);
  const write = flags.includes("--write");
  const removeSeeded = flags.includes("--remove-seeded");

  await connectDB();

  console.log(`${write ? "RESTORING ACCOUNTS" : "DRY RUN (no writes)"}\n`);

  const created = [];
  for (const account of accounts) {
    const existingById = await User.findById(account._id);
    const existingByEmail = await User.findOne({ email: account.email });
    const already = existingById || existingByEmail;

    if (already) {
      console.log(`${account.email.padEnd(34)} already present — left untouched`);
      continue;
    }

    const password = generatePassword();
    console.log(`${account.email.padEnd(34)} would be created as "${account.name}"${account.isDeveloper ? " (developer)" : ""}`);
    if (write) {
      // Construct with the original _id so audit history stays attributed.
      const user = new User({ _id: account._id, name: account.name, email: account.email, password, role: "admin", isActive: true, isDeveloper: account.isDeveloper });
      await user.save();
      created.push({ email: account.email, password });
    }
  }

  if (removeSeeded) {
    const seeded = await User.findOne({ email: SEEDED_PLACEHOLDER_EMAIL });
    if (!seeded) console.log(`\n${SEEDED_PLACEHOLDER_EMAIL} not present`);
    else if (!write) console.log(`\n${SEEDED_PLACEHOLDER_EMAIL} would be deleted`);
    else {
      // Never leave the site with no way in.
      const remaining = await User.countDocuments({ email: { $ne: SEEDED_PLACEHOLDER_EMAIL } });
      if (remaining < 1) console.log(`\nRefusing to delete ${SEEDED_PLACEHOLDER_EMAIL}: it is the only account left.`);
      else {
        await User.deleteOne({ _id: seeded._id });
        console.log(`\nDeleted ${SEEDED_PLACEHOLDER_EMAIL}`);
      }
    }
  }

  if (created.length) {
    console.log("\n=== NEW PASSWORDS — shown once, store them now ===");
    created.forEach((c) => console.log(`  ${c.email.padEnd(34)} ${c.password}`));
    console.log("Each owner should sign in and change this immediately.");
  } else if (!write) {
    console.log("\nNothing was written. Re-run with --write to apply.");
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
