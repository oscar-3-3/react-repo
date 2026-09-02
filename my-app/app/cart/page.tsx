"use client";

import { useState, useEffect } from "react";

const PRICES: Record<string, number> = {
  apple: 1,
  bread: 3,
  milk: 2,
};

export default function CartPage() {
  const [items, setItems] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let sum = 0;
    for (const item of items) {
      sum += PRICES[item] ?? 0;
    }
    setTotal(sum);
  }, [items]);

  function addItem(item: string) {
    setItems([...items, item]);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <p>Total: ${total}</p>

      <div className="mt-4 flex gap-2">
        {Object.keys(PRICES).map((item) => (
          <button
            key={item}
            onClick={() => addItem(item)}
            className="rounded border px-3 py-1"
          >
            Add {item}
          </button>
        ))}
      </div>

      <ul className="mt-4">
        {items.map((item, i) => (
          <li key={`${item}-${i}`}>
            {item} - ${PRICES[item]}
          </li>
        ))}
      </ul>
    </div>
  );
}
