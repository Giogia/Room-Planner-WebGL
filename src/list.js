'use strict';
import '@google/model-viewer';
import {furniture} from "./furnitureList";
import {MDCDrawer} from "@material/drawer/component";


let ul, found, completeList;

let list = document.getElementById('list');
let form = document.getElementById('search-form');
let search = document.getElementById('search-icon');


function run(){

    createList();

    let drawer = new MDCDrawer.attachTo(document.getElementsByClassName("mdc-drawer")[0]);
    setTimeout(()=>{drawer.open = true;},2100);

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

    if(found === false){

        let message = document.createElement('div');
        message.className = "mdc-typography";
        message.innerText = "No results found";
        message.id = 'search-message';
        ul.appendChild(message);
    }

    list.appendChild(ul);
}


function getList(word = undefined){

    ul = document.createElement('ul');

    found = false;

    setTimeout(()=>{

        for (let i = 0; i < furniture.length; i++){

            setTimeout(()=>{

                let object = furniture[i];

                if(word === undefined || object.includes(word)){

                found = true;

                let li = document.createElement('li');
                ul.appendChild(li);

                let model = document.createElement('model-viewer');

                model.src = './models/furniture/' + object + '.glb';
                model.id = object;
                model.autoRotate = 'true';
                model.exposure = 0.3;
                li.appendChild(model);
                }
            },  50 * i);
        }

    },2400);

    return ul
}

run();