import { useState } from 'react';
import FoodInput from './FoodInput';
import NutritionResults from './NutritionResults';
import NutritionChart from './NutritionChart';

const AnalyzeDiet = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [results, setResults] = useState(null);

  const foodDatabase = {
    Rice: { calories: 130, protein: 2.7, iron: 0.3, carbs: 28, fat: 0.3 },
    Dal: { calories: 116, protein: 7.6, iron: 1.5, carbs: 20, fat: 0.4 },
    Milk: { calories: 61, protein: 3.2, iron: 0.03, carbs: 4.6, fat: 3.3 },
    Egg: { calories: 155, protein: 13, iron: 1.8, carbs: 1.1, fat: 11 },
    Roti: { calories: 70, protein: 2.5, iron: 1.2, carbs: 12, fat: 0.6 },
    Paneer: { calories: 264, protein: 18.3, iron: 0.1, carbs: 3.6, fat: 20 },
    Spinach: { calories: 23, protein: 2.9, iron: 2.7, carbs: 3.6, fat: 0.4 },
    Chole: { calories: 164, protein: 7.5, iron: 4.7, carbs: 27, fat: 4.5 },
    Banana: { calories: 89, protein: 1.1, iron: 0.3, carbs: 23, fat: 0.3 },
    'Dal Tadka': { calories: 140, protein: 8, iron: 2.2, carbs: 22, fat: 1.5 },
    'Paneer Curry': { calories: 280, protein: 15, iron: 1.2, carbs: 8, fat: 18 },
    'Egg Curry': { calories: 180, protein: 14, iron: 2, carbs: 5, fat: 10 },
    'Chicken Curry': { calories: 250, protein: 22, iron: 1.8, carbs: 6, fat: 12 },
    'Fish Fry': { calories: 220, protein: 20, iron: 1.5, carbs: 8, fat: 10 },
    'Vegetable Sabzi': { calories: 110, protein: 4, iron: 1.5, carbs: 15, fat: 3 },
    Rajma: { calories: 210, protein: 12, iron: 2.8, carbs: 30, fat: 2 },
    Idli: { calories: 60, protein: 2, iron: 0.2, carbs: 12, fat: 0.5 },
    Dosa: { calories: 140, protein: 4, iron: 0.8, carbs: 25, fat: 3 },
    Maggi: { calories: 210, protein: 5, iron: 1, carbs: 30, fat: 8 },
    Burger: { calories: 350, protein: 14, iron: 2.5, carbs: 32, fat: 15 },
    Pizza: { calories: 300, protein: 12, iron: 2.2, carbs: 35, fat: 12 }
  };

  const calculateTotalsLocally = () => {
    return selectedFoods.reduce(
      (totals, item) => {
        const data = foodDatabase[item.food];
        if (!data) return totals;
        const factor = item.quantity / 100;
        totals.calories += data.calories * factor;
        totals.protein += data.protein * factor;
        totals.iron += data.iron * factor;
        totals.carbs += data.carbs * factor;
        totals.fat += data.fat * factor;
        return totals;
      },
      { calories: 0, protein: 0, iron: 0, carbs: 0, fat: 0 }
    );
  };

  const handleCalculate = async () => {
    if (selectedFoods.length === 0) {
      alert('Please select at least one food item.');
      return;
    }

    const localTotals = calculateTotalsLocally();

    try {
      // Call backend
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foods: selectedFoods })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received from backend:', data);

      const backendTotals = data?.totals;
      const mappedTotals = {
        calories: backendTotals?.calories ?? localTotals.calories,
        protein: backendTotals?.protein ?? localTotals.protein,
        iron: backendTotals?.iron ?? localTotals.iron,
        carbs: backendTotals?.carbs ?? localTotals.carbs,
        fat: backendTotals?.fat ?? localTotals.fat,
      };

      const payload = {
        success: true,
        totals: mappedTotals,
        deficiencies: data?.deficiencies ?? data?.student?.deficiencies ?? [],
        recommendations: data?.recommendations ?? [],
        meta: data?.student ?? undefined,
        history: data?.history ?? undefined
      };

      setResults(payload);

      // Generate behavior patterns based on results
      const patterns = [];
      if (payload.totals.calories < 1800) {
        patterns.push({ text: 'You frequently skip breakfast', severity: 'serious' });
      }
      if (payload.totals.iron < 18) {
        patterns.push({ text: 'High junk food consumption detected', severity: 'moderate' });
      }
      if (payload.totals.protein < 50) {
        patterns.push({ text: 'Your diet lacks variety', severity: 'moderate' });
      }
      localStorage.setItem('behaviorPatterns', JSON.stringify(patterns));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend. Make sure the server is running on port 5000.\nError: ' + error.message);
      setResults({
        success: true,
        totals: localTotals,
        deficiencies: [],
        recommendations: []
      });
    }
  };

  return (
    <div className="analyze-diet">
      <h1>AI-Based Smart Nutrition Monitoring and Meal Recommendation System for Hostel Students</h1>
      <div className="container">
        <div className="input-section">
          <FoodInput selectedFoods={selectedFoods} setSelectedFoods={setSelectedFoods} onCalculate={handleCalculate} />
        </div>
        <div className="output-section">
          {results && (
            <>
              <NutritionResults results={results} />
              <NutritionChart consumed={results.totals} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeDiet;