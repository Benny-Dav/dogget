/** @typedef {{
 *   id: string,
 *   author: string,
 *   rating: number,
 *   title: string,
 *   body: string,
 *   date: string,
 *   verified: boolean,
 * }} MockReview
 */

/** @type {Record<string, MockReview[]>} */
export const mockReviewsBySlug = {
  "foster-oatmeal-treats": [
    {
      id: "review_foster_1",
      author: "Ama K.",
      rating: 5,
      title: "Gentle on digestion",
      body: "My dog usually reacts badly to treats, but these sat well from the first week. The bag size is decent too.",
      date: "2026-04-21",
      verified: true,
    },
    {
      id: "review_foster_2",
      author: "Kojo N.",
      rating: 4,
      title: "Solid daily treat",
      body: "Smells clean, breaks apart easily, and works well during training. I just wish the pieces were slightly smaller.",
      date: "2026-04-18",
      verified: true,
    },
    {
      id: "review_foster_3",
      author: "Esi B.",
      rating: 5,
      title: "Will reorder",
      body: "Packaging arrived intact and the texture stayed fresh. Good option for sensitive stomachs.",
      date: "2026-04-10",
      verified: false,
    },
  ],
  "pedigree-chicken-rice": [
    {
      id: "review_pedigree_1",
      author: "Ruth M.",
      rating: 4,
      title: "Reliable staple food",
      body: "Our dogs transitioned onto it without much fuss. It is a safe everyday option for the price.",
      date: "2026-04-24",
      verified: true,
    },
    {
      id: "review_pedigree_2",
      author: "Selorm T.",
      rating: 4,
      title: "Good value",
      body: "The kibble size works for medium breeds and the delivery was quick.",
      date: "2026-04-12",
      verified: true,
    },
  ],
  "threaded-ball": [
    {
      id: "review_ball_1",
      author: "Mabel A.",
      rating: 5,
      title: "Actually survives chewing",
      body: "Usually toys last one weekend here. This one made it through two weeks and still looks usable.",
      date: "2026-04-20",
      verified: true,
    },
    {
      id: "review_ball_2",
      author: "Yaw D.",
      rating: 4,
      title: "Great for fetch",
      body: "Easy to throw and easy to spot in the yard. Rope section also helps with tug sessions.",
      date: "2026-04-15",
      verified: false,
    },
  ],
};

/**
 * @param {string} slug
 * @param {number} fallbackCount
 * @returns {MockReview[]}
 */
export const getMockReviews = (slug, fallbackCount = 2) => {
  const existing = mockReviewsBySlug[slug];
  if (existing?.length) return existing;

  return Array.from({ length: Math.min(3, Math.max(1, fallbackCount || 2)) }, (_, index) => ({
    id: `review_${slug}_${index + 1}`,
    author: ["Abena O.", "Fiifi L.", "Dela P."][index] ?? `Buyer ${index + 1}`,
    rating: Math.max(3, 5 - index),
    title: ["Worth it", "Consistent quality", "Good first order"][index] ?? "Helpful review",
    body:
      "Mock review fixture for this product. It gives the product page realistic density until verified-purchase reviews arrive in a later phase.",
    date: ["2026-04-22", "2026-04-17", "2026-04-09"][index] ?? "2026-04-01",
    verified: index !== 2,
  }));
};
