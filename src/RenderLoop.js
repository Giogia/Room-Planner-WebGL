class RenderLoop{

	constructor(callback,fps){
		let loop = this;
		this.msLastFrame = null;	//The time in Miliseconds of the last frame.
		this.callBack = callback;	//What function to call for each frame
		this.isActive = false;		//Control the On/Off state of the render loop
		this.fps = 0;				//Save the value of how fast the loop is going.

		if(!fps && fps > 0){ //Build a run method that limits the framerate
			this.msFpsLimit = 1000/fps; //Calc how many milliseconds per frame in one second of time.

			this.run = function(){

				//Calculate Deltatime between frames and the FPS currently.
				let msCurrent	= performance.now(),
					msDelta		= (msCurrent - loop.msLastFrame),
					deltaTime	= msDelta / 1000.0;		//What fraction of a single second is the delta time

				if(msDelta >= loop.msFpsLimit){ //Now execute frame since the time has elapsed.
					loop.fps			= Math.floor(1/deltaTime);
					loop.msLastFrame	= msCurrent;
					loop.callBack(deltaTime);
				}

				if(loop.isActive) window.requestAnimationFrame(loop.run);
			}

		}else{ //Else build a run method thats optimised as much as possible.
			this.run = function(){
				//Calculate Deltatime between frames and the FPS currently.
				let msCurrent	= performance.now(),	//Gives you the whole number of how many milliseconds since the dawn of time :)
					deltaTime	= (msCurrent - loop.msLastFrame) / 1000.0;	//ms between frames, Then / by 1 second to get the fraction of a second.

				//Now execute frame since the time has elapsed.
				loop.fps			= Math.floor(1/deltaTime); //Time it took to generate one frame, divide 1 by that to get how many frames in one second.
				loop.msLastFrame	= msCurrent;

				loop.callBack(deltaTime);
				if(loop.isActive) window.requestAnimationFrame(loop.run);
			}
		}
	}

	start(){
		this.isActive = true;
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}

	stop(){ this.isActive = false; }
}