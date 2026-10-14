import Button from './Button.jsx'

const MESSAGES = {
  'missing-key': {
    title: 'Falta configurar a TMDB.',
    text: 'Crie o arquivo .env.local na raiz do projeto com a linha VITE_TMDB_API_KEY=sua_chave, salve e reinicie o servidor (npm run dev).',
    config: true,
  },
  'invalid-key': {
    title: 'A TMDB recusou a chave.',
    text: 'Confira o valor de VITE_TMDB_API_KEY no arquivo .env.local (chave v3 ou token de leitura v4) e reinicie o servidor.',
    config: true,
  },
  'rate-limit': {
    title: 'Muitas consultas seguidas.',
    text: 'A TMDB limitou as requisições por um instante. Aguarde alguns segundos e tente de novo.',
  },
  network: {
    title: 'Sem conexão com a TMDB.',
    text: 'Verifique a sua internet e tente novamente.',
  },
}

const DEFAULT_FALLBACK = {
  title: 'Não foi possível carregar o catálogo.',
  text: 'Algo deu errado ao falar com a TMDB. Tente novamente.',
}

// onUseDemo é opcional: sem ele, o botão do catálogo de demonstração não aparece
export default function CatalogMessage({ error, onRetry, onUseDemo, fallback = DEFAULT_FALLBACK }) {
  const code = error?.code
  const message = MESSAGES[code] ?? fallback

  return (
    <div className="empty" role="alert">
      <h2>{message.title}</h2>
      <p>{message.text}</p>
      <div className="empty__actions">
        {code !== 'missing-key' && (
          <Button variant="ghost" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
        {message.config && onUseDemo && (
          <Button onClick={onUseDemo}>Usar catálogo de demonstração</Button>
        )}
      </div>
    </div>
  )
}