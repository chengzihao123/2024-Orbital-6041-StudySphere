import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

function TodoList() {
  const [items, setItems] = useState([]);

  // Fetch items from API when component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:4001/todo');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <TodoItem key={item.id} name={item.name} id={item.id} setItems={setItems} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
