const param =  new URLSearchParams(window.location.search);
const langParam = param.get('lang');

var profileJobTitle = document.getElementById('profile job title');
var profileLocation = document.getElementById('profile location');
var profileEmail = document.getElementById('profile email');

var skillsHeader = document.getElementById('skills header');
var skillsFirst = document.getElementById('skills first');
var skillsSecond = document.getElementById('skills second');
var skillsThird = document.getElementById('skills third');

var strengthsHeader = document.getElementById('strengths header');
var strengthsFirst = document.getElementById('strengths first');
var strengthsSecond = document.getElementById('strengths second');
var strengthsThird = document.getElementById('strengths third');

var interestsHeader = document.getElementById('interests header');
var interestsFirst = document.getElementById('interests first');
var interestsSecond = document.getElementById('interests second');
var interestsThird = document.getElementById('interests third');

var languagesHeader = document.getElementById('languages header');
var languagesGerman = document.getElementById('languages German');
var languagesEnglish = document.getElementById('languages English');

var workHeader = document.getElementById('working header');
var workTitle = document.getElementById('working title');
var workCurrent = document.getElementById('working current');
var workFirst = document.getElementById('working first');
var workSecond = document.getElementById('working second');
var workThird = document.getElementById('working third');

var educationHeader = document.getElementById('education header');
var educationMasterUni = document.getElementById('education master uni');
var educationMasterTitle = document.getElementById('education master title');
var educationBachelorUni = document.getElementById('education bachelor uni');
var educationBachelorTitle = document.getElementById('education bachelor title');

var portfolioHeader = document.getElementById('portfolio header');
var portfolioInfo = document.getElementById('portfolio info');

if(langParam == null || langParam.toLowerCase() == 'de'){
	SetGerman();
}
else{
	SetEnglish();
}

function SetEnglish(){
	profileJobTitle.innerHTML = 'Software Developer';
	profileLocation.innerHTML = 'Munich, DE';
	profileEmail.innerHTML = 'Jonas.Dev.Null@gmail.com';
	
	skillsHeader.innerHTML = 'Skills';
	skillsFirst.innerHTML = 'C#, Unity, Visual Studio';
	skillsSecond.innerHTML = 'C/C++, Python, JavaScript';
	skillsThird.innerHTML = 'Adobe Photoshop, FreeCAD, HTML, CSS';
	
	strengthsHeader.innerHTML = 'Strengths';
	strengthsFirst.innerHTML = 'Analytical thinking and problem-solving';
	strengthsSecond.innerHTML = 'Deep mathematical und physical understanding';
	strengthsThird.innerHTML = 'Willingness to learn new skills and technologies';
	
	interestsHeader.innerHTML = 'Interests';
	interestsFirst.innerHTML = 'Physical simulations';
	interestsSecond.innerHTML = 'Clean code';
	interestsThird.innerHTML = '3D printing';
	
	languagesHeader.innerHTML = 'Languages';
	languagesGerman.innerHTML = 'German';
	languagesEnglish.innerHTML = 'English';
	
	workHeader.innerHTML = 'Work Experience';
	workTitle.innerHTML = 'Software developer';
	workCurrent.innerHTML = 'Current';
	workFirst.innerHTML = 'Creating GUI prototypes for usability studies, trade fairs und expert assessments in the automotive sector.';
	workSecond.innerHTML = 'Working on multiple software projects from planning to delivery using C#, Unity platform and project-specific tools.';
	workThird.innerHTML = 'Taking on independent project work as well as project management including customer service.';
	
	educationHeader.innerHTML = 'Education';
	educationMasterUni.innerHTML = 'University of Freiburg';
	educationMasterTitle.innerHTML = 'MSc Physics';
	educationBachelorUni.innerHTML = 'University of Freiburg';
	educationBachelorTitle.innerHTML = 'BSc Physics';
	
	portfolioHeader.innerHTML = 'Portfolio';
	portfolioInfo.innerHTML = "Mutation of a <span style='color: red;'>current carrying conductor</span> to maximize the <span style='color: teal;'>magnetic field</span> in position and direction of <span style='color: blue; font-weight: bold; font-size: large;'>&#129045;</span>.<br>Tools: JavaScript and Three.js. I hereby assure that this program was made by myself.";
}
function SetGerman(){
	profileJobTitle.innerHTML = 'Softwareentwickler';
	profileLocation.innerHTML = 'München, DE';
	profileEmail.innerHTML = 'Jonas.Dev.Null@gmail.com';
	
	skillsHeader.innerHTML = 'Skills';
	skillsFirst.innerHTML = 'C#, Unity, Visual Studio';
	skillsSecond.innerHTML = 'C/C++, Python, JavaScript';
	skillsThird.innerHTML = 'Adobe Photoshop, FreeCAD, HTML, CSS';
	
	strengthsHeader.innerHTML = 'Stärken';
	strengthsFirst.innerHTML = 'Analytisches Denken und das Lösen komplexer Probleme';
	strengthsSecond.innerHTML = 'Gutes mathematisches und physikalisches Verständnis';
	strengthsThird.innerHTML = 'Lernbereitschaft für neue Fertigkeiten und Technologien';
	
	interestsHeader.innerHTML = 'Interessen';
	interestsFirst.innerHTML = 'Physikalische Simulationen';
	interestsSecond.innerHTML = 'Clean Code';
	interestsThird.innerHTML = '3D-Printing';
	
	languagesHeader.innerHTML = 'Sprachen';
	languagesGerman.innerHTML = 'Deutsch';
	languagesEnglish.innerHTML = 'Englisch';
	
	workHeader.innerHTML = 'Berufserfahrung';
	workTitle.innerHTML = 'Softwareentwickler';
	workCurrent.innerHTML = 'Jetzt';
	workFirst.innerHTML = 'Erstellen von GUI-Prototypen für Usabilitystudien, Messen und Expertenbewertungen im Automobilbereich.';
	workSecond.innerHTML = 'Entwicklung von Planung bis Auslieferung mit C#, Unity-Plattform und wechselnden projektspezifischen Tools.';
	workThird.innerHTML = 'Eigenständige Projektarbeit sowie Projektleitung mit Kundenbetreuung.';
	
	educationHeader.innerHTML = 'Ausbildung';
	educationMasterUni.innerHTML = 'Albert-Ludwigs-Universität Freiburg';
	educationMasterTitle.innerHTML = 'MSc Physik';
	educationBachelorUni.innerHTML = 'Albert-Ludwigs-Universität Freiburg';
	educationBachelorTitle.innerHTML = 'BSc Physik';
	
	portfolioHeader.innerHTML = 'Portfolio';
	portfolioInfo.innerHTML = "Mutation des <span style='color: red;'>stromdurchflossenen Leiters</span> um maximales <span style='color: teal;'>Magnetfeld</span> im Punkt und in Richtung des <span style='color: blue; font-weight: bold; font-size: large;'>&#129045;</span> zu erreichen.<br>Tools: JavaScript und Three.js. Ich versichere hiermit das Programm selber geschrieben zu haben.";
}