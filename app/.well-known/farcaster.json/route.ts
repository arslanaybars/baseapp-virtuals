import { NextResponse } from "next/server";
import { minikitConfig } from "@/minikit.config";

export async function GET() {
  // Generate manifest from config
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    miniapp: minikitConfig.miniapp,
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

