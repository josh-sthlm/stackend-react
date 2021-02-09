import styled from 'styled-components';

export const ExamplesPage = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: min-content auto;
  grid-template-areas: 'header header' 'menu content';
  grid-column-gap: 2em;
  overflow: hidden;

  .header {
    grid-area: header;
    padding: 0 2em;
  }

  .menu {
    grid-area: menu;
    min-width: 15em;

    ul {
      list-style: none;
      padding-left: 1em;
      margin-left: 0;
      li {
        padding: 0.5em 0;
      }
    }
  }

  .header,
  .menu {
    background-color: rgb(42, 77, 105);
    color: white;
    a {
      color: white;
    }
  }

  .content {
    grid-area: content;
    overflow-x: hidden;
  }
`;

export default ExamplesPage;
