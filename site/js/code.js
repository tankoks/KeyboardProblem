$(function() {

  var server = 'http://localhost:3000'
  var cy;
  var nodes = $.ajax({
    url: server + '/nodes',
    type: 'GET',
    dataType: 'json'
  });

  var edges = $.ajax({
    url: server + '/edges',
    type: 'GET',
    dataType: 'json'
  });

  Promise.all([nodes, edges]).then(initCy);

  function initCy( then ){
    cy = cytoscape({
      container: document.getElementById('cy'),
      motionBlur: true,
      selectionType: 'single',
      boxSelectionEnabled: false,

      style: cytoscape.stylesheet()
      .selector('node')
          .css({
          'content': 'data(name)',
          'text-valign': 'center',
          'color': 'white',
          'width': 'label'+4,
          'height': 'label'+4,
          'text-outline-width': 2,
          'background-color': 'black',
          'text-outline-color': 'black',
          'text-color': 'white'
          })
        .selector('edge')
          .css({
          'label': 'data(label)',
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 3,
          })
        .selector(':selected')
          .css({
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
          })
        .selector(':selected')
          .css({
            'border-width': 3,
            'border-color': '#333'
          }),

        elements: {
          nodes: [],
          edges: []
        },

        layout: {
        fit: true,
        padding: 20,
        name: 'circle'
        }
    });
    addData();
  }


//events

  // cy.on('tap', function(e){
  //   if( e.cyTarget === cy ){
  //     cy.elements().removeClass('faded');
  //   }
  // });

//initilization
  function addData() {
      cy.startBatch();
      var nodesArray = nodes.responseJSON;
      var edgesArray = edges.responseJSON;
      for (var i = 0; i < nodesArray.length; i++) {
          var newadd = cy.add(
              {
              group: "nodes",
              data: { id: nodesArray[i].nodeid, name: nodesArray[i].name},
              }
          );
      }
      cy.endBatch();
      cy.startBatch();
      for (var i = 0; i < edgesArray.length; i++) {
          cy.add(
              {
              group: "edges",
              data: {id: edgesArray[i].edgeid, source: edgesArray[i].source,
              target: edgesArray[i].target, label: edgesArray[i].label, classes: 'autorotate'},
              }
          );
      }
      cy.endBatch();
      var layout = cy.elements().layout({ name: 'circle'});
      layout.run();
  }
  $(document).ready(function() {
    $('#submitNewTrade').click(submitNewTrade);
  });

//function calls
  function submitNewTrade() {
    var username = document.getElementById("username").value;
    var source = document.getElementById("source").value;
    var destination = document.getElementById("destination").value;

    sourceJSON = {
      group: "nodes",
      data: { id: source, name: source},
      position: {x: 100, y:100}
    }

    destinationJSON = {
      group: "nodes",
      data: {id: destination, name: destination},
      position: {x: 100, y:100}
    }

    edgeJSON = {
      group: "edges",
      data: {id: username+"[H]"+source+"[W]"+destination, source: source,
      target: destination, label: username, classes: 'autorotate'}
    }

    var sourceNode = cy.add(sourceJSON);
    var destinationNode = cy.add(destinationJSON);
    var edge = cy.add(edgeJSON);

    $.ajax({
      url: server + '/nodes',
      type: 'POST',
      data: {nodeid: source, name: source},
      dataType: 'json'
    });
    $.ajax({
      url: server + '/nodes',
      type: 'POST',
      data: {nodeid: destination, name: destination},
      dataType: 'json'
    });
    $.ajax({
      url: server + '/edges',
      type: 'POST',
      data: {edgeid: username+"[H]"+source+"[W]"+destination, source: source,
      target: destination, label: username, classes: 'autorotate'},
      dataType: 'json'
    });
    var layout = cy.elements().layout({ name: 'circle'});
    layout.run();

    var tradeExist = findTrade(source, destination);

    if (tradeExist.found) {
      alert(`Trade found between ${source} & ${destination}. \n`
        +`This is a ${tradeExist.distance + 1} way trade.`);
      console.log(tradeExist.path);
    }
  }
  
//helperfunction
  function findTrade(source, destination) {
    var sourceNode = document.getElementById("source").value;
    var destinationNode = document.getElementById("destination").value;
    var aStar = cy.elements().aStar({root: '#'+destinationNode, goal: '#'+sourceNode, directed: true});
    return aStar;
  }
});
