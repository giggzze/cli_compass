import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelector from './CategorySelector';

test('renders CategorySelector component', () => {
    render(<CategorySelector />);
    const element = screen.getByText(/category selector/i);
    expect(element).toBeInTheDocument();
});

test('handles props correctly', () => {
    const categories = ['Category 1', 'Category 2'];
    render(<CategorySelector categories={categories} />);
    categories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
    });
});

test('handles user interaction', () => {
    const handleSelect = jest.fn();
    render(<CategorySelector onSelect={handleSelect} />);
    const button = screen.getByRole('button', { name: /select category/i });
    fireEvent.click(button);
    expect(handleSelect).toHaveBeenCalled();
});