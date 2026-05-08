import { useEffect, useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, ImagePlus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { formatMoney, money } from "../lib/api";
import { useBrands, useCategories, useVendorProducts } from "../lib/api/hooks";
import { useUIStore } from "../stores/uiStore";

const productSchema = z.object({
  title: z.string().trim().min(3, "Product name must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  stockCount: z.coerce.number().int().min(0, "Stock cannot be negative."),
  categorySlug: z.string().min(1, "Select a category."),
  brief: z.string().trim().min(8, "Add a short product summary."),
  imageUrl: z.string().url("Use a valid image URL.").or(z.literal("")),
});

const emptyForm = {
  title: "",
  brief: "",
  price: "",
  stockCount: "1",
  sizeLabel: "",
  categorySlug: "",
  brandSlug: "",
  imageUrl: "",
  status: "DRAFT",
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const VendorProductsPage = () => {
  const toast = useUIStore((s) => s.toast);
  const { data: fetchedProducts = [], isLoading } = useVendorProducts("dogget-official");
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [hiddenIds, setHiddenIds] = useState([]);

  useEffect(() => {
    setProducts(fetchedProducts);
  }, [fetchedProducts]);

  const stats = useMemo(() => {
    const visibleProducts = products.filter((product) => !hiddenIds.includes(product.id));
    return {
      total: products.length,
      visible: visibleProducts.length,
      lowStock: visibleProducts.filter((product) => product.stockCount > 0 && product.stockCount <= 5).length,
      outOfStock: visibleProducts.filter((product) => product.stockCount === 0).length,
    };
  }, [hiddenIds, products]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      categorySlug: categories[0]?.slug ?? "",
      brandSlug: brands[0]?.slug ?? "",
    });
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      brief: product.brief ?? "",
      price: formatMoney(product.price, { withSymbol: false }),
      stockCount: String(product.stockCount),
      sizeLabel: product.sizeLabel ?? "",
      categorySlug: product.category.slug,
      brandSlug: product.brand?.slug ?? "",
      imageUrl: product.images[0]?.url ?? "",
      status: hiddenIds.includes(product.id) ? "DRAFT" : "PUBLISHED",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const saveProduct = (event) => {
    event.preventDefault();
    const result = productSchema.safeParse(form);

    if (!result.success) {
      toast(result.error.issues[0]?.message ?? "Check product details.", "error");
      return;
    }

    const category = categories.find((item) => item.slug === form.categorySlug);
    const brand = brands.find((item) => item.slug === form.brandSlug) ?? null;
    const now = new Date().toISOString();
    const isPublished = form.status === "PUBLISHED";

    if (!category) {
      toast("Select a valid category.", "error");
      return;
    }

    const nextProduct = {
      ...(editingProduct ?? {}),
      id: editingProduct?.id ?? `vendor_product_${Date.now()}`,
      slug: editingProduct?.slug ?? slugify(form.title),
      title: form.title.trim(),
      brief: form.brief.trim(),
      description: editingProduct?.description ?? form.brief.trim(),
      price: money(Number(form.price), "GHS"),
      sizeLabel: form.sizeLabel.trim() || null,
      images: form.imageUrl
        ? [{ id: editingProduct?.images?.[0]?.id ?? `img_${Date.now()}`, url: form.imageUrl, alt: form.title, sortOrder: 0 }]
        : editingProduct?.images ?? [],
      category,
      subcategory: null,
      brand,
      vendor: editingProduct?.vendor ?? {
        id: "vendor_dogget",
        slug: "dogget-official",
        name: "Dogget Official",
        verified: true,
        codEnabled: false,
      },
      lifeStage: editingProduct?.lifeStage ?? ["ADULT"],
      breedSize: editingProduct?.breedSize ?? ["SMALL", "MEDIUM"],
      dietaryTags: editingProduct?.dietaryTags ?? [],
      inStock: Number(form.stockCount) > 0,
      stockCount: Number(form.stockCount),
      averageRating: editingProduct?.averageRating ?? 0,
      reviewCount: editingProduct?.reviewCount ?? 0,
      featured: editingProduct?.featured ?? false,
      createdAt: editingProduct?.createdAt ?? now,
    };

    setProducts((current) =>
      editingProduct ? current.map((product) => (product.id === editingProduct.id ? nextProduct : product)) : [nextProduct, ...current]
    );
    setHiddenIds((current) =>
      isPublished ? current.filter((id) => id !== nextProduct.id) : [...new Set([...current, nextProduct.id])]
    );
    toast(editingProduct ? "Product updated in mock mode" : "Product added in mock mode", "success");
    closeDrawer();
  };

  const toggleVisibility = (productId) => {
    setHiddenIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
    toast("Product visibility updated in mock mode", "success");
  };

  return (
    <div className="px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2f2f2f]">Products</h2>
          <p className="mt-1 text-sm text-gray-500">Create, edit, publish, and manage stock.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4a52c] text-white shadow-lg shadow-[#f4a52c]/25"
          aria-label="Add product"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {[
          ["Total", stats.total],
          ["Live", stats.visible],
          ["Low", stats.lowStock],
          ["Out", stats.outOfStock],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-bold text-[#2f2f2f]">{value}</p>
            <p className="text-[11px] font-semibold text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl bg-gray-100 p-6 text-sm text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          products.map((product) => {
            const isHidden = hiddenIds.includes(product.id);

            return (
              <article
                key={product.id}
                className={`rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ${
                  isHidden ? "opacity-70 ring-gray-100" : "ring-gray-100"
                }`}
              >
                <div className="flex gap-4">
                  <Link to={`/products/${product.slug}`} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#fff5e6] p-2">
                    {product.images[0]?.url ? (
                      <img src={product.images[0].url} alt={product.title} className="h-full w-full object-contain" />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-[#f4a52c]" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold leading-5 text-gray-900">{product.title}</h3>
                        <p className="mt-1 text-xs text-gray-500">{product.category.name}</p>
                      </div>
                      <p className="text-sm font-bold text-[#f4a52c]">{formatMoney(product.price)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {product.inStock ? `${product.stockCount} in stock` : "Out of stock"}
                        </span>
                        {isHidden && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">Draft</span>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleVisibility(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                          aria-label={isHidden ? "Publish product" : "Hide product"}
                        >
                          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff5e6] text-[#8a5a08]"
                          aria-label="Edit product"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <p className="font-bold text-[#2f2f2f]">No vendor products yet</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Create the first catalog item to preview product management.</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-2xl bg-[#f4a52c] px-4 py-3 text-sm font-bold text-white"
            >
              Add product
            </button>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/35">
          <button className="absolute inset-0 cursor-default" type="button" onClick={closeDrawer} aria-label="Close product editor" />
          <section className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-5 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4a52c]">
                  {editingProduct ? "Edit product" : "New product"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#2f2f2f]">
                  {editingProduct ? "Update catalog item" : "Create catalog item"}
                </h3>
              </div>
              <button onClick={closeDrawer} className="rounded-full bg-gray-100 p-2 text-gray-500" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Product name</span>
                <input
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Short summary</span>
                <textarea
                  value={form.brief}
                  onChange={(event) => update("brief", event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Price (GHS)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => update("price", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Stock</span>
                  <input
                    type="number"
                    min="0"
                    value={form.stockCount}
                    onChange={(event) => update("stockCount", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Category</span>
                  <select
                    value={form.categorySlug}
                    onChange={(event) => update("categorySlug", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Brand</span>
                  <select
                    value={form.brandSlug}
                    onChange={(event) => update("brandSlug", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  >
                    <option value="">Unbranded</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.slug}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Size / pack label</span>
                <input
                  value={form.sizeLabel}
                  onChange={(event) => update("sizeLabel", event.target.value)}
                  placeholder="8lb, 20kg, 1 pc"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Product image URL</span>
                <div className="rounded-2xl border border-dashed border-[#f4a52c]/50 bg-[#fff9ef] p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#8a5a08]">
                    <ImagePlus className="h-4 w-4" />
                    Image upload stub for Cloudinary integration
                  </div>
                  <input
                    value={form.imageUrl}
                    onChange={(event) => update("imageUrl", event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => update("status", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#f4a52c]"
                >
                  <option value="DRAFT">Save as draft</option>
                  <option value="PUBLISHED">Publish</option>
                </select>
              </label>

              <button className="w-full rounded-2xl bg-[#f4a52c] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#f4a52c]/25">
                {editingProduct ? "Save changes" : "Create product"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorProductsPage;
