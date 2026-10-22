import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

export default withPWA({
  dest: "public",
  disable: !isProd,
  // App Router registration is handled by the client component.
  register: false,
  // App Router build metadata is not a public asset.
  buildExcludes: ["app-build-manifest.json"],
})({
  // The legacy Pages workflow needs a separate basePath-aware export.
  ...(isVercel ? { output: "export", images: { unoptimized: true } } : {}),
});
