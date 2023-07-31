// sketch.js
let nodes = [];
let selectedNode = null;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function draw() {
    background(220);

    drawNodes();
}

function drawNodes() {
    // Draw all the nodes
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
        newNode = new Node(mouseX, mouseY, 30)
        if (selectedNode != null) {
            newNode.nodes.push(selectedNode)
            selectedNode.nodes.push(newNode)
        }
        nodes.push(newNode);
    }
    // Delete
    if (key === "d") {
        selectedNode = null;
        for (let i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].contains(mouseX, mouseY)) {
                nodes[i].delete()
                nodes.splice(i, 1);

                break;
            }
        }
    }
    // Connect / Disconnect
    if (key === "w") {
        if (selectedNode == null) {
            console.log("No node selected, cannot connect")
            return
        }
        for (let i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].contains(mouseX, mouseY)) {
                if (selectedNode == nodes[i]) {
                    return
                }
                let targetNode = nodes[i] 
                if (!nodes[i].nodes.includes(selectedNode)) {
                    selectedNode.nodes.push(nodes[i])
                    nodes[i].nodes.push(selectedNode)
                    break;
                }
                else{
                    let index1 = selectedNode.findNode(targetNode)
                    let index2 = targetNode.findNode(selectedNode)
                    if(index1 != -1 && index2 != -1){
                        selectedNode.nodes.splice(index1, 1)
                        targetNode.nodes.splice(index2, 1)
                    }
                }
            }
        }
    }
}

// Node class
class Node {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.offsetX = 0
        this.offsetY = 0
        this.radius = radius;
        this.nodes = []
    }

    move() {
        this.x = mouseX - this.offsetX;
        this.y = mouseY - this.offsetY;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    delete() {
        for (let i = 0; i < this.nodes.length; i++) {
            let currNodeList = this.nodes[i].nodes
            for (let j = 0; j < currNodeList.length; j++) {
                if (currNodeList[j] == this) {
                    currNodeList.splice(j, 1);
                    break;
                }
            }
        }
    }

    display() {
        if (this == selectedNode) {
            fill(0, 255, 0);
        }
        else {
            fill(255, 0, 0);
        }
        ellipse(this.x, this.y, this.radius * 2);
        for (let i = 0; i < this.nodes.length; i++) {
            line(this.x, this.y, this.nodes[i].x, this.nodes[i].y);
        }
    }

    contains(x, y) {
        return dist(x, y, this.x, this.y) < this.radius;
    }

    findNode(node) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] == node) {
                return i
            }
        }
        return -1;
    }
}

function mouseDragged() {
    if (selectedNode == null) {
        return;
    }
    selectedNode.move()
}