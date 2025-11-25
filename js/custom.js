var prevScrollpos = window.pageYOffset;
var myDiv = document.querySelector('body')
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > 80) {
    myDiv.classList.add("scrollDown");
  } else {
    myDiv.classList.remove("scrollDown");
  }

  if (prevScrollpos > currentScrollPos) {
    myDiv.classList.remove("scrollUp");
  } else {
    myDiv.classList.add("scrollUp");
  }

  if (currentScrollPos + window.innerHeight >= myDiv.scrollHeight) {
    myDiv.classList.remove("scrollUp");

  }

  prevScrollpos = currentScrollPos;
}

function scrollStop (callback, refresh = 1000) {

	// Make sure a valid callback was provided
	if (!callback || typeof callback !== 'function') return;

	// Setup scrolling variable
	let isScrolling;

	// Listen for scroll events
	window.addEventListener('scroll', function (event) {

		// Clear our timeout throughout the scroll
		window.clearTimeout(isScrolling);

		// Set a timeout to run after scrolling ends
		isScrolling = setTimeout(callback, refresh);

	}, false);

}

scrollStop(function () {
    myDiv.classList.add("scrollUp");
});





var mainMenu = document.getElementById('icon-menu');
mainMenu.onclick = function() {toggleActive()};

function toggleActive() {
  mainMenu.classList.toggle("active");;
}




function myFunctLink() {
  if (screen.width > 992) {
    var parentLink = document.querySelector('.navbar .dropdown > a')
      location.href = parentLink.attributes.href.value;
  }
}


function copyClipBoard(n) {
  var copyText = document.getElementById("code-" + n);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  
  var tooltip = document.getElementById("copyClipBoard-" + n);
  tooltip.innerHTML = "Copied";
  tooltip.classList.add('active')
}

function outFunc(n) {
  var tooltip = document.getElementById("copyClipBoard-" + n);
  tooltip.innerHTML = " ";
  tooltip.classList.remove('active')
}

var vidP = document.getElementById("hero-video-pc"); 
var vidM = document.getElementById("hero-video-mobile");
var vid;
var play = true;

function playpause() {
  var widthDevice = innerWidth;
  (widthDevice >= 768) ? vid = vidP : vid = vidM;
  (play) ? vid.pause() : vid.play();
  play = !play;
} 

function startvideo() {
   document.getElementById("video-wrap").style.opacity = 1;
   document.getElementById("video-wrap").style.display = 'block';
   document.getElementById("hero-ship").style.display = 'none';
   
   vid.play()
}


var navHeader = document.getElementById('navbarNavDropdown');
var navToggler = document.getElementById('icon-menu');

document.getElementById('navbar-scroll').onclick = function() {
  navToggler.classList.remove('active')
  navHeader.classList.remove('show')
  }
 



