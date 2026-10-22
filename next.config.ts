import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

export default withPWA({
  dest: "public",
  disable: !isProd,
  // App Router registration is handled by the client component.
  register: false,
  // App Router build metadata is not a public asset.
  buildExcludes: ["app-build-manifest.json"],
})({
  output: "export",
  images: { unoptimized: true },
});
