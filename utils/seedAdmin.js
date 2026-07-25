import Admin from "../models/Admin.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/env.js";

export const seedAdmin = async () => {
  const exists = await Admin.findOne({ email: ADMIN_EMAIL });
  if (exists) return;

  await Admin.create({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  console.log(`✅ Admin seeded: ${ADMIN_EMAIL}`);
};