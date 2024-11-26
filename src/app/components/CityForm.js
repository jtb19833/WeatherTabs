import React, { useState } from 'react';

function CityForm({ onAddCity }) {
  const [location, setLocation] = useState('');
  const [temp, setTemp] = useState('');
  const [condition, setCondition] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCity = {
      location,
      temp: parseInt(temp),
      condition,
      highLow: { high: parseInt(high), low: parseInt(low) },
      forecast: { summary },
    };
    onAddCity(newCity);
    setLocation('');
    setTemp('');
    setCondition('');
    setHigh('');
    setLow('');
    setSummary('');
  };

  return (
    <form onSubmit={handleSubmit} className="city-form">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Temperature"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
      />
      <input
        type="text"
        placeholder="Condition"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      />
      <input
        type="number"
        placeholder="High"
        value={high}
        onChange={(e) => setHigh(e.target.value)}
      />
      <input
        type="number"
        placeholder="Low"
        value={low}
        onChange={(e) => setLow(e.target.value)}
      />
      <input
        type="text"
        placeholder="Forecast Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <button type="submit">Add City</button>
    </form>
  );
}

export default CityForm;
