import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoEncontrada } from './no-encontrada';

describe('NoEncontrada', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoEncontrada],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('ofrece volver al inicio', async () => {
    const fixture = TestBed.createComponent(NoEncontrada);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('No encontramos esta página');
    expect(compiled.querySelector('a[href="/"]')).toBeTruthy();
  });
});
