// src/components/HeroList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroList from './HeroList';

test('renders loading state', () => {
    render(<HeroList onSelect={() => {}} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
