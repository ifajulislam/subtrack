import { config } from "dotenv";

// Have to Learn: Why are we defining path over here?
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { DB_URI, PORT, NODE_ENV } = process.env;
