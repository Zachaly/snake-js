function getId(x, y) { 
    return `${x}-${y}`;
}

const xSize = 10;
const ySize = 10;

const fieldContainer = document.getElementById("fields");

for(let i = 0; i < xSize; i++){

    let row = document.createElement("div");
    row.className = "row";

    for(var j = 0; j < ySize; j++){
        let field = document.createElement("div")
        field.className = "field";
        let id = getId(j, i);
        field.id = id;
        row.appendChild(field);
    }
    fieldContainer.appendChild(row);
}