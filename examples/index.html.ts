export default function getServerSideHtml(version: string) {
  return `<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8"/>
    <title>Stackend React Examples</title>
  </head>
  <body>
    <div id="stackend-examples-app"></div>
  </body>
  <script defer src="/bundle.js?v=${version}" type="text/javascript"></script>
</html>`;
}
