//Math and Geometry library.

function Vec3(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
function LineSeg(a,b) {
	this.a = a;
	this.b = b;
}
function Sphere(m,r) {
	this.m = m;
	this.r = r;
}

function GMTR_VectorAddition( a, b) {
	return new Vec3(a.x+b.x, a.y+b.y, a.z+b.z);
}

function GMTR_VectorDifference( a,  b) {
	return new Vec3( b.x - a.x, b.y - a.y, b.z - a.z );
}

function GMTR_Angle(a,  b){
	if (GMTR_Distance(a, b) < 10E-10)
		return 0.0;
	return Math.acos(GMTR_DotProduct(a, b) / (GMTR_Magnitude(a) * GMTR_Magnitude(b)));
}
function GMTR_Angle_Reference(a,  b , r){
	let ar = GMTR_VectorDifference(r, a);
	let br = GMTR_VectorDifference(r, b);
	if (GMTR_Distance(ar, br) < 10E-10)
		return 0.0;
	return Math.acos(GMTR_DotProduct(ar, br) / (GMTR_Magnitude(ar) * GMTR_Magnitude(br)));
}
function GMTR_AngleSeg( a, b) {
	return GMTR_Angle(GMTR_LineSegToVector(a), GMTR_LineSegToVector(b));	
}
function GMTR_Projection(v3Input,  projektionsachse) {
	if (GMTR_Magnitude(projektionsachse) < 10E-10)
		return new Vec3( 0.0, 0.0, 0.0 );
	return GMTR_ScalarMultiplication(projektionsachse, (GMTR_DotProduct(v3Input, projektionsachse) / GMTR_DotProduct(projektionsachse, projektionsachse)));
}
function GMTR_ProjectionMagnitude( v3Input,  projektionsachse) {
	return GMTR_Magnitude(GMTR_Projection(v3Input, projektionsachse));
}

function GMTR_MoveLineSeg( lS,  mover) {
	return new LineSeg ( GMTR_VectorAddition(lS.a, mover), GMTR_VectorAddition(lS.b, mover) );
}
function GMTR_LineSegToVector(ls) {
	return new Vec3 (ls.b.x - ls.a.x, ls.b.y - ls.a.y, ls.b.z - ls.a.z);
}
function GMTR_VectorsToLineSeg( v1,  v2) {
	return new LineSeg (v1,v2);
}
function GMTR_Magnitude( v3input) {
	return Math.sqrt(v3input.x*v3input.x + v3input.y*v3input.y + v3input.z*v3input.z);
}
function GMTR_MagnitudeSquared( v3input) {
	return GMTR_DotProduct(v3input,v3input);
}
function GMTR_Length(lsinput) {
	return GMTR_Magnitude(GMTR_LineSegToVector(lsinput));
}


function GMTR_Distance(v3a,  v3b) {
	return GMTR_Magnitude(GMTR_VectorAddition(v3a, GMTR_ScalarMultiplication(v3b, -1.0)));
}

function GMTR_Normalize(v3input){ // 10E-10 smallest Magnitude
	let mag = GMTR_Magnitude(v3input);
	if (mag < 10E-10)
		return new Vec3 ( 0.0, 0.0, 0.0 );
	else
		return GMTR_ScalarMultiplication(v3input, (1.0 / mag));
}
function GMTR_ChangeSize( v3input ,size) {
	return GMTR_ScalarMultiplication(GMTR_Normalize(v3input), size);
}
function GMTR_OrthoVector( v3input) {
	if (v3input.x < 1E-10) {
		return new Vec3 (1.0,0.0,0.0);
	}
	else if (v3input.y < 1E-10) {
		return new Vec3  (0.0, 1.0, 0.0);
	}
	return new Vec3 ( v3input.y, -1.0 *v3input.x, 0.0 );
}

function GMTR_DotProduct( a,b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function GMTR_ScalarMultiplication(v3input, skalar) {
	return new Vec3 ( v3input.x * skalar, v3input.y * skalar, v3input.z * skalar );
}

function GMTR_CrossProduct( a, b) {
	return new Vec3 ( a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x );
}

function GMTR_CrossProductNormal( a, b) {
	return GMTR_Normalize(GMTR_CrossProduct(a,b));
}
//dropped perpendicular foot 
function GMTR_Lotfusspunkt( strecke, punkt) {
	let streckeNull = GMTR_MoveLineSeg(strecke, GMTR_ScalarMultiplication(punkt, -1.0));
	let streckeNullVec = GMTR_LineSegToVector(streckeNull);

	if (GMTR_Length(strecke) < 10E-10)
		return punkt;

	//x + sigma*(y-x) straight line equation
	let sigma = -1.0*GMTR_DotProduct(streckeNull.a, streckeNullVec) / GMTR_DotProduct(streckeNullVec, streckeNullVec);
	let lfpNull = GMTR_VectorAddition(streckeNull.a , GMTR_ScalarMultiplication(streckeNullVec, sigma));

	return GMTR_VectorAddition(lfpNull, punkt);
}
//dropped perpendicular foot + sigma from straight line equation
function GMTR_LotfusspunktSigma( strecke, punkt) {
	let streckeNull = GMTR_MoveLineSeg(strecke, GMTR_ScalarMultiplication(punkt, -1.0));
	let streckeNullVec = GMTR_LineSegToVector(streckeNull);

	if (GMTR_Length(strecke) < 10E-10)
		return new Sphere ( punkt , 0.0 );

	//x + sigma*(y-x) straight line equation
	let sigma = -1.0*GMTR_DotProduct(streckeNull.a, streckeNullVec) / GMTR_DotProduct(streckeNullVec, streckeNullVec);
	let lfpNull = GMTR_VectorAddition(streckeNull.a, GMTR_ScalarMultiplication(streckeNullVec, sigma));

	return new Sphere ( GMTR_VectorAddition(lfpNull, punkt), sigma );
}

function GMTR_LineSegSphereCollision(ls,  sphr) //true if intersection exist //http://paulbourke.net/geometry/circlesphere/
{
	if (ls.a.x > sphr.m.x + sphr.r && ls.b.x > sphr.m.x + sphr.r)
		return 0;
	if (ls.a.x < sphr.m.x - sphr.r && ls.b.x < sphr.m.x - sphr.r)
		return 0;
	if (ls.a.y > sphr.m.y + sphr.r && ls.b.y > sphr.m.y + sphr.r)
		return 0;
	if (ls.a.y < sphr.m.y - sphr.r && ls.b.y < sphr.m.y - sphr.r)
		return 0;
	if (ls.a.z > sphr.m.z + sphr.r && ls.b.z > sphr.m.z + sphr.r)
		return 0;
	if (ls.a.z < sphr.m.z - sphr.r && ls.b.z < sphr.m.z - sphr.r)
		return 0;


	let a = 1 * (ls.b.x - ls.a.x)*(ls.b.x - ls.a.x) + (ls.b.y - ls.a.y)*(ls.b.y - ls.a.y) + (ls.b.z - ls.a.z)*(ls.b.z - ls.a.z);
	let b = 2 * ((ls.b.x - ls.a.x)*(ls.a.x - sphr.m.x) + (ls.b.y - ls.a.y)*(ls.a.y - sphr.m.y) + (ls.b.z - ls.a.z)*(ls.a.z - sphr.m.z));
	let c = sphr.m.x * sphr.m.x + sphr.m.y * sphr.m.y + sphr.m.z * sphr.m.z + ls.a.x * ls.a.x + ls.a.y * ls.a.y + ls.a.z * ls.a.z - 2 * (sphr.m.x*ls.a.x + sphr.m.y * ls.a.y + sphr.m.z * ls.a.z) - sphr.r* sphr.r;


	if (b*b - 4 * a*c > 0)
		return 1;
	else
		return 0;
}
function GMTR_DistanceLinePoint( a, b,  point) {
	let ab = GMTR_VectorDifference(b, a);
	let ab_D = GMTR_Magnitude(ab);
	if (ab_D < 10E-10) {
		return GMTR_Distance(a,point);
	}

	let ap = GMTR_VectorDifference(point, a);
	return GMTR_Magnitude(GMTR_CrossProduct(ab, ap)) / ab_D;
}

function GMTR_DistanceLineSegPoint( ls, point) {
	let lsVec = GMTR_VectorDifference(ls.b, ls.a);
	let poinVeca = GMTR_VectorDifference(point, ls.a);

	//If Point before a then distance to a
	if (GMTR_DotProduct(poinVeca, lsVec) <= 0.0) {  
		return GMTR_Distance(ls.a,point);
	}

	//If Point before b then distance to b
	let poinVecb = GMTR_VectorDifference(point, ls.b);
	if (GMTR_DotProduct(poinVecb, lsVec) >= 0.0) {
		return GMTR_Distance(ls.b, point);
	}

	return GMTR_DistanceLinePoint(ls.a,ls.b,point);
}


function GMTR_RamdomInit() {
	//relic from C. Not needed for javaScript. In theory every time once at start of program you need to create a new seed, otherwise ramdom generator has same outcome.
	//srand(time(NULL));
	return 0;
}

function GMTR_RandomFloat( min,  max) {
	return min + (Math.random() * (max - min));
}

function GMTR_RandomVector( min, max) {
	return new Vec3 ( GMTR_RandomFloat(min.x, max.x), GMTR_RandomFloat(min.y, max.y), GMTR_RandomFloat(min.z, max.z) );
}

function GMTR_MutateVector( vInput,muteRange) {
	return  new Vec3 ( vInput.x + GMTR_RandomFloat(-muteRange, muteRange), vInput.y + GMTR_RandomFloat(-muteRange, muteRange), vInput.z + GMTR_RandomFloat(-muteRange, muteRange) );
}

