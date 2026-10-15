# DUET 🎬

### Duas pessoas. Gostos diferentes. Um filme para assistir juntos.

O **DUET** é uma aplicação web criada para ajudar duas pessoas a encontrar filmes, séries e animações que combinem com os gostos de ambas. A proposta é tornar a escolha do que assistir mais simples, interativa e divertida, transformando a indecisão em uma experiência compartilhada.

🔗 **Acesse o projeto:** https://duet-phi-mauve.vercel.app

---

## ✨ Funcionalidades

- **Seleção individual:** cada pessoa escolhe os títulos que gostaria de assistir.
- **Compatibilidade:** identificação dos títulos em comum entre as duas pessoas.
- **Recomendações:** apresentação de opções para ajudar na decisão quando as escolhas não coincidem.
- **Catálogo atualizado:** integração com a API do TMDB para consultar filmes e séries.
- **Filtros de conteúdo:** exploração do catálogo por tipo de conteúdo, gênero e plataformas de streaming.
- **Onde assistir:** consulta aos provedores de streaming e às opções de disponibilidade informadas pela API.
- **Detalhes dos títulos:** visualização de informações como pôster, sinopse e outros dados disponíveis.
- **Interface responsiva:** experiência adaptada para computadores, tablets e celulares.

## 🛠️ Tecnologias

O projeto utiliza tecnologias de desenvolvimento web para construir uma interface interativa e responsiva.

- **React:** construção da interface por componentes.
- **Vite:** ambiente de desenvolvimento e ferramenta de build.
- **JavaScript:** lógica e interatividade da aplicação.
- **HTML5:** estrutura das páginas.
- **CSS3:** estilização, layout e responsividade.
- **TMDB API:** consulta de informações sobre filmes, séries e disponibilidade de streaming.

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Uma chave de API do [TMDB](https://www.themoviedb.org/).

### 1. Clone o repositório

```bash
git clone https://github.com/danmachado3105/duet.git
```

Entre na pasta do projeto:

```bash
cd duet
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a API

Crie um arquivo `.env` na raiz do projeto e adicione sua chave:

```env
VITE_TMDB_API_KEY=sua_chave_aqui
```

Substitua `sua_chave_aqui` pela chave obtida no TMDB.

**Importante:** variáveis com prefixo `VITE_` ficam acessíveis no código executado pelo navegador. Não utilize esse mecanismo para armazenar senhas ou credenciais secretas.

### 4. Inicie o projeto

```bash
npm run dev
```

O terminal exibirá o endereço local para acessar a aplicação.

### 5. Gere a versão de produção

```bash
npm run build
```

Para conferir a versão compilada localmente, caso o script esteja disponível:

```bash
npm run preview
```

> Os comandos pressupõem a configuração padrão do Vite. Caso os scripts ou nomes das variáveis sejam diferentes no repositório, siga as configurações existentes no projeto.

## 🎯 Objetivo do projeto

O DUET nasceu da ideia de resolver uma situação comum: duas pessoas querem assistir a alguma coisa juntas, mas nem sempre conseguem decidir o que escolher.

A aplicação utiliza as preferências de cada pessoa para facilitar a descoberta de títulos em comum e oferecer alternativas quando necessário.

Além de sua proposta de entretenimento, o projeto envolve o desenvolvimento de interfaces, integração com APIs externas, manipulação de dados, gerenciamento de estado e construção de uma experiência responsiva.

## 📡 Fonte de dados e atribuição

As informações sobre filmes e séries são fornecidas pelo [The Movie Database (TMDB)](https://www.themoviedb.org/).

O DUET utiliza a API do TMDB, mas não é endossado, certificado ou afiliado ao TMDB.

A disponibilidade de títulos e provedores de streaming pode variar conforme o conteúdo, a região e as informações fornecidas pela API. Os dados de disponibilidade não constituem garantia de acesso ao conteúdo.

## ⚠️ Limitações atuais

- A aplicação funciona no frontend e não possui backend próprio.
- Não há sincronização automática das escolhas entre dispositivos.
- A disponibilidade dos dados depende da API externa e de sua conexão.
- As informações sobre onde assistir dependem dos dados retornados pelos provedores integrados.

## 👨‍💻 Sobre

O DUET é um projeto pessoal de desenvolvimento web criado para explorar a construção de um produto digital com foco em experiência do usuário, integração com APIs e resolução de problemas do cotidiano.

---

**DUET — Find your next match.** ❤️

