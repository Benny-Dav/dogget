// Typed contracts for the Dogget API.
// JSDoc-only so the JS frontend gets editor intellisense without a TS toolchain.
// Shapes mirror what apps/api will eventually return (PRD §6 + Prisma schema).

/**
 * @typedef {"CUSTOMER" | "VENDOR" | "ADMIN"} UserRole
 */

/**
 * @typedef {"GHS" | "USD" | "EUR" | "NGN"} CurrencyCode
 */

/**
 * Money is stored as integer minor units + a currency code so the API layer
 * never has to parse formatted strings like "$16.00". Use formatMoney() to display.
 * @typedef {Object} Money
 * @property {number} amount        Minor units (pesewas / cents). 1600 = GHS 16.00.
 * @property {CurrencyCode} currency
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} firebaseUid
 * @property {string} email
 * @property {string|null} name
 * @property {string|null} phone
 * @property {string|null} avatarUrl
 * @property {UserRole} role
 * @property {CurrencyCode} preferredCurrency
 * @property {boolean} emailVerified
 * @property {string} createdAt           ISO date
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Address
 * @property {string} id
 * @property {string} userId
 * @property {string|null} label
 * @property {string} recipient
 * @property {string} phone
 * @property {string} line1
 * @property {string|null} line2
 * @property {string} city
 * @property {string} region
 * @property {string} country
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} imageUrl
 * @property {Subcategory[]=} subcategories
 */

/**
 * @typedef {Object} Subcategory
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} categoryId
 */

/**
 * @typedef {Object} Brand
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string|null} logoUrl
 */

/**
 * @typedef {Object} VendorSummary
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {boolean} verified
 * @property {boolean} codEnabled
 */

/**
 * @typedef {Object} Vendor
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string|null} logoUrl
 * @property {string|null} bannerUrl
 * @property {string|null} description
 * @property {boolean} verified
 * @property {boolean} approved
 * @property {boolean} codEnabled
 * @property {CurrencyCode} displayCurrency
 * @property {string} region
 * @property {number} averageRating       0–5
 * @property {number} reviewCount
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} id
 * @property {string} url
 * @property {string|null} alt
 * @property {number} sortOrder
 */

/**
 * @typedef {"PUPPY" | "ADULT" | "SENIOR"} LifeStage
 * @typedef {"SMALL" | "MEDIUM" | "LARGE"} BreedSize
 * @typedef {"GRAIN_FREE" | "HIGH_PROTEIN" | "LIMITED_INGREDIENT" | "ORGANIC" | "HYPOALLERGENIC"} DietaryTag
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string|null} brief                 Short marketing line shown on cards.
 * @property {string|null} description           Long-form markdown for detail page.
 * @property {Money} price                       Vendor's listed price.
 * @property {string|null} sizeLabel             "8lb", "20kg", "1 pc" — display only.
 * @property {ProductImage[]} images
 * @property {Category} category
 * @property {Subcategory|null} subcategory
 * @property {Brand|null} brand
 * @property {VendorSummary} vendor
 * @property {LifeStage[]} lifeStage
 * @property {BreedSize[]} breedSize
 * @property {DietaryTag[]} dietaryTags
 * @property {boolean} inStock
 * @property {number} stockCount
 * @property {number} averageRating              0–5
 * @property {number} reviewCount
 * @property {boolean} featured
 * @property {string} createdAt
 */

/**
 * Filters accepted by api.products.list(). Unspecified = no constraint.
 * @typedef {Object} ProductFilters
 * @property {string=} q                         Free-text search.
 * @property {string=} categorySlug
 * @property {string=} subcategorySlug
 * @property {string[]=} brandSlugs
 * @property {string=} vendorSlug
 * @property {number=} priceMin                  Minor units.
 * @property {number=} priceMax
 * @property {LifeStage[]=} lifeStage
 * @property {BreedSize[]=} breedSize
 * @property {DietaryTag[]=} dietaryTags
 * @property {number=} minRating
 * @property {boolean=} inStockOnly
 * @property {"featured" | "price-asc" | "price-desc" | "name-asc" | "newest" | "rating"=} sort
 * @property {number=} page                      1-indexed.
 * @property {number=} pageSize
 */

/**
 * @template T
 * @typedef {Object} Paginated
 * @property {T[]} items
 * @property {number} page
 * @property {number} pageSize
 * @property {number} total
 * @property {number} totalPages
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} productId
 * @property {Product} product
 * @property {number} quantity
 * @property {Money} unitPriceSnapshot
 */

/**
 * @typedef {Object} Cart
 * @property {string|null} id                    null for guest local cart.
 * @property {CartItem[]} items
 * @property {Money} subtotal
 */

/**
 * @typedef {Object} WishlistItem
 * @property {string} productId
 * @property {Product} product
 * @property {string} addedAt
 */

export {};
