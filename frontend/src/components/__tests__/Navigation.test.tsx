import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';

describe('Navigation Layout Components', () => {
  it('Sidebar renders branding and main navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar activeCount={2} />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/CAUSIQ/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('Investigations')).toBeInTheDocument();
    expect(screen.getByText('Evidence Graph')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
    expect(screen.getByText('Fix & Verify')).toBeInTheDocument();
    expect(screen.getByText('Incident History')).toBeInTheDocument();
    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });

  it('Navbar renders search bar and environment status', () => {
    const handleSearch = vi.fn();
    render(
      <BrowserRouter>
        <Navbar onSearch={handleSearch} />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Search Causiq incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/production-us-east-1/i)).toBeInTheDocument();
    expect(screen.getByText(/CAUSIQ LIVE/i)).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });
});
