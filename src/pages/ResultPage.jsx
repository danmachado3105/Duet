import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import CatalogMessage from '../components/CatalogMessage.jsx'
import CompatRule from '../components/CompatRule.jsx'
import MatchReveal from '../components/MatchReveal.jsx'
import MovieDetails from '../components/MovieDetails.jsx'
import PreferenceCard from '../components/PreferenceCard.jsx'
import RecommendationCard from '../components/RecommendationCard.jsx'
import { useCompatibility } from '../hooks/useCompatibility.js'
import { RESULTS_ERROR_FALLBACK } from '../utils/compat.js'
import { ROUTES } from '../utils/sessionFlow.js'

function ResultLoading() {
  return (
    <section className="container resp" aria-busy="true">
      <div className="resp__head">
        <span className="eyebrow">Resultado</span>
        <h1 className="resp__title">Montando as sugestões...</h1>
        <p className="lead" role="status">
          Estamos cruzando os gostos de vocês com o catálogo da TMDB.
        </p>
      </div>
      <ul className="recs" aria-hidden="true">
        {[0, 1, 2, 3].map((n) => (
          <li key={n} className="rcard">
            <span className="pimg" data-status="loading" />
            <div className="rcard__body">
              <span className="skeleton-line" />
              <span className="skeleton-line skeleton-line--short" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const compat = useCompatibility()
  const [detail, setDetail] = useState(null)

  const startOver = () => {
    navigate(ROUTES.newSession, { state: { resetSession: true } })
  }

  if (compat.status === 'loading') return <ResultLoading />

  if (compat.status === 'error') {
    return (
      <section className="container resp">
        <CatalogMessage
          error={compat.error}
          onRetry={compat.retry}
          fallback={RESULTS_ERROR_FALLBACK}
        />
        <div className="resp__actions">
          <Button to={ROUTES.summary} variant="ghost" size="lg">
            Voltar ao resumo
          </Button>
        </div>
      </section>
    )
  }

  const { people, sharedTitles, sharedGenres, recommendations, mode, situation } = compat.data
  const [first, second] = people
  const hasRecs = recommendations.length > 0

  let title = (
    <>
      Uma boa escolha ainda pode aparecer.
    </>
  )
  let lead = 'As escolhas não coincidiram desta vez. Vale rever a lista e tentar de novo.'

  if (sharedTitles.length > 0) {
    title = (
      <>
        Vocês encontraram um <em>match</em>.
      </>
    )
    lead = `${sharedTitles.length} ${sharedTitles.length === 1 ? 'título escolhido' : 'títulos escolhidos'} por vocês dois.`
  } else if (hasRecs) {
    title = (
      <>
        Um <em>meio-termo</em> para descobrir.
      </>
    )
    lead =
      situation === 'split'
        ? 'As escolhas não coincidiram desta vez e não têm gêneros em comum. Combinamos um gênero de cada pessoa para encontrar sugestões para os dois.'
        : `As escolhas não coincidiram desta vez. Cruzamos ${first.count} ${first.count === 1 ? 'escolha' : 'escolhas'} da Pessoa 1 com ${second.count} da Pessoa 2 para encontrar sugestões que agradem às duas.`
  } else if (mode === 'picks-only') {
    title = (
      <>
        Comparamos as <em>escolhas</em>.
      </>
    )
    lead = 'As sugestões usam a TMDB e não estão disponíveis com o catálogo de demonstração. Veja abaixo os gêneros das escolhas.'
  } else if (!hasRecs) {
    title = (
      <>
        Hoje, o catálogo não trouxe um <em>meio-termo</em>.
      </>
    )
    lead =
      'As escolhas não coincidiram desta vez e não encontramos sugestões próximas. Alterar as escolhas pode abrir novas possibilidades.'
  }

  return (
    <section className="container resp">
      <header className="resp__head stagger">
        <span className="eyebrow">Resultado</span>
        <h1 className="resp__title">{title}</h1>
        <p className="lead">{lead}</p>
      </header>

      <div className="together">
        <h2 className="resp__h2">O que vocês têm em comum</h2>

        {sharedTitles.length > 0 ? (
          <MatchReveal titles={sharedTitles} onOpen={setDetail} />
        ) : (
          <p className="together__none">
            Nenhum título apareceu nas duas listas. As sugestões abaixo podem revelar um novo
            favorito para assistir juntos.
          </p>
        )}

        {sharedGenres.length > 0 ? (
          <div>
            <p className="together__label">Gêneros em comum</p>
            <ul className="chips">
              {sharedGenres.map((name) => (
                <li key={name} className="chip chip--both">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="together__none">As escolhas de vocês não têm nenhum gênero em comum.</p>
        )}
      </div>

      <div>
        <h2 className="resp__h2">O que cada um prefere</h2>
        <ul className="prefs">
          <PreferenceCard person={first} tone="coral" />
          <PreferenceCard person={second} tone="sand" />
        </ul>
      </div>

      {hasRecs ? (
        <div>
          <h2 className="resp__h2">Sugestões para os dois</h2>
          <ul className="recs">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={item.title.id}
                item={item}
                rank={index}
                onOpen={setDetail}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="note-card">
          {mode === 'picks-only'
            ? 'Para receber sugestões, escolham títulos do catálogo da TMDB.'
            : 'Alterar as escolhas costuma ajudar: com mais títulos de cada pessoa, o DUET tem mais pistas.'}
        </p>
      )}

      {mode === 'tmdb' && <CompatRule />}

      <div className="resp__actions">
        <Button to={ROUTES.summary} variant="ghost" size="lg">
          Alterar escolhas
        </Button>
        <Button size="lg" arrow onClick={startOver}>
          Começar nova sessão
        </Button>
        <Button to={ROUTES.home} variant="ghost" size="lg">
          Voltar ao início
        </Button>
      </div>

      <MovieDetails movie={detail} readOnly onClose={() => setDetail(null)} />
    </section>
  )
}