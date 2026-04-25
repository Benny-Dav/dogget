import { useMemo, useState } from "react";
import ProductCard from "../reusableComponents/ProductCard";
import ShopFilters from "../features/shop/ShopFilters";
import { products } from "../content/products";

const parsePrice = (p) => {
    const n = parseFloat(String(p).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const ShopPage = () => {
    const [selected, setSelected] = useState(null);
    const [sortBy, setSortBy] = useState("default");

    const visible = useMemo(() => {
        const list = selected
            ? products.filter(
                  (p) => p.category?.toLowerCase() === selected.toLowerCase()
              )
            : products;

        const sorted = [...list];
        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case "price-desc":
                sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case "name-asc":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                break;
        }
        return sorted;
    }, [selected, sortBy]);

    return (
        <div className="pb-[12vh]">
            <ShopFilters
                selectedCategory={selected}
                onCategoryChange={setSelected}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <section className="px-6 py-4">
                {visible.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {visible.map((p) => (
                            <ProductCard
                                key={p.id}
                                image={p.image}
                                title={p.title}
                                brief={p.brief}
                                quantity={p.quantity}
                                price={p.price}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-gray-500 mb-2">
                            No products found{selected && ` in ${selected}`}.
                        </p>
                        <button
                            onClick={() => setSelected(null)}
                            className="text-sm text-[#f4a52c] font-semibold hover:underline"
                        >
                            Show all products
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ShopPage;
