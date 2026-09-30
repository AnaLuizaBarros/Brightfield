# Caso 09 — Página de cidade para uma instaladora de energia solar

Queremos conhecer seu jeito de resolver problemas. Neste desafio, você vai construir uma solução pequena, mostrar como ela funciona e conversar conosco sobre as decisões que tomou.

## O desafio

A Brightfield Solar instala painéis solares em casas nos Estados Unidos. Ela quer uma página para cada cidade em que tem equipe e escolheu Phoenix como a primeira. Desenhe essa página e implemente-a em código.

A Brightfield Solar é uma empresa fictícia, criada para este desafio. Nada do que você entregar será usado por nós.

Este caso tem uma parte de desenho e uma parte de implementação, e a stack da implementação é fixa: Next.js com App Router. Não há pessoa dedicada ao design na equipe, então as decisões visuais são de quem constrói.

Vale conhecer o lugar que essa página ocupa no negócio, porque é isso que define o que ela precisa ser. Ela é a primeira de cerca de cento e vinte, uma por cidade, publicadas a partir do mesmo modelo, com o conteúdo de cada uma vindo de um arquivo de dados como o deste documento. Metade das visitas chega de campanhas pagas que mudam toda semana, e a outra metade de buscas por energia solar residencial, no Google e em assistentes de IA. Na segunda-feira, quem cuida das campanhas precisa saber quais anúncios geraram simulações de economia, para decidir o que pausar e o que ampliar. Boa parte das visitas vem do celular, às vezes de alguém em pé no quintal olhando para o próprio telhado. E quase ninguém decide sozinho: o endereço é enviado por mensagem para quem decide junto, e precisa parecer confiável quando chega lá.

A simulação de economia é o que mais leva as pessoas a pedir uma visita técnica no site atual.

## Como deve funcionar

A página tem seis partes, nesta ordem: uma abertura com a proposta e uma chamada para ação, o simulador de economia, uma explicação em três passos de como a instalação acontece, a prova social com depoimentos e as equipes daquela cidade, as perguntas frequentes e uma chamada final.

O simulador recebe duas informações: o valor médio da conta de luz por mês e quanto do consumo a pessoa quer cobrir com energia solar. A conta vai de 40 a 600 dólares, de dez em dez. A cobertura vai de 50% a 100%, de cinco em cinco pontos. O resultado aparece em tempo real e mostra, no mínimo, o número de painéis, o investimento depois do incentivo federal, a economia mensal e o tempo de retorno.

O cálculo usa apenas valores do arquivo de dados, nesta ordem. O consumo mensal é a conta de luz dividida pela tarifa da distribuidora. O consumo que se pretende cobrir é esse número multiplicado pela cobertura escolhida. A geração mensal de um painel é a potência do painel, em quilowatts, multiplicada pelas horas de sol pleno por dia, por trinta dias e pelo fator de desempenho. O número de painéis é o consumo a cobrir dividido pela geração de um painel. O investimento é o número de painéis multiplicado pela potência em watts e pelo custo por watt instalado, e o incentivo federal reduz esse valor pela alíquota informada nos dados. A economia mensal é a geração total multiplicada pela tarifa. O tempo de retorno é o investimento depois do incentivo dividido pela economia de doze meses.

Três regras ajustam esse cálculo.

Painel é unidade inteira, então o número de painéis sempre arredonda para cima. Um cálculo que pede 16,7 painéis vira 17, e o investimento e a geração acompanham esse número, não o original.

Existe um número mínimo de painéis por instalação, informado nos dados. Uma casa que precisaria de menos recebe o mínimo mesmo assim, e a página deve deixar isso visível para quem está simulando, em vez de apenas mostrar um resultado que não corresponde ao que foi pedido.

A economia mensal nunca passa do valor da conta de luz. O que o sistema gera além do consumo vira crédito com a distribuidora, não dinheiro de volta, e o cálculo do retorno usa a economia limitada. Quando isso acontece, a página precisa explicar o motivo.

Os perfis de residência listados nos dados funcionam como atalhos: escolher um deles preenche o valor da conta típico daquele perfil, e a pessoa pode ajustar depois.

Todo o conteúdo que muda de uma cidade para outra vem do arquivo de dados. Trocar o arquivo de Phoenix pelo de outra cidade deve produzir a página daquela cidade, sem alterar o código.

O incentivo estadual mencionado nos dados é informativo e não entra na conta. Não precisa implementar agendamento, pagamento, autenticação, painel administrativo nem back-end. A chamada para ação pode levar a um endereço vazio. As fotos das equipes podem ser imagens de espaço reservado ou geradas por IA.

## Os dados

O conteúdo da cidade está abaixo. Organize o arquivo como preferir.

```json
{
  "slug": "phoenix-az",
  "city": "Phoenix",
  "state": "AZ",
  "stateFull": "Arizona",
  "metroArea": "Phoenix–Mesa–Chandler",
  "utilityName": "Arizona Public Service",
  "utilityRatePerKwh": 0.15,
  "peakSunHoursPerDay": 6.5,
  "panelWatts": 450,
  "performanceRatio": 0.8,
  "costPerWattInstalled": 2.75,
  "minPanels": 8,
  "federalCreditRate": 0.3,
  "stateIncentiveNote": "Arizona adds a state tax credit worth 25% of the system cost, capped at $1,000. It is not included in the estimate below.",
  "installsCompleted": 1840,
  "crewsAvailable": 12,
  "avgRating": 4.8,
  "avgPermitDays": 21,
  "phone": "(602) 555-0147",
  "popularNeighborhoods": [
    "Arcadia", "Ahwatukee", "Desert Ridge", "Encanto", "Laveen"
  ],
  "householdProfiles": [
    { "label": "Apartment or small condo, 1–2 people", "typicalBill": 90 },
    { "label": "Three-bedroom house, no pool", "typicalBill": 220 },
    { "label": "Four-bedroom house with central AC", "typicalBill": 310 },
    { "label": "House with a pool and an EV in the garage", "typicalBill": 430 }
  ],
  "crews": [
    {
      "name": "Ray O. and team",
      "installs": 412,
      "rating": 4.9,
      "since": 2019,
      "blurb": "Tile roofs are their specialty. They mount without cracking a single tile and photograph every penetration."
    },
    {
      "name": "Danielle W. and team",
      "installs": 287,
      "rating": 5.0,
      "since": 2021,
      "blurb": "Handles the permit paperwork with the city herself, which is why her jobs clear inspection first time."
    },
    {
      "name": "The Okafor brothers",
      "installs": 533,
      "rating": 4.8,
      "since": 2018,
      "blurb": "Fastest crew on flat roofs. A standard twenty-panel system goes up in a single day."
    }
  ],
  "testimonials": [
    {
      "quote": "My summer bill used to hit $380 in July. The first summer after the install it was $61. The crew was on my roof for one day and I barely knew they were there.",
      "author": "Marta R.",
      "neighborhood": "Ahwatukee",
      "date": "2025-08-11"
    },
    {
      "quote": "I got three quotes. Brightfield was the only one that showed me the math instead of just a monthly payment, so I could tell what I was actually buying.",
      "author": "Kevin D.",
      "neighborhood": "Arcadia",
      "date": "2025-06-27"
    },
    {
      "quote": "Permit took about three weeks, which they told me upfront. No surprises, no change orders, and the final invoice matched the quote to the dollar.",
      "author": "Sandra P.",
      "neighborhood": "Desert Ridge",
      "date": "2025-09-04"
    }
  ],
  "faq": [
    {
      "q": "How many solar panels does a house in Phoenix need?",
      "a": "It depends on your bill. A three-bedroom home in Phoenix with a $220 monthly bill needs about 17 panels to cover 80% of its usage. Phoenix gets 6.5 peak sun hours a day, among the best in the country, so homes here need fewer panels than the same house in a cloudier state."
    },
    {
      "q": "How much does a solar system cost in Phoenix?",
      "a": "We install at $2.75 per watt. A 17-panel system runs $21,038 before incentives and $14,726 after the 30% federal tax credit. Arizona adds a state credit of 25% capped at $1,000 on top of that."
    },
    {
      "q": "How long until the system pays for itself?",
      "a": "Most Phoenix homes reach payback in about seven years. Smaller homes take longer, because every installation has a minimum size and a small household ends up with more panels than it strictly needs."
    },
    {
      "q": "What happens to the power I generate but do not use?",
      "a": "It goes back to the grid and Arizona Public Service credits it against future bills. Those credits roll forward, but they never turn into a payment, so your savings stop at the size of your bill."
    },
    {
      "q": "How long does the whole process take?",
      "a": "The city permit averages 21 days in Phoenix. Installation itself is usually one day, and utility interconnection adds a week or two after that."
    },
    {
      "q": "What happens if I sell the house?",
      "a": "An owned system transfers with the property and appraisers in Maricopa County generally treat it as added value. There is no lease to assign and nothing for the buyer to qualify for."
    }
  ]
}
```

## Um exemplo

Use os dados de Phoenix. Faça estas escolhas no simulador, na ordem:

| Escolha | Painéis | Investimento após incentivo | Economia mensal | Retorno |
|---|---|---|---|---|
| Estado inicial: conta de $220, cobertura de 80% | 17 | $14.726,25 | $179,01 | 6,9 anos |
| Selecionar `House with a pool and an EV in the garage` | 33 | $28.586,25 | $347,49 | 6,9 anos |
| Subir a cobertura para 100% | 41 | $35.516,25 | $430,00 | 6,9 anos |
| Selecionar `Apartment or small condo, 1–2 people` | 8 | $6.930,00 | $84,24 | 6,9 anos |
| Baixar a conta para $60 | 8 | $6.930,00 | $60,00 | 9,6 anos |
| Baixar a cobertura para 50% | 8 | $6.930,00 | $60,00 | 9,6 anos |

Três momentos dessa sequência merecem atenção.

Na terceira linha, o sistema gera $431,73 por mês em energia, acima da conta de $430. A economia é limitada aos $430 e o excedente vira crédito. A página precisa dizer isso.

Na quarta linha, o cálculo pediria 7 painéis e o mínimo da cidade é 8. A pessoa recebe um sistema maior do que pediu, e precisa entender por quê.

Nas duas últimas linhas, reduzir a cobertura não muda nada, porque o mínimo já estava valendo. Uma simulação que não reage ao que a pessoa mexeu é confusa, a menos que a página explique.

O estado inicial de $220 com 80% de cobertura é uma sugestão, não uma regra. Se você escolher outro ponto de partida, explique o motivo.

## Como organizar seu tempo

Nossa sugestão é dedicar até quatro horas ao desenho, à implementação e à documentação. Se não conseguir terminar tudo nesse tempo, envie o que fez e conte o que ficou pendente. O objetivo é ter uma solução pequena que sirva de ponto de partida para nossa conversa.

O desenho costuma caber em uma tela bem resolvida. Se sobrar tempo, você pode incluir até duas telas adicionais, como a versão de celular, um estado diferente do simulador ou uma variação da abertura. Não é necessário, e uma tela boa vale mais do que três pela metade.

## Ferramentas e uso de IA

A implementação é em Next.js com App Router, porque é a stack da vaga. O resto fica com você: estilização, bibliotecas, estrutura de pastas e forma de publicar.

O desenho pode ser feito na ferramenta com que você se sente mais à vontade, seja Figma, ferramenta da Adobe, algum gerador com IA ou diretamente no navegador, se for assim que você trabalha. O que vamos olhar é o resultado e o raciocínio por trás dele.

Pode usar IA, documentação e bibliotecas. Conte como essas ferramentas ajudaram, o que você aproveitou ou mudou e como conferiu o resultado. Não precisamos do histórico de conversas com a IA, pois queremos conhecer suas decisões e a maneira como você verificou o trabalho. Isso vale tanto para o código quanto para o desenho.

Use dados fictícios e deixe de fora credenciais, dados pessoais reais e código de empregadores.

## O que entregar

A entrega tem três partes:

- **Um repositório Git com o código e a documentação da solução.** O README deve explicar como instalar o que for necessário e executar a aplicação, além das suas principais decisões e do que ficou pendente.
- **A página publicada em algum endereço que possamos abrir.** Qualquer serviço gratuito serve.
- **Um vídeo de até 30 minutos, gravado em inglês, explicando a solução.** Percorra a página, mostre os trechos de código mais importantes e conte por que escolheu essa abordagem.

O desenho pode ser entregue como link da ferramenta ou como imagens dentro do repositório.

### Repositório e documentação

Crie o repositório no serviço de sua preferência. No README, informe o nome ou número do caso e quanto tempo você dedicou ao trabalho. Quem clonar o projeto deve conseguir rodá-lo com as instruções que você deixou.

Conte duas decisões que tomou durante o trabalho, explicando o que queria conferir, como investigou e o que concluiu. Uma delas pode ser sobre uma decisão visual e outra sobre uma sugestão da IA, se você a usou. Essas notas podem ficar no próprio README e não precisam seguir um formulário.

Registre também as suposições que precisou fazer. Este documento deixa pontos em aberto de propósito, e a forma como você os resolveu interessa tanto quanto a solução em si. Se algo ficou ambíguo, decida, siga em frente e anote a escolha.

Não esperamos uma suíte de testes neste caso. Se você escreveu algum teste, conte o que ele protege, e as três situações da seção anterior são bons candidatos. A quantidade de commits não conta na avaliação.

### Vídeo explicando a solução

O vídeo deve ser gravado em inglês, do início ao fim. A gravação deve nos ajudar a acompanhar seu raciocínio. Percorra a página como se estivesse apresentando para quem tomou a decisão de construí-la, explicando por que ela está nessa ordem e o que cada parte tenta resolver. Exercite o simulador em um cenário diferente do exemplo deste documento, diga o resultado que espera antes de calcular e compare com o que aconteceu.

Ao percorrer o código, conte por que escolheu uma abordagem, que alternativa considerou e onde a solução tem limites. Se algo não funcionou, vale mostrar como investigou.

Não precisa mostrar o rosto, criar slides, editar a gravação ou repetir seu currículo. Use o tempo para explicar o trabalho, incluindo como verificou as sugestões da IA, quando houver. Se precisar de outro formato de apresentação, converse com a pessoa que acompanha seu processo.

## Como enviar

Quando estiver pronto, responda pelo mesmo canal em que recebeu o convite, compartilhando:

- O link do repositório e o hash completo do commit que devemos avaliar.
- O link da página publicada.
- O link do desenho, se ele não estiver no repositório.
- O link do vídeo, que também pode ficar no README.
- O nome ou número do caso e o tempo aproximado utilizado.
- Alguma observação necessária para executar a solução, se houver.

O repositório pode ser privado. Nesse caso, peça à pessoa responsável os usuários que devem receber acesso de leitura. Confira também se conseguimos abrir o vídeo, sem enviar senhas ou tokens. Vamos confirmar o recebimento e o acesso aos arquivos.

O commit identifica o código entregue. Se continuar trabalhando e quiser incluir uma mudança na avaliação, basta avisar e enviar o novo hash. Você também pode corrigir links, permissões e instruções de execução depois do envio.
