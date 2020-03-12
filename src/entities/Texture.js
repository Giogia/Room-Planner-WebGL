import gl from "../webGL.js";
import * as webGL from "../webGL.js";

class Texture {
    constructor(name) {

        this.texture = gl.createTexture();

        let image = new Image();
        image.src = './assets/materials/' + name + '_diffuse.jpg';

        image.addEventListener('load', ()=>{

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            let filter = gl.NEAREST;
            let wrap = gl.REPEAT;

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,	filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,	filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,		wrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,		wrap);

            gl.bindTexture(gl.TEXTURE_2D,null);
        });

        webGL.env.textures.set(name, this.texture);

        return this.texture
    }
}

export default Texture