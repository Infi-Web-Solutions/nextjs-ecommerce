export default {
    locales: ['en'],
    defaultNamespace: 'translation',
    output: 'src/lib/dictionary/$LOCALE.json',
    keySeparator: '.', // use dot notation like 'navbar.home'
    namespaceSeparator: false,
  
    lexers: {
      js: ['JavascriptLexer'],
      ts: ['JavascriptLexer'],
      jsx: ['JsxLexer'],
      tsx: ['JsxLexer'],
    },
  
    keepRemoved: false,
    verbose: true,
  };
  