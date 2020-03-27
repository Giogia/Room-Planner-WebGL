import {MDCRipple} from "@material/ripple/component";

import {toggleView} from "./view";
import {deleteDrawing, editDrawing} from "./draw";
import {app} from "./app";
import {removeDraggableObject} from "./objects";

let legenda = document.getElementById('legenda');

export let drawButtons, modelButtons, viewButton, firstIcon, secondIcon, editButton, deleteButton, removeButton;
export let currentMode;

export function createButtons(){

    viewButton = document.getElementById('view-button');

    viewButton.onmouseover = () => {
        viewButton.style.transform = 'translateY(3%)';
    };
    viewButton.onmouseout = () => {
        viewButton.style.transform = 'translateY(-3%)';
    };

    firstIcon = document.getElementById('first-icon');
    secondIcon = document.getElementById('second-icon');

    drawButtons = document.getElementById('draw-buttons');
    drawButtons.style.display = 'none';

    deleteButton = createIconButton('clear', drawButtons);
    editButton = createIconButton( 'create', drawButtons);

    hideButton(deleteButton);
    hideButton(editButton);

    modelButtons = document.getElementById('model-buttons');

    removeButton = createIconButton('delete_forever', modelButtons);
    removeButton.style.color = 'white';
    removeButton.style.backgroundColor = 'lightcoral';

    hideButton(removeButton);

    activateModelButtons();

}


function createIconButton(name, buttons){

    let button = document.createElement('button');
    button.className = 'mdc-fab mdc-fab--mini';
    button.id = name;

    buttons.appendChild(button);

    let icon = document.createElement('a');
    icon.className = 'material-icons mdc-fab__icon';
    icon.innerText = name;
    button.appendChild(icon);

    let toggle = new MDCRipple(button);

    return button
}


export function activateButtons(){

    activateDrawButtons();
    activateModelButtons();

    viewButton.addEventListener('click', viewMode);
    viewButton.addEventListener('click', toggleView);
}


export function deactivateButtons(){

    deactivateDrawButtons();
    deactivateModelButtons();

    viewButton.removeEventListener('click', viewMode);
    viewButton.removeEventListener('click', toggleView);
}


export function activateDrawButtons(){
    editButton.addEventListener('click', editMode);
    deleteButton.addEventListener('click', deleteMode);
}


export function activateModelButtons(){
}


export function deactivateDrawButtons(){

    editButton.removeEventListener('click', editMode);
    deleteButton.removeEventListener('click', deleteMode);
}


export function deactivateModelButtons(){
}


export function viewMode(){
    app.removeEventListener('click', removeDraggableObject);
    app.removeEventListener( 'click', editDrawing);
    app.removeEventListener( 'click', deleteDrawing);
}

export function editMode(){
    currentMode = "edit";
    app.addEventListener( 'click', editDrawing);
    app.removeEventListener( 'click', deleteDrawing);
    app.removeEventListener('click', removeDraggableObject);
}


export function deleteMode(){
    currentMode = "delete";
    app.addEventListener( 'click', deleteDrawing);
    app.removeEventListener( 'click', editDrawing);
    app.removeEventListener('click', removeDraggableObject);
}


export function showDrawButtons(){

    drawButtons.style.display = 'flex';

    setTimeout(() => {
        showButton(editButton);
    }, 200);

    setTimeout(() => {
        showButton(deleteButton);
    }, 400);
}


export function hideDrawButtons(){
    hideButton(deleteButton);

    setTimeout(() => {
        hideButton(editButton);
    }, 200);

    setTimeout( () => {
        drawButtons.style.display = 'none';
    }, 400);

}


export function showModelButtons(){
    modelButtons.style.display = 'flex';

    setTimeout( () => {
    }, 200);

}


export function hideModelButtons(){

    setTimeout( () => {
        modelButtons.style.display = 'none';
    }, 200);
}


export function showDrawIcon(){
    hideButton(firstIcon);
    setTimeout( () => {
        firstIcon.style.display = 'none';
        secondIcon.style.display = 'block';
        showButton(secondIcon);
    }, 100);

}


export function showModelIcon(){
    hideButton(secondIcon);
    setTimeout( () => {
        secondIcon.style.display = 'none';
        firstIcon.style.display = 'block';
        showButton(firstIcon);
    }, 100);
}


export function showLegenda(){
    legenda.style.opacity = 1;
}

export function hideLegenda(){
    legenda.style.opacity = 0;
}


export function hideButton(element){
    element.style.transform = 'scale(0)';
    element.onmouseover = null;
    element.onmouseout = null;
}


export function showButton(element){
    element.style.transform = 'scale(1)';

    element.onmouseover = () => {
        element.style.transform = 'translateY(3%)';
    };
    element.onmouseout = () => {
            element.style.transform = 'translateY(-3%)';
    };
}


