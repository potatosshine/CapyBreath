import Navbar from '../../components/Navbar';

const ExampleAuthPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-capy-secondary via-capy-light to-white">
    <Navbar />
    <main className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-6xl items-center gap-8 p-6 md:grid-cols-2 md:p-10">
      <section className="rounded-3xl border border-white/40 bg-white/25 p-8 text-capy-dark shadow-xl backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.2em] text-capy-dark/70">Exemplo 3</p>
        <h1 className="mt-2 text-4xl font-bold">Auth com identidade visual unificada</h1>
        <p className="mt-4 text-capy-dark/80">
          Exemplo de login/cadastro com o mesmo sistema de cores e espaçamentos das áreas autenticadas,
          mantendo acessibilidade e legibilidade.
        </p>
      </section>

      <form className="rounded-3xl border border-capy-secondary/40 bg-white p-8 shadow-2xl" onSubmit={event => event.preventDefault()}>
        <h2 className="text-2xl font-bold text-capy-dark">Entrar</h2>
        <p className="mt-1 text-sm text-gray-600">Use seus dados para acessar sua jornada de respiração.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">E-mail</span>
            <input type="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/50" placeholder="voce@email.com" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Senha</span>
            <input type="password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/50" placeholder="••••••••" />
          </label>
        </div>

        <button type="submit" className="mt-6 w-full rounded-xl bg-capy-primary px-4 py-3 font-semibold text-white transition hover:bg-capy-primary/90">Continuar</button>
        <button type="button" className="mt-3 w-full rounded-xl border border-capy-primary/40 px-4 py-3 font-semibold text-capy-primary transition hover:bg-capy-light">Criar conta</button>
      </form>
    </main>
  </div>
);

export default ExampleAuthPage;
