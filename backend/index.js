const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const historyByDay = {};
const historyByWeek = {};
let foodData = {};

const parseNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getWeekKey = (dateString) => {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date - firstDayOfYear) / 86400000);
  const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

// Load CSV data on startup
fs.createReadStream(path.join(__dirname, 'food_data.csv'))
  .pipe(csv())
  .on('data', (row) => {
    foodData[row.Food] = {
      calories: parseNumber(row.Calories),
      protein: parseNumber(row.Protein),
      iron: parseNumber(row.Iron),
      carbs: parseNumber(row.Carbs),
      fat: parseNumber(row.Fat)
    };
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log('Food Database:', foodData);
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });

app.post('/calculate', (req, res) => {
  try {
    const selectedFoods = req.body.foods; // array of {food, quantity}

    if (!selectedFoods || selectedFoods.length === 0) {
      return res.status(400).json({ error: 'No foods provided' });
    }

    let totals = { calories: 0, protein: 0, iron: 0, carbs: 0, fat: 0 };
    
    selectedFoods.forEach(item => {
      const data = foodData[item.food];
      if (data) {
        const factor = item.quantity / 100; // Convert quantity to proportion of 100g
        totals.calories += data.calories * factor;
        totals.protein += data.protein * factor;
        totals.iron += data.iron * factor;
        totals.carbs += data.carbs * factor;
        totals.fat += data.fat * factor;
      }
    });

    let deficiencies = [];
    if (totals.protein < 50) deficiencies.push('Protein deficient');
    if (totals.iron < 18) deficiencies.push('Iron low');
    if (totals.calories < 1800) deficiencies.push('Calories under intake');

    let recommendations = [];
    if (totals.protein < 50) recommendations.push('milk', 'eggs', 'paneer');
    if (totals.iron < 18) recommendations.push('spinach', 'chole');
    if (totals.calories < 1800) recommendations.push('rice', 'banana');

    const dateKey = new Date().toISOString().slice(0, 10);
    const weekKey = getWeekKey(dateKey);

    if (!historyByDay[dateKey]) {
      historyByDay[dateKey] = [];
    }
    historyByDay[dateKey].push({
      date: dateKey,
      selectedFoods,
      totals,
      deficiencies,
      recommendations
    });

    if (!historyByWeek[weekKey]) {
      historyByWeek[weekKey] = { week: weekKey, entries: [], totals: { calories: 0, protein: 0, iron: 0, carbs: 0, fat: 0 } };
    }
    historyByWeek[weekKey].entries.push({ date: dateKey, totals, deficiencies, recommendations });
    historyByWeek[weekKey].totals.calories += totals.calories;
    historyByWeek[weekKey].totals.protein += totals.protein;
    historyByWeek[weekKey].totals.iron += totals.iron;
    historyByWeek[weekKey].totals.carbs += totals.carbs;
    historyByWeek[weekKey].totals.fat += totals.fat;
    
    res.json({
      success: true,
      totals,
      deficiencies,
      recommendations,
      history: {
        date: dateKey,
        week: weekKey,
        dayCount: historyByDay[dateKey].length,
        weekTotals: historyByWeek[weekKey].totals
      }
    });
  } catch (error) {
    console.error('Error in /calculate:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get('/foods', (req, res) => {
  try {
    const foods = Object.keys(foodData);
    res.json({ success: true, foods });
  } catch (error) {
    console.error('Error in /foods:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/history', (req, res) => {
  try {
    res.json({ success: true, historyByDay, historyByWeek });
  } catch (error) {
    console.error('Error in /history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🍎 Nutrition Server running on port ${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/calculate`);
}).on('error', (err) => {  
    console.error('Failed to start server:', err);
});