/** @type {import("../types.js").Vendor[]} */
export const vendors = [
  {
    id: "vendor_dogget_official",
    slug: "dogget-official",
    name: "Dogget Official",
    logoUrl: null,
    bannerUrl: null,
    description: "First-party Dogget store. Curated essentials for every pet.",
    verified: true,
    approved: true,
    codEnabled: true,
    displayCurrency: "GHS",
    region: "Greater Accra",
    averageRating: 4.8,
    reviewCount: 124,
  },
  {
    id: "vendor_pawhouse",
    slug: "pawhouse",
    name: "PawHouse Supplies",
    logoUrl: null,
    bannerUrl: null,
    description: "Pet groomers and accessory specialists based in Kumasi.",
    verified: true,
    approved: true,
    codEnabled: false,
    displayCurrency: "GHS",
    region: "Ashanti",
    averageRating: 4.5,
    reviewCount: 38,
  },
];

/** @param {import("../types.js").Vendor} v @returns {import("../types.js").VendorSummary} */
export const toVendorSummary = (v) => ({
  id: v.id,
  slug: v.slug,
  name: v.name,
  verified: v.verified,
  codEnabled: v.codEnabled,
});
