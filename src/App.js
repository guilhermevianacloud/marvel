import React, { useState, useEffect } from "react";
import "./App.css";

const apiKey = "61f674e4830b5c7eef216aa8801e6d15";
const time = "1724527096";
const hash = "d87eaf0608cceaf972e69ad9220b2f5a";

function App() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // Estado para ordenar

    const heartEmpty = "assets/icones/heart/Path Copy 2.png";
    const heartFilled = "assets/icones/heart/Path.png";

    /////////////////

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = () => {
        fetch(
            `https://gateway.marvel.com/v1/public/characters?ts=${time}&apikey=${apiKey}&hash=${hash}&limit=20`
        )
            .then((response) => response.json())
            .then((jsonParsed) => {
                const charactersData = jsonParsed.data.results;
                const updatedCharacters = charactersData.map((char) => ({
                    ...char,
                    isFavorite: false,
                }));
                setCharacters(updatedCharacters);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        const savedFavorites =
            JSON.parse(localStorage.getItem("favorites")) || {};
        setCharacters((prevCharacters) =>
            prevCharacters.map((char) => ({
                ...char,
                isFavorite: savedFavorites[char.id] || false,
            }))
        );
    }, []);

    ////////////////

    const toggleFavorite = (id) => {
        setCharacters((prevCharacters) => {
            const characterIndex = prevCharacters.findIndex(
                (char) => char.id === id
            );
            if (characterIndex === -1) return prevCharacters;

            const newCharacters = [...prevCharacters];
            const character = newCharacters[characterIndex];
            const newFavoriteStatus = !character.isFavorite;

            if (newFavoriteStatus && favoriteCount >= 5) {
                alert("Limite de favoritos atingido.");
                return prevCharacters;
            }

            if (newFavoriteStatus) {
                setFavoriteCount(favoriteCount + 1);
            } else {
                setFavoriteCount(favoriteCount - 1);
            }

            newCharacters[characterIndex] = {
                ...character,
                isFavorite: newFavoriteStatus,
            };

            const updatedFavorites = {
                ...JSON.parse(localStorage.getItem("favorites") || "{}"),
                [id]: newFavoriteStatus,
            };
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

            return newCharacters;
        });
    };

    /////////////////////////

    const filteredCharacters = characters.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCharacters = [...filteredCharacters].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const displayedCharacters = isChecked
        ? sortedCharacters.filter((char) => char.isFavorite)
        : sortedCharacters;

    const handleSortToggle = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="app">
            <header className="header">
                <img
                    src="assets/logo/Group@2x.png"
                    alt="Marvel Logo"
                    className="logo"
                />
                <div className="header-text">
                    <h1>EXPLORE O UNIVERSO</h1>
                    <p>
                        Mergulhe no domínio deslumbrante de todos os personagens
                        clássicos que você ama - e aqueles que você descobrirá
                        em breve!
                    </p>
                </div>
                <div className="search-bar">
                    <img
                        src="assets/busca/Lupa/Shape.png"
                        alt="Search Icon"
                        className="search-icon"
                    />
                    <input
                        type="text"
                        placeholder="Procure por heróis"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="controls-section">
                <div className="controls">
                    <button className="sort-button" onClick={handleSortToggle}>
                        <img
                            src="assets/icones/heroi/noun_Superhero_2227044.png"
                            alt="Hero Icon"
                        />
                        Ordenar por nome - {sortOrder === "asc" ? "A/Z" : "Z/A"}
                    </button>

                    <div className="toggle-button" onClick={handleToggle}>
                        <div
                            className={`toggle-icon ${
                                isChecked ? "checked" : ""
                            }`}
                        ></div>
                    </div>

                    <label htmlFor="toggle" className="favorites-toggle">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleToggle}
                        />
                        <img
                            src="assets/icones/heart/Path.png"
                            alt="Favorites Icon"
                        />
                        Somente favoritos
                    </label>
                </div>
            </div>

            <div className="heroes-list">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-text">
                            Carregando informações dos personagens
                        </div>
                        <div className="loading-dots">
                            <span className="dot-1">.</span>
                            <span className="dot-2">.</span>
                            <span className="dot-3">.</span>
                        </div>
                    </div>
                ) : (
                    <div className="heroes-grid">
                        {displayedCharacters.map((character) => (
                            <div key={character.id} className="personagem">
                                <img
                                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                                    alt={character.name}
                                    className="personagemImg"
                                />
                                <div className="character-info">
                                    <h3>{character.name}</h3>
                                    <img
                                        src={
                                            character.isFavorite
                                                ? heartFilled
                                                : heartEmpty
                                        }
                                        alt="Favorite Icon"
                                        className="favorite-icon"
                                        onClick={() =>
                                            toggleFavorite(character.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
