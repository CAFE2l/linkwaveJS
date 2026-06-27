"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirebaseConfig } from "./config";

const config = getFirebaseConfig();

const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
export const auth = getAuth(app);
