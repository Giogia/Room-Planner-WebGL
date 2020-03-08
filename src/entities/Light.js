import Transform from "./Transform.js";
import {ubo} from "../app2.js";
import utils from "../maths/Utils.js";

class Light extends Transform{
    constructor(color = [1,1,1], ambientColor = [0.3,0.3,0.3]){
        super();
        this.color = color;
        this.ambientColor = ambientColor;

        this.ubo = ubo;
        this.update();
    }

    setPosition(x,y,z){
        this.position.set(x,y,z);
        this.update();
    }

    setColor(color){
		this.color = (color.length === 3)? color : utils.hexToRgb(color);
		this.update();
	}

	setAmbientColor(color){
		this.ambientColor = (color.length === 3)? color : utils.hexToRgb(color);
		this.update();
	}

    update(){

        this.ubo.setItem( "light_position", this.position.array());
        this.ubo.setItem( "light_color", this.color );
        this.ubo.setItem( "ambient_light_color", this.ambientColor );
        this.ubo.update();
    }
}

export default Light