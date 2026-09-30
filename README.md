# Brightfield Solar: página de cidade (Caso 09)

Página de cidade para uma instaladora de energia solar fictícia, com Phoenix como primeira cidade. Uma página, um modelo, cerca de 120 cidades: trocar o arquivo de dados troca a página, sem mexer no código.

- **Caso:** 09, página de cidade para uma instaladora de energia solar
- **Tempo dedicado:** _preencher_
- **Stack:** Next.js (App Router), React, TypeScript, SCSS (global + CSS Modules), Motion, Phosphor Icons, Zod, Vitest

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000/phoenix-az
npm test           # 18 testes: cálculo, FAQ e os três avisos do simulador
npm run build && npm start
```

Rotas: `/` (lista de cidades), `/phoenix-az` (a página), `/phoenix-az/opengraph-image`, `/sitemap.xml`, `/robots.txt`, `/schedule` (pedido de visita técnica, com formulário e Server Action).

## Estrutura de pastas

```
data/cities/<slug>.json          conteúdo e números de cada cidade
src/
  app/                           só rotas, metadados e composição da página
  sections/<Nome>/               uma pasta por seção da página
    <Nome>.tsx
    <Nome>.module.scss
    index.ts
    Simulator/parts/             peças do simulador, cada uma com seu .module.scss
    Simulator/__tests__/         testes de interface dos avisos
  components/
    ui/                          Button, RangeField, ParallaxImage, AnimatedNumber, Notice
    layout/                      Header, Footer, StickyCta, SimplePage
    brand/                       Wordmark
    analytics/                   captura de campanha e page view
  features/simulator/            estado do simulador (controles, folha e resumo do celular)
  features/booking/              pedido de visita: schema Zod, Server Action, formulário
  lib/
    solar/                       calculate() e seus testes
    city/                        schema, leitura dos arquivos, FAQ
    seo/                         constantes do site, dados estruturados
    analytics/                   atribuição e eventos
    format.ts
  styles/
    abstracts/                   só Sass, sem saída CSS: breakpoints, camadas, mixins, tipografia
    base/                        tokens, reset, base, movimento, utilitários
    global.scss                  importado uma vez em app/layout.tsx
  assets/images/                 fotografias do modelo
public/images/crews/             fotos das equipes, apontadas pelo arquivo de dados
```

Regras de estilo:
- Todo módulo começa com `@use "abstracts" as *;`.
- Cores, raio, sombras e tempos de animação são tokens em `styles/base/_tokens.scss`. Nenhum componente usa cor solta.
- Classes globais são só cinco: `.container`, `.visually-hidden`, `.skip-link`, `.reveal`, `.enter`. O resto é módulo.
- `z-index` só a partir de `abstracts/_layers.scss`.

Para adicionar uma cidade, copie `phoenix-az.json`, troque os valores e rode `npm run build`. Um campo inválido derruba o build e diz qual arquivo e qual campo.

## Decisões de arquitetura

- O cálculo é uma função pura, usada pelo simulador, pelo FAQ, pelos metadados e pela Server Action do pedido. As respostas do FAQ usam `{{tokens}}` em vez de números fixos, então nada na página pode discordar do simulador.
- Tudo o que é citável vem no HTML do servidor: abertura, passos, equipes, depoimentos e FAQ (`<details>`). O resultado do estado inicial do simulador também vem renderizado como frase.
- Atribuição de campanha: UTM e `gclid`/`fbclid` ficam na sessão (o primeiro contato vale). Todo evento leva cidade e campanha. O link "Request a site visit" é montado no clique com a simulação atual e a campanha. Eventos: `page_view`, `sim_started`, `sim_result` (com pausa de 800 ms), `profile_selected`, `cta_click`, `booking_submitted`. Nenhum provedor de analytics foi escolhido.
- Pedido de visita com uma Server Action. O enunciado dispensa agendamento e back-end, mas o funil da página termina num pedido, então `/schedule` tem um formulário curto (nome, telefone, bairro, horário) com validação acessível no servidor (Zod), erro por campo, foco no primeiro erro e estado de sucesso com referência. A Server Action valida, gera a referência e registra o pedido no log do servidor em JSON, com a simulação e a campanha anexadas: é isso que responde a pergunta de segunda-feira do enunciado. Não há banco nem envio de e-mail.
- Simulador em duas etapas: as duas perguntas ficam em cima (perfis à esquerda, controles à direita no desktop) e o orçamento embaixo, em largura total: os quatro números primeiro, os avisos, depois o desenho do telhado, as linhas de preço e a barra da conta lado a lado.
- Celular primeiro: no simulador, uma faixa com os quatro números fica presa ao topo enquanto os controles estão na tela. Barra fixa inferior com a chamada para ação, que some enquanto a abertura ou o fechamento estão visíveis.
- Animações: entrada escalonada na abertura, aparecer ao rolar em CSS puro, paralaxe nas fotos, números que transicionam. Tudo desliga com preferência por menos movimento.

## Decisões de desenho

A primeira implementação tinha cara de página gerada: ilustração em SVG feita à mão, três cartões iguais em cada seção, quatro caixas de número como resultado, rótulo em maiúsculas sobre todo título. A página foi refeita com estas regras:

| Antes | Agora |
|---|---|
| Ilustração SVG na abertura | Fotografia real |
| Três cartões iguais em passos, equipes e depoimentos | Linhas com fio, uma família de layout por seção |
| Quatro caixas de número | Folha de orçamento: desenho do telhado, linhas de preço, resultado |
| Azul, laranja, verde e lavados azul-claros | Um acento (laranja) sobre grafite e neutros claros, sem azul |
| Abertura dividida, com cartão de prévia | Foto em tela cheia, título e chamada para ação sobre a foto, e os quatro números da cidade no pé |
| Equipes só com iniciais | Foto por equipe, vinda do arquivo de dados |
| Tema escuro automático (fundo azul-marinho) | Um tema só, claro |
| Inter e Plus Jakarta Sans | Figtree, uma família só, com algarismos tabulares |
| Raios de 10 e 16 px | Um raio único de 4 px |

O desenho do telhado mostra um retângulo por painel. Quando o mínimo da cidade acrescenta painéis, eles aparecem hachurados, e a legenda diz quantos foram acrescentados. A barra da conta mostra o que o sol cobre, o que ainda vai para a distribuidora e o excedente que vira crédito.

## Duas decisões investigadas

**1. O perfil de residência deve devolver a cobertura a 80%.**
Eu tinha assumido que escolher um perfil só preenche a conta. Ao rodar a sequência do exemplo do enunciado no navegador, a quarta linha deu 9 painéis e US$ 7.796, não os 8 painéis e US$ 6.930 esperados. Motivo: a terceira linha deixa a cobertura em 100%, e um apartamento de US$ 90 a 100% pede 8,55 painéis, que arredondam para 9. A tabela só fecha se o perfil também volta a cobertura para 80%. Concluí que o perfil é um ponto de partida completo e implementei assim. As seis linhas do exemplo batem no navegador e num teste.

**2. A abertura e a cor vieram de referências abertas e estudadas.**
Duas versões anteriores foram descartadas. A primeira era genérica. A segunda seguia o tema escuro do sistema, o que deixava a página azul-marinho, e tinha uma abertura dividida que não convencia. Abri e capturei as aberturas de Palmetto, Otovo, Sunrun, Enpal, Octopus Energy, Svea Solar, 1KOMMA5, Enphase e as buscas por "solar landing page" no Behance e no Dribbble (prints em `referencias/design/`). O que elas têm em comum: uma fotografia real ocupando a abertura inteira e página clara. Adotei os dois pontos. Cheguei a colocar o controle da conta de luz na abertura, como a Palmetto faz, mas tirei: a página ficava com duas calculadoras, e o enunciado pede a abertura com proposta e chamada para ação e o simulador como segunda parte. A fonte foi escolhida numa comparação lado a lado de seis famílias (`referencias/prints/fontes-*.jpg`). Conferi o contraste de todos os pares de cor (todos passam AA) e a página em 390 e 1440 px.

## Suposições

- O ponto de partida do simulador é conta de US$ 220 e cobertura de 80%, como sugerido.
- Mexer na cobertura quando o mínimo de painéis vale não muda o resultado. A página explica isso ao lado do controle, com a cobertura real que o mínimo produz.
- O FAQ do arquivo tinha números fixos. Viraram campos preenchidos pelo cálculo.
- `installDays` (1) é um campo novo nos dados, tirado do texto do FAQ.
- Os dados não têm quantidade de avaliações. Por isso o JSON-LD não traz `aggregateRating`: o Google exige a contagem e inventar uma seria uma afirmação falsa.
- O incentivo estadual aparece só como nota informativa e não entra na conta.
- As fotos são do modelo, não da cidade. Para variar por cidade, o caminho da foto entraria no arquivo de dados.
- As fotos das equipes são de banco de imagens, como o enunciado permite. Escolhi cada uma pelo tipo de telhado que a equipe faz, não pela aparência das pessoas. O campo `photo` é opcional; sem ele a página mostra as iniciais.
- A página só afirma o que está nos dados. Não há menção a visita gratuita, garantia, licença, certificação, financiamento ou número de avaliações, porque o enunciado não traz nada disso.
- O domínio é fictício (`NEXT_PUBLIC_SITE_URL`).

## Fotografias

Unsplash e Pexels, licenças de uso livre.

| Arquivo | Origem |
|---|---|
| `hero-install.jpg` | Pexels, https://www.pexels.com/photo/9875418/ |
| `steps-tile-roof.jpg` | https://unsplash.com/photos/hrIpsXkrAO0 |
| `valley.jpg` | https://unsplash.com/photos/akE66HU-_Kg |
| `dusk-panels.jpg` | https://unsplash.com/photos/OZ0ZEAm_PbE |
| `public/images/crews/tile-roof.jpg` | Pexels, https://www.pexels.com/photo/9875405/ |
| `public/images/crews/pitched-roof.jpg` | Pexels, https://www.pexels.com/photo/14613939/ |
| `public/images/crews/flat-roof.jpg` | Pexels, https://www.pexels.com/photo/6158868/ |

## Testes

`src/lib/solar/calc.test.ts` protege o cálculo: as seis linhas do exemplo do enunciado, o limite da economia com o valor sem limite, o mínimo de painéis, o arredondamento para cima, a cobertura sem efeito, os extremos das faixas, uma segunda cidade fictícia (prova que nada está fixo no código) e o FAQ citando os mesmos números do simulador.

`src/sections/Simulator/__tests__/Simulator.test.tsx` protege o que aparece na tela nas três situações do enunciado: o aviso do limite da economia com os dois valores, o aviso do mínimo de painéis com o número pedido e o desenho marcando o painel acrescentado, e a nota de que baixar a cobertura não muda o resultado.

## Auditoria

Lighthouse 12 contra o build de produção em 30/09/2026, página de Phoenix: celular 93 de desempenho e 100 em acessibilidade, boas práticas e SEO; desktop 100 nas quatro categorias. O único ponto abaixo de 90 no celular é o LCP da foto da abertura (3,1 s com rede 4G simulada). O axe-core (WCAG 2.2 AA e boas práticas) não encontrou violação na página nem no formulário; os 20 itens marcados para revisão manual são textos sobre a fotografia da abertura, que ficam sobre um véu escuro para manter o contraste.

## O que ficou pendente

- O LCP no celular pode cair com uma foto de abertura mais leve ou um CDN de imagens.
- Não há provedor de analytics escolhido; os eventos estão prontos para receber um.
- O pedido de visita fica só no log do servidor. Um e-mail ou CRM entraria na mesma Server Action.
- Não há tema escuro. Foi uma escolha: a página escura passava menos confiança.
- Uma segunda cidade real não foi criada. Os testes usam uma cidade fictícia com outros números.
- Não foi testado em Safari nem em Firefox. Nesses navegadores o aparecer ao rolar pode não animar; o conteúdo fica visível do mesmo jeito.

## Uso de IA

O Claude Code ajudou a analisar concorrentes, propor a arquitetura e escrever o código. A primeira versão visual que ele produziu foi descartada por ser genérica, e a página foi refeita com as regras acima. O que foi conferido: o cálculo contra as seis linhas do exemplo (num teste e no navegador), o contraste das cores, o HTML do servidor, o layout em 390 e 1440 px e a ausência de rolagem horizontal.
