(function () {

  var schemaData = {};

  function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
    .then(response => response.text()) // parses response to JSON
  }

  function update() {

    var input = editor.getValue();
    // try {
    //   var fn = ejs.compile(input, {
    //     client: true,
    //     rmWhitespace: true,
    //     fileName: 'parseNode',
    //   });
    //   r = fn(schemaData, null, (path, d) => {
    //     return parseNode({
    //       nodes: d
    //     })
    //   });

    // } catch (e) {
    //   r = e.stack;
    //   throw(e);
    // }

    postData('/compile', {
      input,
    }).then(r => {
      console.log(r)
      result.setValue(js_beautify(r.replace(/\n+/g, '\n')), -1);
    })
  }

  function updateSchema() {
    try {
      schemaData = JSON.parse(editorSchema.getValue());
    } catch { }
  }

  // schema
  var editorSchema = ace.edit("schema");
  editorSchema.setTheme("ace/theme/solarized_dark");
  editorSchema.getSession().setMode("ace/mode/json");
  editorSchema.on("change", updateSchema);
  schemaData = editorSchema.getValue();
  fetch(`json/schema.json?v=${Math.random()}`, {
  }).then(res => res.json()).then(r => {
    schemaData = r;
    editorSchema.setValue(JSON.stringify(r, null, 2), -1);
  })


  // 解释器
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/solarized_dark");
  editor.getSession().setMode("ace/mode/ejs");
  editor.on("change", update);
  editor.setFontSize(18);
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });

  fetch(`./parseNode.ejs?v=${Math.random()}`, {
    headers: {
      'content-type': 'text/plain'
    }
  }).then(res => res.text()).then(res => {
    // window.parseNode = res;
    window.parseNode= ejs.compile(res, {
      rmWhitespace: true,
      // client: true,
      fileName: 'parseNode',
      cache: true,
    });

    fetch(`./parse.ejs?v=${Math.random()}`, {
      headers: {
        'content-type': 'text/plain'
      }
    }).then(res => res.text()).then(res => {
      editor.setValue(res, -1);
      editor.focus();
    });

  })



  // 生成的js result
  var result = ace.edit("result");
  result.setTheme("ace/theme/monokai");
  result.getSession().setMode("ace/mode/typescript");
  result.setFontSize(14);
  result.setReadOnly(true);


})();
