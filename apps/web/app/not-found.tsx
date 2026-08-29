import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="py-[clamp(5rem,14vw,10rem)]">
      <Container>
        <p className="label tnum">404</p>
        <h1 className="display mt-6 max-w-[16ch] text-[length:var(--text-display-l)]">
          Questa pagina non esiste.
        </h1>
        <p className="lead mt-7">
          Probabilmente un collegamento vecchio, o un indirizzo digitato a mano.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/" arrow>Torna alla home</Button>
          <Button href="/dimostrazione" variant="secondary">Vedi la dimostrazione</Button>
        </div>
      </Container>
    </section>
  );
}
