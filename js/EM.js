
var wire =[new Vec3(-4.0,2.0,-2.0)];
for (let i = 0; i < 14; i++) {
  wire.push(new Vec3(-4.0,2.0,0.0));
}
wire.push(new Vec3(-4.0,2.0,2.0));

var wireM =[new Vec3(-4.0,2.0,-2.0)];
for (let i = 0; i < 14; i++) {
  wireM.push(new Vec3(-4.0,2.0,0.0));
}
wireM.push(new Vec3(-4.0,2.0,2.0));

var magLineNumber = 1024;
var magLineStep = 0.1;
var maglines = [];
for (let j = 0; j < 26; j++){ 
  let magLine =[];
  for (let i = 0; i < magLineNumber; i++) {
    magLine.push(new Vec3(0.0,0.0,0.0));
  }
  maglines.push(magLine);
}

var wireLength = 16;

var receiverPos = new Vec3(0.0,0.5,0.0);
var receiverDir = new Vec3(0.0,1.0,0.0);
var receiverVal = -1000.0;
var receiverMVal = -1000.0;
var receiverDeadRadiusInner = 1.0;
var receiverDeadRadiusOuter = 4.2;

var muteRange = 2.0;
var muteParallel = 1;
var muteAmount = 1;
var muteAmountFactor = 1;
var muteAmountQueues = 0;
var muteActiveGlobal = false;
var showWire = true ;
var showMagLine = true;
var muteSuccesful = 0;




function PHSK_MutateWireExperiment(){

	let mutationPoint = 1;
	let mutationParallelPoint = 1;
	let wireLength = 16;
	let lastParallelPoint = 0;
	let collision = 0;
	let collisionParallel = 0;
	let collisionCounter = 0;
	collisionParallel = muteParallel; 
	PHSK_CheckOpt();
	let successful = 0;

	while (mutationParallelPoint < wireLength-1) {
		if (mutationParallelPoint - mutationPoint + 1 >= muteParallel) {
			lastParallelPoint = 1;
		}
		else {
			lastParallelPoint = 0;
		}
		if (mutationParallelPoint == wireLength - 2) {
			lastParallelPoint = 1;
		}
		collision = 1;
		
		collisionCounter = 0;

		while (collision != 0 && collisionCounter < 1000) {
			collisionCounter += 1;
			PHSK_MutateSinglePoint(mutationParallelPoint);

			if (lastParallelPoint == 1) {
				collision = PHSK_CheckFullCollsion(mutationParallelPoint);
			}
			else {
				collision = PHSK_CheckHalfCollsion(mutationParallelPoint);
			}
		}
		if (collision == 0) {
			collisionParallel -= 1;
		}
		if (collision == 0 && lastParallelPoint == 1 && collisionParallel == 0) {
			PHSK_CheckMute();
			if (PHSK_AdoptMute() == 1) {
				successful = 1;
			}
			collisionParallel = muteParallel;
		}
		if (collision == 1) {
			PHSK_ResetMute();
		}

		if (lastParallelPoint == 1 || collision == 1) {
			mutationPoint += 1;
			mutationParallelPoint = mutationPoint;
			collisionParallel = muteParallel;
		}
		else {
			mutationParallelPoint += 1;
		}
	}
	return successful;
}

function PHSK_MutateSinglePoint( mutationParallelPoint) {
	wireM[mutationParallelPoint] = GMTR_MutateVector(wire[mutationParallelPoint], muteRange);
	return 0;
}

function PHSK_CheckHalfCollsion(mutationParallelPoint) {
	
	let deadZone = new Sphere (receiverPos , receiverDeadRadiusInner);
	if (GMTR_LineSegSphereCollision(GMTR_VectorsToLineSeg(wireM[mutationParallelPoint - 1], wireM[mutationParallelPoint]), deadZone) == 1) {
		return 1;
	}
	if (wireM[mutationParallelPoint].x > receiverDeadRadiusOuter || wireM[mutationParallelPoint].x < -receiverDeadRadiusOuter)
		return 1;
	if (wireM[mutationParallelPoint].y > receiverDeadRadiusOuter || wireM[mutationParallelPoint].y < -receiverDeadRadiusOuter)
		return 1;
	if (wireM[mutationParallelPoint].z > receiverDeadRadiusOuter || wireM[mutationParallelPoint].z < -receiverDeadRadiusOuter)
		return 1;
	
	return  0;
}
function PHSK_CheckFullCollsion(mutationParallelPoint) {

		let deadZone = new Sphere ( receiverPos, receiverDeadRadiusInner );
		if (GMTR_LineSegSphereCollision(GMTR_VectorsToLineSeg(wireM[mutationParallelPoint - 1], wireM[mutationParallelPoint]), deadZone) == 1) {
			return 1;
		}
		else if (GMTR_LineSegSphereCollision(GMTR_VectorsToLineSeg(wireM[mutationParallelPoint], wireM[mutationParallelPoint +1]), deadZone) == 1) {
			return 1;
		}
		if (wireM[mutationParallelPoint].x > receiverDeadRadiusOuter || wireM[mutationParallelPoint].x < -receiverDeadRadiusOuter)
			return 1;
		if (wireM[mutationParallelPoint].y > receiverDeadRadiusOuter || wireM[mutationParallelPoint].y < -receiverDeadRadiusOuter)
			return 1;
		if (wireM[mutationParallelPoint].z > receiverDeadRadiusOuter || wireM[mutationParallelPoint].z < -receiverDeadRadiusOuter)
			return 1;

	return  0;
}

function PHSK_CheckOpt() {
	let bfeld = new Vec3(0.0,0.0,0.0);
	let bfeldSum= new Vec3(0.0,0.0,0.0);

	receiverVal = 0.0;

	for (let i = 1; i < 16; i++) {
		bfeld = PHSK_BFeld(GMTR_VectorsToLineSeg(wire[i - 1], wire[i]), receiverPos);
		bfeldSum = GMTR_VectorAddition(bfeldSum, bfeld);
		receiverVal += GMTR_ProjectionMagnitude(bfeld, receiverDir);
	}
	return 0;
}

function PHSK_CheckMute() {
	let bfeld = new Vec3(0.0,0.0,0.0);
	let bfeldSum= new Vec3(0.0,0.0,0.0);

	receiverMVal = 0.0;
		
	for (let i = 1; i < 16; i++) {
		bfeld = PHSK_BFeld(GMTR_VectorsToLineSeg(wireM[i - 1], wireM[i]), receiverPos);
		bfeldSum = GMTR_VectorAddition(bfeldSum, bfeld);
		receiverMVal += GMTR_ProjectionMagnitude(bfeld , receiverDir);
	}
	return 0;
}

function PHSK_AdoptMute() {
	let successful = 0;
	if (receiverMVal > receiverVal) {
		for (let i = 0; i < 16; i++) {
			wire[i].x = wireM[i].x;
			wire[i].y = wireM[i].y;
			wire[i].z = wireM[i].z;
		}
		muteSuccesful += 1;
		receiverVal = receiverMVal;
		successful = 1;
	}
	else {
		for (let i = 0; i < 16; i++) {
			wireM[i].x = wire[i].x;
			wireM[i].y = wire[i].y;
			wireM[i].z = wire[i].z;
		}
		receiverMVal = receiverVal;
	}
	return successful;
}

function PHSK_ResetMute() {
	for (let i = 0; i < 16; i++) {
		wireM[i].x = wire[i].x;
		wireM[i].y = wire[i].y;
		wireM[i].z = wire[i].z;
	}
	return 0;
}

function PHSK_BFeld( draht, BPoint) {
	if (GMTR_Length(draht) < 10E-10)
		return new Vec3 (0.0, 0.0, 0.0);

	let lfpS = GMTR_LotfusspunktSigma(draht, BPoint);
	let lfp = lfpS.m;
	let sigma = lfpS.r;
	let lfpBPoinDistance = GMTR_Distance(BPoint, lfp);

	if (lfpBPoinDistance < 10E-10)
		return new Vec3 ( 0.0, 0.0, 0.0 );

	let alphaA = GMTR_Angle(draht.a, lfp);
	let alphaB = GMTR_Angle(draht.b, lfp);

	if (sigma < 0.0) {
		alphaA *= -1.0;
		alphaB *= -1.0;
	}
	else if (sigma < 1.0) {
		alphaB *= -1.0;
	}

	let magnitude = (Math.sin(alphaA) - Math.sin(alphaB)) / lfpBPoinDistance; // Achtung Division 0

	let direction = GMTR_CrossProductNormal(GMTR_VectorDifference(lfp,BPoint), GMTR_VectorDifference(draht.b,  draht.a));
	return GMTR_ScalarMultiplication(direction, magnitude);
}

function PHSK_MagLineCalc() {
	let k = 0;
	for (let i = 0; i < 26; i++) {
		
		//counter to avoid centerpiece
		
		if(i == 13)
			k+=1;
		
		let anchorPos = new Vec3 ( - 4.5 + (4.5 * (k%3)) ,  - 4.5 + (4.5 * (Math.floor(k/3)%3))  , - 4.5 + (4.5 * (Math.floor(k/9)%3)));
		k+=1;
		//console.log("x ",anchorPos.x ," y ",anchorPos.y," z ",anchorPos.z);
		maglines[i][magLineNumber/2] = anchorPos;
		
		for (let j =(magLineNumber/2 -1); j >= 0; j--) {
			let bfeld = new Vec3(0.0,0.0,0.0);
			let bfeldSum= new Vec3(0.0,0.0,0.0);
			for (let k = 1; k < wireLength; k++) {
				bfeld = PHSK_BFeld(GMTR_VectorsToLineSeg(wire[k - 1], wire[k]),maglines[i][j + 1]);
				bfeldSum = GMTR_VectorAddition(bfeldSum, bfeld);
			}
			maglines[i][j] = GMTR_VectorAddition(maglines[i][j + 1], GMTR_ChangeSize(bfeldSum, magLineStep));
		}
		for (let j = (magLineNumber/2 +1); j < magLineNumber; j++) {
			let bfeld = new Vec3(0.0,0.0,0.0);
			let bfeldSum= new Vec3(0.0,0.0,0.0);
			for (let k = 1; k < wireLength; k++) {
				bfeld = PHSK_BFeld(GMTR_VectorsToLineSeg(wire[k - 1], wire[k]), maglines[i][j - 1]);
				bfeldSum = GMTR_VectorAddition(bfeldSum, bfeld);
			}
			maglines[i][j] = GMTR_VectorAddition(maglines[i][j - 1],  GMTR_ChangeSize(bfeldSum, -magLineStep));
		}
	}
		
	return 0;
}