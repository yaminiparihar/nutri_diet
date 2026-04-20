import { useState } from 'react';

const FoodInput = ({ selectedFoods, setSelectedFoods, onCalculate }) => {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState('');

  const foods = [
    'Rice', 'Dal', 'Milk', 'Egg', 'Roti', 'Paneer', 'Spinach', 'Chole', 'Banana',
    'Dal Tadka', 'Paneer Curry', 'Egg Curry', 'Chicken Curry', 'Fish Fry',
    'Vegetable Sabzi', 'Rajma', 'Idli', 'Dosa', 'Maggi', 'Burger', 'Pizza'
  ];

  const addFood = () => {
    if (food && quantity) {
      setSelectedFoods([...selectedFoods, { food, quantity: parseFloat(quantity) }]);
      setFood('');
      setQuantity('');
    }
  };

  const removeFood = (index) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  return (
    <div className="food-input">
      <h2>Food Input</h2>
      <div className="input-group">
        <select value={food} onChange={(e) => setFood(e.target.value)}>
          <option value="">Select Food</option>
          {foods.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          type="number"
          placeholder="Quantity (g)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={addFood}>Add Food</button>
      </div>
      <ul className="selected-foods">
        {selectedFoods.map((item, index) => (
          <li key={index}>
            {item.food} - {item.quantity}g
            <button onClick={() => removeFood(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button className="calculate-btn" onClick={onCalculate}>Calculate Nutrition</button>
    </div>
  );
};

export default FoodInput;