export function mockProfilePhotoUrl(seed: string): string {
  const slug = seed.replace(/\W/g, "").toLowerCase() || "volunteer";
  return `https://picsum.photos/seed/${slug}/400/400`;
}
