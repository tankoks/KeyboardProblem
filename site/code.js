var cy = cytoscape({
  container: document.querySelector('#cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(name)',
        'text-valign': 'center',
        'color': 'white',
        'text-outline-width': 2,
        'background-color': '#999',
        'text-outline-color': '#999'
      })
    .selector('edge')
      .css({
        'label': 'data(label)',
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#ccc',
        'line-color': '#ccc',
        'width': 1,
      })
    .selector(':selected')
      .css({
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      }),

  elements: {
    nodes: [],
    edges: []
  },

  layout: {
    name: 'grid',
    padding: 10
  }
});

cy.on('tap', 'node', function(e){
  var node = e.cyTarget;
  var neighborhood = node.neighborhood().add(node);

  cy.elements().addClass('faded');
  neighborhood.removeClass('faded');
});

cy.on('tap', function(e){
  if( e.cyTarget === cy ){
    cy.elements().removeClass('faded');
  }
});

function submitNewTrade() {
    var username = document.getElementById("username").value;
    var source = document.getElementById("source").value;
    var destination = document.getElementById("destination").value;
    cy.add({
        group: "nodes",
        data: { id: source, name: source},
        position: {x: 100, y:100}
    });
    cy.add({
        group: "nodes",
        data: { id: destination, name: destination},
        position: {x: 100, y:100}
    });
    cy.add({
        group: "edges",
        data: {id: username+"[H]"+source+"[W]"+destination, source: source, target: destination, label: username, classes: 'autorotate'}
    });
}

function findTrade() {
    var source = document.getElementById("havesearch").value;
    var destination = document.getElementById("wantsearch").value;
    var aStar = cy.elements().aStar({root: '#'+source, goal: '#'+destination, directed: true});
    aStar.path.select();
    console.log(aStar.found);
}
