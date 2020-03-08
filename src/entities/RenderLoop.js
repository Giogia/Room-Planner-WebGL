class RenderLoop{

	constructor(callback,fps){

		this.isActive = false;			//Control the On/Off state of the render loop

		this.fps = 0;					//Save the value of how fast the loop is going.
		this.fpsLimit = 0;				//Limit how many frames per second the loop should do.
		this.fpsCounter = 0;			//Constant count of how many frames have been rendered.
		this.fpsLast = null;			//Track time last FPS value was reported

		this.startTime = 0;
		this.lastFrame = null;			//The time in milliseconds of the last frame.

		this.callBackFunc = callback;
		this.runFunc = null;

		this.setFPSLimit( (fps !== undefined && fps > 0)? fps:0 );
	}

	start(){
		this.isActive = true;
		this.startTime =
			this.lastFrame =
				this.fpsLast = performance.now();

		window.requestAnimationFrame(this.runFunc);
		return this;
	}

	stop(){ this.isActive = false; }

	setFPSLimit(fps){

		if(fps <= 0){
			this.fpsLimit = 0;
			this.runFunc = this.runFull.bind(this);

		}else{
			this.fpsLimit = 1000/fps;
			this.runFunc = this.runLimit.bind(this);
		}
	}

	runLimit(){

		//Calculate delta time between frames and the FPS currently.
		let msCurrent	= performance.now(),
			msDelta		= (msCurrent - this.lastFrame),
			deltaTime	= msDelta / 1000.0,
			sinceStart	= msCurrent - this.startTime;

		if(msDelta >= this.fpsLimit){ //Now execute frame since the time has elapsed.
			this.fps		= Math.floor(1/deltaTime);
			this.lastFrame	= msCurrent;
			this.callBackFunc(deltaTime,sinceStart);
		}

		if(this.isActive) window.requestAnimationFrame(this.runFunc);
	}

	runFull(){

		//Calculate delta time between frames and the FPS currently.
		let msCurrent	= performance.now(),
			deltaTime	= (msCurrent - this.lastFrame) / 1000.0,
			sinceStart	= msCurrent - this.startTime;

		//Track how my frames have passed in one second of time.
		this.fpsCounter++;

		if(msCurrent - this.fpsLast >= 1000){
			this.fps		= this.fpsCounter;
			this.fpsCounter	= 0;
			this.fpsLast	= msCurrent;
		}

		//Now execute frame since the time has elapsed.
		//this.fps			= Math.floor(1/deltaTime); //Time it took to generate one frame, divide 1 by that to get how many frames in one second.
		this.lastFrame		= msCurrent;
		this.callBackFunc(deltaTime,sinceStart);

		if(this.isActive)	window.requestAnimationFrame(this.runFunc);
	}
}

export default RenderLoop