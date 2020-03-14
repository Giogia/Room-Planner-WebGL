import {app, camera, raycaster} from "../app";

class Raycaster{
    constructor() {
    }

    intersect(event,objects){

		let mouse = {
			x: ( event.clientX / app.clientWidth ) * 2 - 1,
			y: - ( event.clientY / app.clientHeight ) * 2 + 1
		};

		this.setFromCamera( mouse, camera );

		return this.intersectObjects( objects, true);
	}
}