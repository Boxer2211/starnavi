// src/components/HeroGraph.tsx
import React, {useEffect, useState} from 'react';
import ReactFlow, {Background, Controls, Edge, Node, Position} from 'reactflow';
import axios from 'axios';
import 'reactflow/dist/style.css';

interface HeroGraphProps {
    heroId: number;
}

const HeroGraph: React.FC<HeroGraphProps> = ({ heroId }) => {
    const [hero, setHero] = useState<any>(null);
    const [films, setFilms] = useState<string[]>([]);
    const [starships, setStarships] = useState<string[][]>([]);

    const fetchHeroData = async () => {
        try {
            const response = await axios.get(`https://sw-api.starnavi.io/people/${heroId}/`);
            setHero(response.data);

            const filmTitles: string[] = [];
            const starshipNames: string[][] = [];

            for (const film of response.data.films) {
                const filmResponse = await axios.get(`https://sw-api.starnavi.io/films/${film}`);
                filmTitles.push(filmResponse.data.title);

                const starshipsForFilm: string[] = [];
                for (const starship of response.data.starships) {
                    const shipResponse = await axios.get(`https://sw-api.starnavi.io/starships/${starship}`);
                    starshipsForFilm.push(shipResponse.data.name);
                }

                starshipNames.push(starshipsForFilm);
            }

            setFilms(filmTitles);
            setStarships(starshipNames);
        } catch (error) {
            console.error("Error fetching hero data:", error);
        }
    };



    useEffect(() => {
        fetchHeroData();
    }, [heroId]);

    if (!hero) return <div>Loading...</div>;
    const nodes: Node[] = [
        {
            id: heroId.toString(),
            data: { label: hero.name },
            position: { x: 250, y: 10 },
            sourcePosition: Position.Bottom,
            style: {
                backgroundColor: '#0735ee',
                width: '200px',
                color: '#fff',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #065f46',
            },
        },
        ...films.map((film, index) => ({
            id: `film-${index}`,
            data: { label: film },
            position: { x: 210 * index, y: 100 },
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            style: {
                backgroundColor: '#6d28d9',
                color: '#fff',
                padding: '8px',
                borderRadius: '5px',
                width: '200px',
                border: '1px solid #4c1d95',
            },
        })),
        ...starships.flatMap((starshipList, filmIndex) =>
            starshipList.map((ship, shipIndex) => ({
                id: `ship-${filmIndex}-${shipIndex}`,
                data: { label: ship },
                position: { x: 160 * filmIndex, y: 150 + shipIndex * 50 },
                style: {
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    padding: '8px',
                    width: '150px',
                    borderRadius: '5px',
                    border: '1px solid #065f46',
                },
            }))
        ),
    ];

    const edges: Edge[] = [
        ...films.map((_, index) => ({
            id: `e${heroId}-film-${index}`,
            source: heroId.toString(),
            target: `film-${index}`,
            style: { stroke: '#1e3a8a', strokeWidth: 2 },
        })),
        ...starships.flatMap((starshipList, filmIndex) =>
            starshipList.map((_, shipIndex) => ({
                id: `e-film-${filmIndex}-ship-${filmIndex}-${shipIndex}`,
                source: `film-${filmIndex}`,
                target: `ship-${filmIndex}-${shipIndex}`,
                style: { stroke: '#065f46', strokeWidth: 2 },
            }))
        ),
    ];


    return (
        <div style={{width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
            >
                <Background color="#aaa"/>
                <Controls/>
            </ReactFlow>
        </div>
    );
};

export default HeroGraph;
