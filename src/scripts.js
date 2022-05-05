class Form {
    constructor(element) {
        this.inputs = [];
        if (typeof element === "string") {
            this.element = document.getElementById(element);
        }
        else {
            this.element = element;
        }
        for (let i = 0; i < this.element.children[0].children.length; i++) {
            if (i % 2 == 0 && i != this.element.children[0].children.length - 1) {
                this.inputs.push(this.element.children[0].children[i]);
            }
        }
        this.button = this.element.children[0].children[this.element.children[0].children.length - 1];
        this.button.addEventListener("click", () => {
            this.createBook();
        });
    }
    createBook() {
        let nullInput = false;
        this.inputs.forEach(input => {
            if (input.value.trim().length === 0) {
                nullInput = true;
            }
        });
        if (nullInput == false) {
            if (isNaN(parseInt(this.inputs[3].value)) || parseInt(this.inputs[3].value) <= 0) {
                alert('Error: O campo "Ano" deve ser um número ou um número maior que 0!');
            }
            else {
                const book = {
                    nome: this.inputs[0].value.normalize().trim(),
                    autor: this.inputs[1].value.normalize().trim(),
                    editora: this.inputs[2].value.normalize().trim(),
                    ano: parseInt(this.inputs[3].value)
                };
                fetch("https://academico.espm.br/testeapi/livro/criar", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                })
                    .then(response => response.json())
                    .then(() => {
                    this.inputs[0].value = "";
                    this.inputs[1].value = "";
                    this.inputs[2].value = "";
                    this.inputs[3].value = "";
                    this.refreshElements();
                })
                    .catch(error => {
                    alert(`Error: ${error}`);
                });
            }
        }
        else {
            alert("Error: Todos os campos devem ser preenchidos!");
        }
    }
    refreshElements() {
        let data = document.querySelector('#data');
        while (data.lastChild) {
            data.removeChild(data.lastChild);
        }
        new Data("data");
    }
}
class Data {
    constructor(element) {
        if (typeof element === "string") {
            this.element = document.getElementById(element);
        }
        else {
            this.element = element;
        }
        this.getMethod();
    }
    getMethod() {
        fetch("https://academico.espm.br/testeapi/livro/listar", {
            method: "GET"
        })
            .then(response => response.json())
            .then(books => {
            this.listBooks(books);
        })
            .catch(error => {
            alert(`Error: ${error}`);
        });
    }
    listBooks(books) {
        books.forEach(book => {
            let div = document.createElement("div");
            let id = document.createElement("b");
            let name = document.createElement("h2");
            let information = document.createElement("div");
            let br = document.createElement("br");
            let button = document.createElement("button");
            let line = document.createElement("hr");
            id.innerHTML = `Id ${book.id}`;
            name.innerHTML = book.nome;
            information.innerHTML = `${book.autor} / ${book.editora} / ${book.ano}`;
            button.innerHTML = "Excluir";
            button.addEventListener("click", () => {
                fetch(`https://academico.espm.br/testeapi/livro/excluir/${book.id}`, {
                    method: "GET"
                })
                    .then(response => response.json())
                    .then(() => {
                    let data = document.querySelector('#data');
                    while (data.lastChild) {
                        data.removeChild(data.lastChild);
                    }
                    this.getMethod();
                })
                    .catch(error => {
                    alert(`Error: ${error}`);
                });
            });
            div.appendChild(id);
            div.appendChild(name);
            div.appendChild(information);
            div.appendChild(br);
            div.appendChild(button);
            div.appendChild(line);
            document.querySelector("#data").appendChild(div);
        });
    }
}
let form = new Form("form");
let data = new Data("data");
