'use strict';
import '@google/model-viewer';
import {furniture} from "./furnitureList";

let ul, found, completeList;

let list = document.getElementById('list');
let form = document.getElementById('search-form');
let search = document.getElementById('search-icon');


function init(){
    createList();
    form.onsubmit = updateList;
    search.addEventListener('click', updateList);
}


function createList(){

    completeList = getList();
    list.appendChild(completeList);
}


function updateList(event){

    event.preventDefault();

    let search = document.getElementById('search-input').value;

    list.removeChild(ul);
    ul = (search)? getList(search.toLowerCase()) : completeList;
    list.appendChild(ul);
}


function getList(word){

    ul = document.createElement('ul');

    found = false;

    for (let object of furniture){

        if(word === undefined || object.includes(word)){

            found = true;

            let li = document.createElement('li');
            ul.appendChild(li);

            let model = document.createElement('model-viewer');

            model.src = './models/furniture/' + object + '.glb';
            model.id = object;
            model.autoRotate = 'true';
            model.exposure = 0.5;
            li.appendChild(model);
        }
    }

    if(found === false){

        let message = document.createElement('div');
        message.className = "mdc-typography";
        message.innerText = "No results found";
        message.id = 'search-message';
        ul.appendChild(message);
    }

    return ul
}


init();

