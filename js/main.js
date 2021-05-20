(function () {

  var schemaData = {};

  function update() {
    var input = editor.getValue();
    var r = "";
    try {
      r = ejs.render(input, schemaData, {
        rmWhitespace: true, 
      })
    } catch (e) {
      r = e.stack;
    }
    result.setValue(js_beautify(r.replace(/\n+/g, '\n')), -1);
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



  fetch(`./parse.ejs?v=${Math.random()}`, {
    headers: {
      'content-type': 'text/plain'
    }
  }).then(res => res.text()).then(res => {
    editor.setValue(res, -1);
    editor.focus();
  });





  // 生成的js result
  var result = ace.edit("result");
  result.setTheme("ace/theme/monokai");
  result.getSession().setMode("ace/mode/typescript");
  result.setFontSize(14);
  result.setReadOnly(true);


})();
