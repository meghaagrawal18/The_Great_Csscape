import { useState } from 'react';
import axios from 'axios';

const PostalLookup = () => {
  const [pincode, setPincode] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.get(`http://localhost:5001/api/pincode/${pincode}`);
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError('No results found for this PIN code');
      }
    } catch (err) {
        console.log(err)
      setError('Error fetching postal data. Please try again.');
    }
  };

  return (
    <div>
      <h2>Postal PIN Code Lookup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter PIN code"
          pattern="[0-9]{6}"
          maxLength="6"
          required
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {results.length > 0 && (
        <div>
          <h3>Results:</h3>
          <ul>
            {results.map((place, index) => (
              <li key={index}>
                {place.name}, {place.state}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostalLookup;
