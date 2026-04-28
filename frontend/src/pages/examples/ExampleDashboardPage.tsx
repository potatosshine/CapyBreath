import Navbar from '../../components/Navbar';

const ExampleDashboardPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-capy-light to-white">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <header className="rounded-3xl border border-capy-secondary/30 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-capy-dark/70">Exemplo 2</p>
        <h1 className="mt-2 text-4xl font-bold text-capy-dark">Dashboard de conteúdo</h1>
        <p className="mt-3 max-w-2xl text-capy-dark/80">
          Exemplo de tela informativa com leitura otimizada: gradiente suave ao fundo, cards claros
          e hierarquia de dados para acompanhamento de evolução.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Streak atual', '12 dias'],
          ['Melhor retenção', '2m 15s'],
          ['Sessões no mês', '24'],
          ['Humor médio', '+1.3'],
        ].map(item => (
          <article key={item[0]} className="rounded-2xl border border-capy-secondary/30 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{item[0]}</p>
            <p className="mt-2 text-3xl font-bold text-capy-dark">{item[1]}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-capy-secondary/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-capy-dark">Resumo de sessões</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="rounded-lg border p-3">Última sessão: hoje às 07:20</li>
            <li className="rounded-lg border p-3">Tempo médio de retenção: 1m 38s</li>
            <li className="rounded-lg border p-3">Evolução em 30 dias: +12%</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-capy-secondary/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-capy-dark">Próximas ações</h2>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" className="rounded-xl bg-capy-primary px-4 py-3 font-semibold text-white transition hover:bg-capy-primary/90">Iniciar nova sessão</button>
            <button type="button" className="rounded-xl border border-capy-primary/40 px-4 py-3 font-semibold text-capy-primary transition hover:bg-capy-light">Ver conquistas</button>
          </div>
        </article>
      </section>
    </main>
  </div>
);

export default ExampleDashboardPage;
