import { providerLogoUrl } from '../services/tmdb.js'
import '../styles/providers.css'

const GROUPS = [
  ['flatrate', 'Assinatura'],
  ['free', 'Gratuito'],
  ['ads', 'Com anúncios'],
  ['rent', 'Aluguel'],
  ['buy', 'Compra'],
]

export default function WhereToWatch({ data, status, retry, compact = false }) {
  if (compact && status === 'idle') return null

  const groups = GROUPS.reduce((result, [key, label]) => {
    const shown = result.reduce((count, group) => count + group.providers.length, 0)
    const remaining = compact ? Math.max(0, 4 - shown) : Infinity
    const providers = (data?.[key] ?? []).slice(0, remaining)
    return providers.length ? [...result, { key, label, providers }] : result
  }, [])

  return (
    <section className={`where-watch${compact ? ' where-watch--compact' : ''}`}>
      <div className="where-watch__heading">
        <h3>Onde assistir</h3>
        {!compact && <span>Brasil</span>}
      </div>

      {status === 'loading' && (
        <p className="where-watch__message" role="status">
          Consultando opções...
        </p>
      )}

      {status === 'error' && (
        <p className="where-watch__message" role="alert">
          Não foi possível consultar agora.{' '}
          <button type="button" className="linklike" onClick={retry}>
            Tentar novamente
          </button>
        </p>
      )}

      {status === 'unsupported' && (
        <p className="where-watch__message">Disponibilidade indisponível para este título.</p>
      )}

      {status === 'success' && groups.length === 0 && (
        <p className="where-watch__message">
          Nenhuma opção informada para o Brasil.
        </p>
      )}

      {groups.length > 0 && (
        <div className="where-watch__groups">
          {groups.map(({ key, label, providers }) => (
            <div className="where-watch__group" key={key}>
              <h4>{label}</h4>
              <ul className="where-watch__providers">
                {providers.map((provider) => (
                  <li key={provider.id}>
                    {provider.logoPath ? (
                      <img
                        src={providerLogoUrl(provider.logoPath)}
                        alt={provider.name}
                        title={provider.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{provider.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {!compact && (
        <p className="where-watch__credit">Disponibilidade fornecida por JustWatch via TMDB.</p>
      )}
    </section>
  )
}
