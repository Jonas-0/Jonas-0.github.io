//scene
const containerDiv = document.getElementById( 'threeDiv' );
const container = document.getElementById( 'threeJSDiv' );
const containerGUI = document.getElementById( 'threeGUIDiv' );
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( containerDiv.offsetWidth +32, 600 );
renderer.domElement.style.position = "relative";
renderer.domElement.style.left = "-16px";
containerDiv.appendChild( renderer.domElement );

//camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;
camera.position.y = 10;
const controls = new THREE.OrbitControls( camera, renderer.domElement );

//initial calc of magnetic lines
PHSK_MagLineCalc();

// Draw wire endpoints as spheres
const geometryWireEndpoints = new THREE.SphereGeometry( 0.1, 8, 8 );
const materialWire = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

const sphere1 = new THREE.Mesh( geometryWireEndpoints, materialWire );
const sphere2 = new THREE.Mesh( geometryWireEndpoints, materialWire );
scene.add( sphere1 );
scene.add( sphere2 );
sphere1.position.set( wire[0].x, wire[0].y,wire[0].z  );
sphere2.position.set( wire[wireLength-1].x, wire[wireLength-1].y,wire[wireLength-1].z );

//WireLines
const linePoints = [];
for (let i = 0; i < wireLength; i++) {
  linePoints.push(new THREE.Vector3( wire[i].x, wire[i].y, wire[i].z ));
}
const geometryLine = new THREE.BufferGeometry().setFromPoints( linePoints );
const line = new THREE.Line( geometryLine, materialWire );
scene.add( line );

function UpdateLineDraw(){
	for (let i = 0; i < wireLength; i++) {
		linePoints[i] = new THREE.Vector3( wire[i].x, wire[i].y, wire[i].z );
	}
	geometryLine.setFromPoints(linePoints);
	line.geometry = geometryLine;
}


//MagLines
const materialCyan = new THREE.MeshBasicMaterial( { color: 0x008080 } );//cyan: color: 0x00ffff
const linePointsMagFolder = [];
var linePointsMag = [];
for(let i = 0; i < 26; i++){
	linePointsMag = [];
	for (let j = 0; j < magLineNumber; j++) {
		linePointsMag.push(new THREE.Vector3( maglines[i][j].x, maglines[i][j].y, maglines[i][j].z ));
	}
	linePointsMagFolder.push(linePointsMag);
}
var geometryLineMag = [];
const lineMag = [];
for(let i = 0; i < 26; i++){
	geometryLineMag.push(new THREE.BufferGeometry().setFromPoints( linePointsMagFolder[i]));
	lineMag.push(new THREE.Line( geometryLineMag[i], materialCyan ));
	scene.add( lineMag[i] );
}
function UpdateMagLineDraw(){
	for(let i = 0; i < 26; i++){
		for (let j = 0; j < magLineNumber; j++) {
			linePointsMagFolder[i][j] = (new THREE.Vector3( maglines[i][j].x, maglines[i][j].y, maglines[i][j].z ));
		}
	}
	for(let i = 0; i < 26; i++){
		geometryLineMag[i].setFromPoints( linePointsMagFolder[i]);
		lineMag[i].geometry= geometryLineMag[i];
	}
	
}

//Mag Target

const geometryCylinder = new THREE.CylinderGeometry( 0.12, 0.12, 0.8, 16 );
const materialOpt = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
const cylinder = new THREE.Mesh( geometryCylinder, materialOpt );
scene.add( cylinder );

const geometryCone = new THREE.ConeGeometry( 0.24,  0.4, 16 );
const cone = new THREE.Mesh( geometryCone, materialOpt );
scene.add( cone );
cone.position.set( 0.0, 0.6,0.0  );


// 1u Display
const materialLineU = new THREE.LineBasicMaterial( { color: 0x000000 } );
materialLineU.transparent = true;
materialLineU.opacity = 0.0;
const pointsU = [];
pointsU.push(new THREE.Vector3(-4.0,0.0,1.8));
pointsU.push(new THREE.Vector3(-4.0,0.0,2.0));
pointsU.push(new THREE.Vector3(-3.0,0.0,2.0));
pointsU.push(new THREE.Vector3(-3.0,0.0,1.8));
const geometryU = new THREE.BufferGeometry().setFromPoints( pointsU );
const lineU = new THREE.Line( geometryU, materialLineU );
scene.add( lineU );

//1u text
const matLiteU = new THREE.MeshBasicMaterial( {
		color: 0x000000,
		transparent: true,
		opacity: 0.0,
		side: THREE.DoubleSide
	} );
const loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {


	const message = "1u";
	const shapesT = font.generateShapes( message, 0.4 );
	const geometryT = new THREE.ShapeGeometry( shapesT );
	geometryT.computeBoundingBox();
	const xMid = - 0.5 * ( geometryT.boundingBox.max.x - geometryT.boundingBox.min.x );
	geometryT.translate( xMid, 0, 0 );
	const textT = new THREE.Mesh( geometryT, matLiteU );
	//textT.position.z = - 150;
	textT.position.set( -3.6,0.1,2.0);
	scene.add( textT );
		

} );


//GUI

var folder1Dom;
var folder2Dom;
var folder3Dom;
var folder4Dom;
var percentProgress;

var panel = new dat.GUI( {autoPlace: false,width: 260} );
panel.domElement.style.position = "absolute";
panel.domElement.style.right = "0px";
panel.domElement.style.top = "10px";
panel.domElement.style.height = "600px";
containerDiv.appendChild(panel.domElement);
var folder1 = panel.addFolder( 'Visibility' );
var folder2 = panel.addFolder( 'Mutation Settings' );
var folder3 = panel.addFolder( 'Mutation' );
var folder4 = panel.addFolder( 'Progress' );
	
var	settings = {
	'Show wire': true,
	'Show magnetic field': true,
	'Show target': true,
	'Show unit [u]': false,
	 'Mutation range [u]': 6,
'Mutation parallel': 1,
	'#Mutations': 1,
 'x1': true,
	 'x10': false,
	 'x100': false,
	 'x1000': false,
	'x10000': false,
	 'Mutate!': function(){muteAmountQueues = muteAmount;},
	 'Reset': function(){ResetExperimnet();},
	 'Magnetic Field': "1.0",
	'Progress [%]': 0,
	 'Cancel': function(){muteAmountQueues = 0},
 };

function createPanel(){
	folder1.add( settings, 'Show wire' ).onChange( showWire );
	folder1.add( settings, 'Show magnetic field' ).onChange( showMag );
	folder1.add( settings, 'Show target' ).onChange( showTarget );
	folder1.add( settings, 'Show unit [u]' ).onChange( showUnit );
	folder2.add( settings, 'Mutation range [u]', 0.1, 10.0, 0.1 ).onChange(function(range){muteRange = range;});
	folder2.add( settings, 'Mutation parallel', 1, 16, 1 ).onChange(function(range){muteParallel = range;});
	let mAmount =  folder3.add( settings, '#Mutations', 1, 100, 1 ).onChange(function(amount){muteAmount = amount;});
	folder3.add( settings, 'x1' ).onChange( MuteFactor1 );
	folder3.add( settings, 'x10' ).onChange( MuteFactor10 );
	folder3.add( settings, 'x100' ).onChange( MuteFactor100 );
	folder3.add( settings, 'x1000' ).onChange( MuteFactor1000 );
	folder3.add( settings, 'x10000' ).onChange( MuteFactor10000);
	let mutateButton = folder3.add( settings, 'Mutate!' );
	let mutateButtonStyle  = mutateButton.domElement.previousSibling.style;
	mutateButtonStyle.backgroundColor = 'green';
	mutateButtonStyle.color  = 'black';
	let magField = folder3.add(settings,'Magnetic Field' ).onChange(function(value){settings['Magnetic Field'] = (Math.round(receiverVal*100)/100).toString();});
	//let magFieldStyle  = magField.domElement.previousSibling.style;
	//magFieldStyle.backgroundColor = 'green';
	//magFieldStyle.color  = 'black';
	let resetButton = folder3.add( settings, 'Reset' );
	let resetButtonStyle  = resetButton.domElement.previousSibling.style;
	resetButtonStyle.backgroundColor = 'red';
	resetButtonStyle.color  = 'black';

	folder4.add( settings, 'Progress [%]', 0, 100, 1 );
	percentProgress = settings['#Mutations'];
	let cancelButton = folder4.add( settings, 'Cancel' );
	let cancelButtonStyle  = cancelButton.domElement.previousSibling.style;
	cancelButtonStyle.backgroundColor = 'red';
	cancelButtonStyle.color  = 'black';
	folder1.open();
	folder2.open();
	folder3.open();
	folder4.open();
	function showWire( visibility ) {
		showWire = visibility;
		if(visibility){
			materialWire.transparent = false;
			materialWire.opacity = 1.0;
		}
		else{
			materialWire.transparent = true;
			materialWire.opacity = 0.0;
		}
		//UpdateLineDraw();
	}
	function showMag( visibility ) {
		showMagLine = visibility;
		if(visibility){
			materialCyan.transparent = false;
			materialCyan.opacity = 1.0;
		}
		else{
			materialCyan.transparent = true;
			materialCyan.opacity = 0.0;
		}
	}
	function showTarget( visibility ) {
		if(visibility){
			materialOpt.transparent = false;
			materialOpt.opacity = 1.0;
		}
		else{
			materialOpt.transparent = true;
			materialOpt.opacity = 0.0;
		}
	}
	function showUnit( visibility ) {
		showMagLine = visibility;
		if(visibility){
			materialLineU.transparent = false;
			materialLineU.opacity = 1.0;
			matLiteU.opacity = 0.8;
		}
		else{
			materialLineU.transparent = true;
			materialLineU.opacity = 0.0;
			matLiteU.opacity = 0.0;
		}
	}
	function MuteFactor1( visibility ) {
		settings['#Mutations'] /= muteAmountFactor ;
		muteAmountFactor = 1;
		settings['#Mutations'] *= muteAmountFactor;
		muteAmount = settings['#Mutations'];
		settings['x1'] = true;
		settings['x10'] = false;
		settings['x100'] = false;
		settings['x1000'] = false;
		settings['x10000'] = false;
		mAmount.min(1).max(100).step(1);
		folder3.updateDisplay();
	}
	function MuteFactor10( visibility ) {
		settings['#Mutations'] /= muteAmountFactor ;
		muteAmountFactor = 10;
		settings['#Mutations'] *= muteAmountFactor;
		muteAmount = settings['#Mutations'];
		settings['x1'] = false;
		settings['x10'] = true;
		settings['x100'] = false;
		settings['x1000'] = false;
		settings['x10000'] = false;
		mAmount.min(10).max(1000).step(10);
		folder3.updateDisplay();
	}
	function MuteFactor100( visibility ) {
		settings['#Mutations'] /= muteAmountFactor ;
		muteAmountFactor = 100;
		settings['#Mutations'] *= muteAmountFactor;
		muteAmount = settings['#Mutations'];
		settings['x1'] = false;
		settings['x10'] = false;
		settings['x100'] = true;
		settings['x1000'] = false;
		settings['x10000'] = false;
		mAmount.min(100).max(10000).step(100);
		folder3.updateDisplay();
	}
	function MuteFactor1000( visibility ) {
		settings['#Mutations'] /= muteAmountFactor ;
		muteAmountFactor = 1000;
		settings['#Mutations'] *= muteAmountFactor;
		muteAmount = settings['#Mutations'];
		settings['x1'] = false;
		settings['x10'] = false;
		settings['x100'] = false;
		settings['x1000'] = true;
		settings['x10000'] = false;
		mAmount.min(1000).max(100000);
		folder3.updateDisplay();
	}
	function MuteFactor10000( visibility ) {
		settings['#Mutations'] /= muteAmountFactor ;
		muteAmountFactor = 10000;
		settings['#Mutations'] *= muteAmountFactor;
		muteAmount = settings['#Mutations'];
		settings['x1'] = false;
		settings['x10'] = false;
		settings['x100'] = false;
		settings['x1000'] = false;
		settings['x10000'] = true;
		mAmount.min(10000).max(1000000);
		folder3.updateDisplay();
	}
	
	folder1Dom = folder1.domElement;
	folder2Dom = folder2.domElement;
	folder3Dom = folder3.domElement;
	folder4Dom = folder4.domElement;
	folder4Dom.hidden = true;

}
createPanel();

//Reset button. All to beginning
function ResetExperimnet(){
	wire[0] =new Vec3(-4.0,2.0,-2.0);
	wireM[0] =new Vec3(-4.0,2.0,-2.0);
	for (let i = 1; i < wireLength-1; i++) {
		wire[i] = (new Vec3(-4.0,2.0,0.0));
		wireM[i] = (new Vec3(-4.0,2.0,0.0));
	}
	wire[wireLength-1] = new Vec3(-4.0,2.0,2.0);
	wireM[wireLength-1] = new Vec3(-4.0,2.0,2.0);
	
	PHSK_CheckOpt();
	PHSK_CheckMute();
	UpdateLineDraw();
	PHSK_MagLineCalc();
	UpdateMagLineDraw();
	
	settings['Magnetic Field'] = (Math.round(receiverVal*100)/100).toString();
	folder3.updateDisplay();
}

//init
function OnStart(){
	PHSK_CheckOpt();
	settings['Magnetic Field'] = (Math.round(receiverVal*100)/100).toString();
	folder3.updateDisplay();
}
OnStart();

//window resize for camera and containers
function onWindowResize() {
	renderer.setSize( containerDiv.offsetWidth +32, 600 );
	 camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener( 'resize', onWindowResize, false );

//clock for frame time
let clock = new THREE.Clock();

//actual update if mutations to do. Stops at some point in frame to make an update and continue mutating in next frame, so there are no long freezes.
function animate() {
	clock.start();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	while(muteAmountQueues> 0 ){
		muteAmountQueues--;
		if(PHSK_MutateWireExperiment()){
			UpdateLineDraw();
			PHSK_MagLineCalc();
			UpdateMagLineDraw();
			settings['Magnetic Field'] = (Math.round(receiverVal*100)/100).toString();
			folder3.updateDisplay();
			break;
		}
		
		if(clock.getElapsedTime()> 0.01)
			break;
	}
	settings['Progress [%]'] = 100 -( muteAmountQueues*100 / muteAmount);
	folder4.updateDisplay();
	if(muteAmountQueues == 0){
		folder1Dom.hidden = false;
		folder2Dom.hidden = false;
		folder3Dom.hidden = false;
		folder4Dom.hidden = true;
	}
	else{
		folder1Dom.hidden = false;
		folder2Dom.hidden = true;
		folder3Dom.hidden = true;
		folder4Dom.hidden = false;
	}
	
}
animate();