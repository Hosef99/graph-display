// sketch.js
let nodes = [];
let selectedNode = null;

function createNode(x,y) {
    msg = input.value();
	newNode = new Node(x, y, 30, msg);
	if (selectedNode != null) {
		selectedNode.nodes.push(newNode);
        selectedNode.connectedNodes.push(newNode);
        newNode.connectedNodes.push(selectedNode);
        if (!isDirected) {
            newNode.nodes.push(selectedNode);
        }
	}
	nodes.push(newNode);
    console.log("Created node");
}

function deleteNode() {
    selectedNode = null;
		for (let i = nodes.length - 1; i >= 0; i--) {
			if (nodes[i].contains(mouseX, mouseY)) {
				nodes[i].delete();
				nodes.splice(i, 1);

				break;
			}
		}
}

function toggleConnectNode() {
    if (selectedNode == null) {
        console.log("No node selected, cannot connect");
        return;
    }
    for (let i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].contains(mouseX, mouseY)) {
            if (selectedNode == nodes[i]) {
                return;
            }

            let targetNode = nodes[i];
            let relation = selectedNode.relation(targetNode);
            if (relation == 0) {
                selectedNode.nodes.push(nodes[i]);
                selectedNode.connectedNodes.push(nodes[i])
                nodes[i].connectedNodes.push(selectedNode)

                if (!isDirected){
                    nodes[i].nodes.push(selectedNode);
                }
                break;
            } else if (relation == 1) {
                let index1Node = selectedNode.findNode(targetNode);
                let index1Connect = selectedNode.findConnectedNode(targetNode);
                let index2Connect = targetNode.findConnectedNode(selectedNode);
                selectedNode.nodes.splice(index1Node, 1)
                selectedNode.connectedNodes.splice(index1Connect, 1)
                targetNode.connectedNodes.splice(index2Connect, 1)
            }
            else if (relation == -1) {
                selectedNode.nodes.push(targetNode)
            }
            
            else {
                let index1 = selectedNode.findNode(targetNode);
                if (index1 != -1) {
                    selectedNode.nodes.splice(index1, 1);
                }
                if(!isDirected){
                    let index2 = targetNode.findNode(selectedNode);
                    if (index2 != -1) {
                        targetNode.nodes.splice(index2, 1);
                    }
                }
            }
        }
    }
}

// Node class
class Node {
	constructor(x, y, radius, value) {
		this.x = x;
		this.y = y;
		this.offsetX = 0;
		this.offsetY = 0;
		this.radius = radius;
		this.nodes = [];
        this.connectedNodes = [];
        this.value = value;
	}

	move() {
		this.x = mouseX - this.offsetX;
		this.y = mouseY - this.offsetY;
	}

	addNode(node) {
		this.nodes.push(node);
	}

	delete() {
		for (let i = 0; i < this.connectedNodes.length; i++) {
			let currNodeList = this.connectedNodes[i].nodes;
            let currConnectedNodesList = this.connectedNodes[i].connectedNodes;
			for (let j = 0; j < currNodeList.length; j++) {
				if (currNodeList[j] == this) {
					currNodeList.splice(j, 1);
					break;
				}
			}
            for (let j = 0; j < currConnectedNodesList.length; j++) {
				if (currConnectedNodesList[j] == this) {
					currConnectedNodesList.splice(j, 1);
					break;
				}
			}

		}
	}

	display() {
		if (this == selectedNode) {
			fill(0, 255, 0);
		} else {
			fill(255, 0, 0);
		}
		ellipse(this.x, this.y, this.radius * 2);
        fill(0,0,0);
        textAlign(CENTER);
        text(this.value, this.x, this.y);
		
	}

    displayLine() {
        for (let i = 0; i < this.nodes.length; i++) {
            let currNode = this.nodes[i]
			line(this.x, this.y, currNode.x, currNode.y);
            if (isDirected) {
                if (currNode.findNode(this) == -1) {
                    
                    let midpoint = [(this.x + currNode.x)/2, (this.y + currNode.y)/2]
                    let angle = Math.atan((currNode.y-this.y)/(currNode.x-this.x))
                    if (currNode.x < this.x) {
                        angle += Math.PI
                    }
                    drawArrow(midpoint[0], midpoint[1], angle)
                }
                else{
                    let midpoint = [(this.x + currNode.x)/2, (this.y + currNode.y)/2]
                    let angle = Math.atan((currNode.y-this.y)/(currNode.x-this.x))
                    if (currNode.x < this.x) {
                        angle += Math.PI
                    }
                    drawArrow(midpoint[0]+Math.cos(angle)*20, midpoint[1]+Math.sin(angle)*20, angle)
                }
            }
		}
    }

    relation(node) {
        // -1 -> that node connected to this node 0 -> not connected 1 -> this node connected to that node 2 -> mutually connected
        let thisIndex = this.findNode(node)
        let thisConnected = this.findConnectedNode(node)
        let nodeIndex = node.findNode(this)

        if (thisConnected == -1) {
            return 0;
        }
        else{
            if (thisIndex == -1) {
                return -1
            }
            else{
                if (nodeIndex == -1) {
                    return 1
                }
                else{
                    return 2
                }
            }
        }
    }   

	contains(x, y) {
		return dist(x, y, this.x, this.y) < this.radius;
	}

	findNode(node) {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i] == node) {
				return i;
			}
		}
		return -1;
	}
    
    findConnectedNode(node) {
        for (let i = 0; i < this.connectedNodes.length; i++) {
			if (this.connectedNodes[i] == node) {
				return i;
			}
		}
		return -1;
    }
}
