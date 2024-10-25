// src/components/HeroList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroList from './HeroList';
import axios from 'axios';

jest.mock('axios');

describe('HeroList', () => {
    const heroes = [
        { id: 1, name: 'Luke Skywalker', films: ['A New Hope'] },
        { id: 2, name: 'Darth Vader', films: ['A New Hope'] },
    ];

    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({ data: { results: heroes } });
    });

    test('renders hero list', async () => {
        render(<HeroList onSelect={jest.fn()} />);

        expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument();
        expect(await screen.findByText('Darth Vader')).toBeInTheDocument();
    });

    test('displays loading text initially', () => {
        render(<HeroList onSelect={jest.fn()} />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('calls onSelect when hero is clicked', async () => {
        const onSelectMock = jest.fn();
        render(<HeroList onSelect={onSelectMock} />);

        const hero = await screen.findByText('Luke Skywalker');
        fireEvent.click(hero);
        expect(onSelectMock).toHaveBeenCalledWith(heroes[0]);
    });

    test('displays error message on fetch error', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Error fetching heroes'));
        render(<HeroList onSelect={jest.fn()} />);

        expect(await screen.findByText(/Error fetching heroes/i)).toBeInTheDocument();
    });
});
