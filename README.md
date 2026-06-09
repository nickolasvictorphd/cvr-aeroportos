# CVR Aeroportos

Site estático para apresentar a proposta de **Compensação Vegetal Requerida (CVR)** como melhoria quantitativa para a metodologia MESA de seleção de sítios aeroportuários.

O simulador aceita múltiplos trechos de vegetação suprimida. Cada trecho pode ter área, estágio sucessional e prioridade ambiental próprios; o CVR final é a soma ponderada dessas subáreas, acrescida da compensação por árvores isoladas.

## Publicação no GitHub Pages

1. Envie os arquivos desta pasta para um repositório GitHub.
2. Ative GitHub Pages em `Settings > Pages`.
3. Selecione a branch principal e a pasta raiz do repositório.

O site não usa backend, build step ou dependências externas. Basta abrir `index.html`.

## Arquivos

- `index.html`: conteúdo e estrutura da página.
- `styles.css`: estilos responsivos.
- `app.js`: calculadora de CVR.
- `assets/airport-vegetation-planning.png`: imagem visual do tema.
