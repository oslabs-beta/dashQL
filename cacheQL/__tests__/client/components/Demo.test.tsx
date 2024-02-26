import { render, screen } from '@testing-library/react';
import Nav from '../../../client/components/Nav';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach } from 'vitest';



describe('Navbar Test', () => {
  beforeEach(async () => {
    render(
      <MemoryRouter>
        <Demo changePage={changePage}/>
      </MemoryRouter>
    );
  });



});