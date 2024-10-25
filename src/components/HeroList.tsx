import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Hero {
    id: number;
    name: string;
    films: string[]
}

const HeroList: React.FC<{ onSelect: (hero: Hero) => void }> = ({ onSelect }) => {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        const fetchHeroes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://sw-api.starnavi.io/people?page=${page}`);
                if (response.data.results.length === 0) {
                    setHasMore(false); // Немає більше героїв
                } else {
                    setHeroes((prevHeroes) => [...prevHeroes, ...response.data.results]);
                }
            } catch (error) {
                setError("Error fetching heroes");
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, [page]);

    const loadMoreHeroes = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            <div className="grid grid-cols-3 gap-4">
                {heroes.map((hero, index) => (
                    <div key={index} className="border rounded-lg p-4" onClick={() => onSelect(hero)}>
                        <img src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`} alt={hero.name} className="w-full h-48 object-cover rounded" />
                        <h2 className="text-center mt-2">{hero.name}</h2>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={loadMoreHeroes}>
                    Load More
                </button>
            )}
        </div>
    );
};

export default HeroList;
