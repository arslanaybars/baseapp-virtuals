import { NextResponse } from "next/server";
// @ts-ignore - path alias works at runtime
import { minikitConfig } from "@/minikit.config";

export async function GET() {
  // Generate manifest from config
  const manifest: any = {
    miniapp: { ...minikitConfig.miniapp },
  };

  // Clean up miniapp URLs - remove double slashes and trailing slashes
  if (manifest.miniapp.homeUrl) {
    manifest.miniapp.homeUrl = manifest.miniapp.homeUrl.replace(/\/+$/, "");
  }
  if (manifest.miniapp.iconUrl) {
    manifest.miniapp.iconUrl = manifest.miniapp.iconUrl.replace(/([^:]\/)\/+/g, "$1");
  }
  if (manifest.miniapp.splashImageUrl) {
    manifest.miniapp.splashImageUrl = manifest.miniapp.splashImageUrl.replace(/([^:]\/)\/+/g, "$1");
  }
  if (manifest.miniapp.heroImageUrl) {
    manifest.miniapp.heroImageUrl = manifest.miniapp.heroImageUrl.replace(/([^:]\/)\/+/g, "$1");
  }
  if (manifest.miniapp.ogImageUrl) {
    manifest.miniapp.ogImageUrl = manifest.miniapp.ogImageUrl.replace(/([^:]\/)\/+/g, "$1");
  }
  if (manifest.miniapp.webhookUrl) {
    manifest.miniapp.webhookUrl = manifest.miniapp.webhookUrl.replace(/([^:]\/)\/+/g, "$1");
  }
  if (manifest.miniapp.screenshotUrls && Array.isArray(manifest.miniapp.screenshotUrls)) {
    manifest.miniapp.screenshotUrls = manifest.miniapp.screenshotUrls.map((url: string) =>
      url.replace(/([^:]\/)\/+/g, "$1")
    );
  }

  // Only add accountAssociation if all fields have non-empty values
  const hasAccountAssociation =
    minikitConfig.accountAssociation.header &&
    minikitConfig.accountAssociation.payload &&
    minikitConfig.accountAssociation.signature &&
    minikitConfig.accountAssociation.header.trim() !== "" &&
    minikitConfig.accountAssociation.payload.trim() !== "" &&
    minikitConfig.accountAssociation.signature.trim() !== "";

  if (hasAccountAssociation) {
    manifest.accountAssociation = minikitConfig.accountAssociation;
  }

  // Add baseBuilder if ownerAddress is provided
  if (
    minikitConfig.baseBuilder?.ownerAddress &&
    minikitConfig.baseBuilder.ownerAddress.trim() !== ""
  ) {
    manifest.baseBuilder = {
      ownerAddress: minikitConfig.baseBuilder.ownerAddress,
    };
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

