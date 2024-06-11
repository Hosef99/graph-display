isDirected = false;
let textInput;
let create;
let deleteAll;
let saveGraph;
let uploadGraph;
let graphText;
let graphTextFieldToggle = false;
isDirectedText = "Directed"
const States = {
    Text: "text",
    Normal: "normal"
}

function setup() {
    input = createInput('');
    input.position(10,10);
    input.attribute('placeholder', 'Node Value here');
    create = createButton("Create");
    create.position(10,40);
    create.mousePressed(createPressed);
    deleteAll = createButton("Delete All");
    deleteAll.position(10,70);
    deleteAll.mousePressed(deleteAllPressed);

    textAlign(CENTER);
    createCanvas(windowWidth, windowHeight);
    strokeWeight(5)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function draw() {
    background(220);
    fill(0)
    drawNodes();
    
}

function createPressed(){
    createNode(windowWidth/2, windowHeight/2);
}

function deleteAllPressed(){
    nodes = [];
    selectedNode = null;
}

function drawNodes() {
    // Draw all the nodes
    for (let node of nodes) {
        node.displayLine();
    }
    for (let node of nodes) {
        node.display();
    }
}

function mousePressed() {
    let hasNode = false;
    // Check if the mouse is inside any node
    for (let i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].contains(mouseX, mouseY)) {
            selectedNode = nodes[i];
            let offsetX = mouseX - selectedNode.x
            let offsetY = mouseY - selectedNode.y
            selectedNode.offsetX = offsetX
            selectedNode.offsetY = offsetY
            hasNode = true;
            break;
        }
    }
    if (!hasNode) {
        selectedNode = null;
    }
}

function keyPressed() {
    // Create
    if (key === "q") {
        createNode(mouseX, mouseY);
    }
    // Delete
    if (key === "d") {
        deleteNode();
    }
    // Connect / Disconnect
    if (key === "w") {
        toggleConnectNode();
    }
}

function mouseDragged() {
    if (selectedNode == null) {
        return;
    }
    selectedNode.move()
}

function toggleDirected() {
    isDirected = !isDirected
    isDirectedText = isDirected ? "Directed" : "Not Directed" 
}


// Mathematical calculations

function degToRad(angle) {
    return angle * (Math.PI / 180.0);
}

function rotatePoint(x, y, angle) {
    return [10*parseFloat((x*Math.cos(angle)+y*Math.sin(angle))), 10*parseFloat((-x*Math.sin(angle)+y*Math.cos(angle)))]
}

function drawArrow(x, y, angle) {
    point1 = rotatePoint(-1/Math.sqrt(2), -1/Math.sqrt(2), -angle)
    point2 = rotatePoint(-1/Math.sqrt(2), 1/Math.sqrt(2), -angle)
    line(point1[0] + x, point1[1] + y, x, y)
    line(point2[0] + x, point2[1] + y, x, y)
}

