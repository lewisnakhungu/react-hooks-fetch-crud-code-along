import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items when component mounts
    fetch("http://localhost:4000/items")
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handleAddItem(newItem) {
    fetch("http://localhost:4000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then(response => response.json())
      .then(item => {
        setItems([...items, item]);
      })
      .catch(error => console.error("Error adding item:", error));
  }

  function handleUpdateItem(updatedItem) {
    fetch(`http://localhost:4000/items/${updatedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then(response => response.json())
      .then(data => {
        const updatedItems = items.map(item => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });
        setItems(updatedItems);
      })
      .catch(error => console.error("Error updating item:", error));
  }

  function handleDeleteItem(id) {
    fetch(`http://localhost:4000/items/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
      })
      .catch(error => console.error("Error deleting item:", error));
  }

  function handleToggleInCart(item) {
    const updatedItem = { ...item, isInCart: !item.isInCart };
    handleUpdateItem(updatedItem);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item 
            key={item.id} 
            item={item} 
            onToggleInCart={handleToggleInCart}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;