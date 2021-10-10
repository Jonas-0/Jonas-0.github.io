

var wireLength = 16;

//main wire creating magnetic field
var wire =[new Vec3(-4.0,2.0,-2.0)];		//first point
for (let i = 0; i < wireLength -3; i++) { 
  wire.push(new Vec3(-4.0,2.0,0.0));		//centerpieces
}
wire.push(new Vec3(-4.0,2.0,2.0));			//last point
wire.push(new Vec3(-4.0,2.0,-2.0));			//back to first

//mutated wire creating magnetic field
var wireM =[new Vec3(-4.0,2.0,-2.0)];		//first point
for (let i = 0; i < wireLength -3; i++) {
  wireM.push(new Vec3(-4.0,2.0,0.0));		//centerpieces
}
wireM.push(new Vec3(-4.0,2.0,2.0));			//last point
wireM.push(new Vec3(-4.0,2.0,-2.0));			//back to first

//magnetic lines visualized; startingpositions in grid 3x3x3 except the centerposition, so 27-1 = 26
var magLineNumber =  1024; //1360
var magLineStep = 0.05;
var maglines = [];
for (let j = 0; j < 26; j++){ 
  let magLine =[];
  for (let i = 0; i < magLineNumber; i++) {
    magLine.push(new Vec3(0.0,0.0,0.0));
  }
  maglines.push(magLine);
}


// Arrow to be optimized by magnetic field
var receiverPos = new Vec3(0.0,0.5,0.0);
var receiverDir = new Vec3(0.0,1.0,0.0);
var receiverVal = -1000.0;
var receiverMVal = -1000.0;
var receiverDeadRadiusInner = 1.0;
var receiverDeadRadiusOuter = 4.2;

//mutation parameters
var muteRange = 6.0;
var muteParallel = 1;
var muteAmount = 1;
var muteAmountFactor = 1;
var muteAmountQueues = 0;
var muteActiveGlobal = false;
var muteSuccesful = 0;

//visualization
var showWire = true ;
var showMagLine = true;



//statrting point to get wireM by mutating wire. Function to be called outside
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

	while (mutationParallelPoint < wireLength-2) {
		if (mutationParallelPoint - mutationPoint + 1 >= muteParallel) {
			lastParallelPoint = 1;
		}
		else {
			lastParallelPoint = 0;
		}
		if (mutationParallelPoint == wireLength - 3) {
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
//muatate single v3 point
function PHSK_MutateSinglePoint( mutationParallelPoint) {
	wireM[mutationParallelPoint] = GMTR_MutateVector(wire[mutationParallelPoint], muteRange);
	return 0;
}
//Check if mutated point collides with inner or outer limits. Check only line with previous point. Not line with next point, bc next point not mutated yet, so this line will change and checked later.
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
//Check if mutated point collides with inner or outer limits. Check only line with previous point and with next point. If next point is not to be changed. For example last point.
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
//calculate magnetic field receiverVal , the value to be optimized. Magnetic field by wire (non mutated)
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
//calculate magnetic field receiverMVal , the value to be optimized. Magnetic field by wireM (mutated)
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
// if otimization point of muation receiverMVal > receiverVal, then mutation is successful as it improves the system
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
//set wireM to wire. Helping function, for case of collision. 
function PHSK_ResetMute() {
	for (let i = 0; i < 16; i++) {
		wireM[i].x = wire[i].x;
		wireM[i].y = wire[i].y;
		wireM[i].z = wire[i].z;
	}
	return 0;
}
//calculates magnetic field of an array 'draht' (wire or wireM) in point 'BPoint'
function PHSK_BFeld( draht, BPoint) {
	if ( GMTR_MagnitudeSquared(  GMTR_CrossProduct( GMTR_VectorDifference(draht.a ,draht.b ),GMTR_VectorDifference(draht.a ,BPoint )  )) < 10E-10)
		return new Vec3 (0.0, 0.0, 0.0);


	let A = draht.a;
	let B = draht.b;
	let P = BPoint;
	
	let xd = -(GMTR_DotProduct(A,A) - GMTR_DotProduct(A,B) + GMTR_DotProduct(P , GMTR_VectorDifference(A,B))) / (GMTR_Distance(A,B));
	let x = xd / (GMTR_Distance(A,B));
	let yd = xd + GMTR_Distance(A,B);
	
	let F1 = (yd / GMTR_Distance(P,B)) - (xd / GMTR_Distance(P,A));
	let F2 = 1 / (GMTR_Distance(P,GMTR_VectorAddition(A,GMTR_ScalarMultiplication(  GMTR_VectorDifference(B,A), x))));
	let F3 = GMTR_CrossProductNormal( GMTR_VectorDifference(A,B),GMTR_VectorDifference(A,P) );

	return GMTR_ScalarMultiplication(F3,F1*F2);
}

//calculates the array for magnetic field lines 'maglines'
function PHSK_MagLineCalc() {
	//counter to avoid centerpiece
	let l = 0;
	for (let i = 0; i < 26; i++) {
			
		if(i == 13)
			l+=1;
		
		let anchorPos = new Vec3 ( - 4.5 + (4.5 * (l%3)) ,  - 4.5 + (4.5 * (Math.floor(l/3)%3))  , - 4.5 + (4.5 * (Math.floor(l/9)%3)));
		l+=1;
		//if(i%2 ==1)
		//	continue

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