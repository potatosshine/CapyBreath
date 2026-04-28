import Navbar from '../../components/Navbar';

const ExampleBreathingPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-capy-secondary via-capy-accent to-capy-dark">
    <Navbar />
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10">
      <header className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white backdrop-blur-md shadow-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/80">Exemplo 1</p>
        <h1 className="mt-2 text-4xl font-bold">Sessão imersiva (foco respiratório)</h1>
        <p className="mt-3 max-w-2xl text-white/90">
          Exemplo de tela com maior intensidade visual para momentos de prática: gradiente forte,
          superfícies translúcidas e CTA principal com alto contraste.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-white/30 bg-white/10 p-8 text-white backdrop-blur-md shadow-xl">
          <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-center text-2xl font-semibold">
            Inspire
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-white/70">Round</p>
              <p className="text-2xl font-bold">2 / 3</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-white/70">Respiração</p>
              <p className="text-2xl font-bold">18 / 30</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-white/70">Tempo</p>
              <p className="text-2xl font-bold">01:42</p>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/30 bg-white/10 p-6 text-white backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-semibold">Ações rápidas</h2>
          <div className="mt-5 flex flex-col gap-3">
            <button type="button" className="rounded-xl bg-white px-4 py-3 font-bold text-capy-dark transition hover:bg-white/90">Pausar sessão</button>
            <button type="button" className="rounded-xl border border-white/50 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20">Finalizar retenção</button>
            <button type="button" className="rounded-xl border border-white/50 bg-transparent px-4 py-3 font-semibold transition hover:bg-white/10">Encerrar prática</button>
          </div>
        </aside>
      </section>
    </main>
  </div>
);

export default ExampleBreathingPage;
