import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ForgeStatic } from '@/components/forge/ForgeStatic';
import { cta } from '@/content/site';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,14vw,10rem)]">
            <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="chapter"><span className="tnum text-accent">404</span><span>Pagina non trovata</span></p>
            <h1 className="display mt-8 max-w-[14ch] text-[length:var(--text-display-xl)]">
              Questa pagina non esiste.
            </h1>
            <p className="lead mt-8">Probabilmente un collegamento vecchio, o un indirizzo digitato a mano.</p>
            <div className="mt-11 flex flex-wrap gap-3">
              <Button href="/" size="lg" arrow>Torna alla home</Button>
              <Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[24rem] opacity-40">
            <ForgeStatic className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
