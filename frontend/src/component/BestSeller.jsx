import { useEffect, useState } from "react";
import api from "../utils/api";

function BestSeller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log("BestSeller error:", err);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-white mt-8">
      <h2 className="text-2xl font-bold mb-4">Best Seller</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((item) => (
          <div key={item._id} className="mb-2">
            {item.name}
          </div>
        ))
      )}
    </div>
  );
}

export default BestSeller;
