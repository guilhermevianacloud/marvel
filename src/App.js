import React, { useState, useEffect } from 'react';
import './App.css';

const apiKey = '61f674e4830b5c7eef216aa8801e6d15';
const time = '1724527096';
const hash = 'd87eaf0608cceaf972e69ad9220b2f5a';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = () => {
    fetch(`https://gateway.marvel.com/v1/public/characters?ts=${time}&apikey=${apiKey}&hash=${hash}&limit=20`)
      .then((response) => response.json())
      .then((jsonParsed) => {
        setCharacters(jsonParsed.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-text">Carregando informações dos personagens</div>
          <div className="loading-dots">
            <span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </div>
        </div>
      ) : (
        <div id="herois">
          {characters.map((character) => (
            <div key={character.id} className="personagem">
              <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
              <div>
                <h3>{character.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
