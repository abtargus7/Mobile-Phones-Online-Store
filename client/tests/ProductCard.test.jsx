import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard';

const mockProduct = {
  id: '123',
  image: 'https://via.placeholder.com/150',
  title: 'Awesome T-Shirt',
  price: 799,
  comparePrice: 999,
};

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ProductCard Component', () => {
  it('renders product image', () => {
    renderWithRouter(<ProductCard {...mockProduct} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.image);
  });

  it('renders product title', () => {
    renderWithRouter(<ProductCard {...mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it('truncates long titles and appends ellipsis', () => {
    const longTitle = 'this is a very long product title that should be truncated';
    renderWithRouter(<ProductCard {...mockProduct} title={longTitle} />);
    expect(screen.getByText('this is a very long product title th...')).toBeInTheDocument();
  });

  it('renders price and compare price correctly', () => {
    renderWithRouter(<ProductCard {...mockProduct} />);
    expect(screen.getByText(`₹${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(`₹${mockProduct.comparePrice}`)).toBeInTheDocument();
  });

  it('has a link to the product detail page', () => {
    renderWithRouter(<ProductCard {...mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/product/${mockProduct.id}`);
  });
});
