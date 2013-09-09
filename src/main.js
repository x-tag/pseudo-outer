(function(){  

  function outerNodes(element, pseudo){
    var src = pseudo.source,
        outer = xtag.pseudos.outer, 
        nodes = outer.__nodes__[src.type] || (outer.__nodes__[src.type] = []),
        pseudos = outer.__pseudos__[src.type] || (outer.__pseudos__[src.type] = []),
        index = nodes.indexOf(element);
    if (index == -1) {
      nodes.push(element);
      pseudos.push(pseudo);
    }
    else {
      nodes.splice(index, 1);
      pseudos.splice(index, 1);
    }
    return nodes;
  }
  
  xtag.pseudos.outer = {
    __nodes__: {},
    __pseudos__: {},
    __observers__: {},
    action: function(pseudo, e){
      if (this == e.target || this.contains && this.contains(e.target)) return null;
    },
    onRemove: function(pseudo){
      if (!outerNodes(this, pseudo).length) {
        xtag.removeEvent(document, xtag.pseudos.outer.__observers__[pseudo.source.type]);
      }
    },
    onAdd: function(pseudo){
      outerNodes(this, pseudo);
      var element = this,
          type = pseudo.source.type,
          outer = xtag.pseudos.outer;
      if (!outer.__observers__[type]) {
        outer.__observers__[type] = xtag.addEvent(document, type, function(e){
          outer.__nodes__[type].forEach(function(node, i){
            if (node == e.target || node.contains(e.target)) return;
            var pseudo = outer.__pseudos__[type][i];
            pseudo.source.stack.call(node, e);
          });
        });
      }
    }
  }

})();
