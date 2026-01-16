import { section } from "framer-motion/client";
import CategoriesSection from "../features/HomePage/CategoriesSection";
import ProductCard from "../reusableComponents/ProductCard";
import { products } from "../content/products";
import { useState } from "react";

const ShopPage = () => {

    const [selectedCategory, setSelectedCategory] = useState('pet food');
    const filteredProducts = selectedCategory === 'pet food' ? products : products.filter((product) => product. category=== selectedCategory);
        
    return (
        <section className="h-screen w-full py-4 px-6 mb-[10vh]">
            <main className="flex flex-col h-auto justify-center items-center gap-4">
                <CategoriesSection />
               <div className=" grid grid-cols-2 gap-4">
                    {products.map((shopProduct) => {
                        return (
                            <ProductCard
                                key={shopProduct.id}
                                image={shopProduct.image}
                                title={shopProduct.title}
                                brief={shopProduct.brief}
                                quantity={shopProduct.quantity}
                                price={shopProduct.price}
                            />
                        )

                    })}
                </div>
            </main>


        </section>
    )
}

export default ShopPage;