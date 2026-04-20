const NutritionResults = ({ results }) => {
  const { totals, deficiencies, recommendations } = results;

  return (
    <div className="nutrition-results">
      <h2>Nutrition Results</h2>
      <div className="totals">
        <h3>Total Nutrients</h3>
        <p>Calories: {totals.calories.toFixed(2)}</p>
        <p>Protein: {totals.protein.toFixed(2)}g</p>
        <p>Iron: {totals.iron.toFixed(2)}mg</p>
        <p>Carbs: {totals.carbs.toFixed(2)}g</p>
        <p>Fat: {totals.fat.toFixed(2)}g</p>
      </div>
      {deficiencies.length > 0 && (
        <div className="deficiencies">
          <h3>Deficiencies</h3>
          <ul>
            {deficiencies.map((def, index) => <li key={index}>{def}</li>)}
          </ul>
        </div>
      )}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NutritionResults;