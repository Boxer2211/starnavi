import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import HeroGraph from "./HeroGraph";

// Мокаємо axios
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HeroGraph', () => {
    const heroId = 1;

    beforeEach(() => {
        // Скидаємо всі моки перед кожним тестом
        jest.clearAllMocks();
    });



    it('renders hero graph after fetching data', async () => {
        // Визначаємо, що повертає мок axios
        mockedAxios.get.mockImplementation((url) => {
            if (url === `https://sw-api.starnavi.io/people/${heroId}/`) {
                return Promise.resolve({
                    data: {
                        name: 'Luke Skywalker',
                        films: [1, 2],
                        starships: [1, 2],
                    },
                });
            }
            if (url === 'https://sw-api.starnavi.io/films/1') {
                return Promise.resolve({ data: { title: 'A New Hope' } });
            }
            if (url === 'https://sw-api.starnavi.io/films/2') {
                return Promise.resolve({ data: { title: 'The Empire Strikes Back' } });
            }
            if (url === 'https://sw-api.starnavi.io/starships/1') {
                return Promise.resolve({ data: { name: 'X-wing' } });
            }
            if (url === 'https://sw-api.starnavi.io/starships/2') {
                return Promise.resolve({ data: { name: 'TIE Fighter' } });
            }
            return Promise.reject(new Error('Not Found'));
        });


        // Очікуємо, що дані завантажаться і рендер буде завершено
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
            expect(screen.getByText('A New Hope')).toBeInTheDocument();
            expect(screen.getByText('The Empire Strikes Back')).toBeInTheDocument();
            expect(screen.getByText('X-wing')).toBeInTheDocument();
            expect(screen.getByText('TIE Fighter')).toBeInTheDocument();
        });
    });
});
