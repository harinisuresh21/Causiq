import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../LandingPage';

describe('LandingPage Component', () => {
  it('renders landing page hero and branding elements', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/CAUSIQ/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/When Production Breaks/i)).toBeInTheDocument();
    expect(screen.getByText(/Causiq Isolates The Failure Truth/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Try Causiq/i)[0]).toBeInTheDocument();
  });

  it('renders four-step interactive investigation process tabs', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/1. Ingestion & Redaction/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Graph Correlation/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Evidence Reasoning/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Fix Verification/i)).toBeInTheDocument();
  });

  it('switches steps when interactive process tabs are clicked', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const step2Tab = screen.getByText(/2. Graph Correlation/i);
    fireEvent.click(step2Tab);
    expect(screen.getByText(/Full React Flow Interactive Visual Graph/i)).toBeInTheDocument();
  });
});
