var svgContainer = document.querySelector('svg');
var reset = document.getElementById('reset');

var tl = new TimelineMax({onComplete:function(){	nudge();	}});

var nudged;
var vbAmount = 900;
var vbX = 0;
var speed = 0;
var dur = 0.3;

var prevIndex;
var currIndex;
var nextIndex;


// The first click should NOT move it 2x the amount of the other clicks


// Get the SVG with the dolls
// We want to have all dolls in one SVG so we only need one AJAX call
var srcDolls; // Var to hold the dolls SVG


getDolls(); // Really need to find a better way to do this. Not optimal.







function dragViewBox() {
	
	Draggable.create("#doll_0", {
		type:"x",
		onDrag: function() {
			
			var val = this.x * -1;
			TweenMax.set(container, {attr:{viewBox:val+" 0 1600 900"}});
		}
	})
	
}







var nudge = function() {
		
	TweenMax.delayedCall(8, nudgeUser);
	
}




function nudgeUser() {	
	
	if(prevIndex != undefined) {
		
		var target = '#doll_' + currIndex + ' > g';
		
	} else {
		
		var target = '#doll_0 > g';		
		
	}
	
	// Clear the timeline if already exists
	if(nudged) nudged.clear();
	// Make a new one, with a new target
	nudged = rockDoll(target, 1.5, 3);		
	
	nudge();
};


reset.addEventListener('click', resetTL);





function getDolls() {

	var svgURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/259155/russianDolls.svg";

	var request = new XMLHttpRequest();
	request.open('GET', svgURL, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			// Get the XML that came back from the request
			// Select the element by its ID and store it into the srcDolls var
			srcDolls = request.responseXML.getElementById("RussianDolls");

			// We want to nest a whole SVG inside the parent SVG, that way we can scale/control/place it more easily as a group.			

			// Now that we have the data from the extenal file, we can start creating our dolls
			createDoll();

		} else {
			// We reached our target server, but it returned an error
			console.log("ERROR Returned");
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		console.log("CONNECTION ERROR!!!!");
	};

	request.send();

}







function createDoll(index) {
	// Each doll should be a self-contained SVG with the same characteristics of the srcDolls but inside of a <g> tag so we can transform it more easily
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

	// Clone the main SVG node
	var svg = srcDolls.cloneNode(true);
	
	g.appendChild(svg);
	
	// It's easier to remove the nodes already in than to recreate the SVG - I think.
	// So, build an array with all the children from the HTMLCollection object returned
	var gees = Array.prototype.slice.call(svg.childNodes);
	// Remove the <defs> tag
	gees.shift();
	// Remove the <title> tag
	gees.shift();
	
	// Pick a doll index at random
	var randIndex = gees.indexOf(gees[Math.floor(Math.random() * gees.length)]);
	// And remove it from the gees array
	var splice = gees.splice(randIndex, 1);
	// TO DO: Rewrite the above two lines as one and write a comment to expalin what it is doing

	// Remove from the original SVG everything that was left in the array
	gees.forEach(function(i) {
		svg.removeChild(i);
	});

	// If index is undefined, this is the mother doll.
	if (index == undefined) {
		currIndex = 0;
		nextIndex = currIndex + 1;

		createMother(svg);

	} else {
		
		currIndex = index;
		prevIndex = currIndex - 1;
		nextIndex = currIndex + 1;

		createDaughter(svg);
	}

	// Enable click on the new doll
	svg.addEventListener('click', onClick);


}







function createMother(svg) {
	// Name the mother accordingly regardless of its original id
	svg.id = "doll_0";

	// We're appending her on her own
	svgContainer.appendChild(svg);

	// Use GSAP to position the mother doll
	TweenMax.set("#" + svg.id, {
		attr: {
			x: "37.5%",
			y: "30%",
			height: "70%"
		}
	});

	// Add a reference label to the timeline
	tl.add("doll_0");
	
	// Make the mother draggable
	dragViewBox();
	

}







function createDaughter(svg) {
	
	// Change the id of the doll to better identify them
	svg.id = 'doll_' + currIndex;

	// We're appending the new doll behind the current doll
	var currentDoll = document.getElementById('doll_' + prevIndex);
	
	// We want to place the new doll inside of the <g class="doll"> for animation purposes
	// It turns out that Safari, Firefox, Chrome, Opera all support getElementsByClassName() on SVG objects.
	// HOWEVER - None of the MS browsers do. Typical.
	// So we can't do the bellow - 
	// var node = currentDoll.getElementsByClassName('doll');
	
	// Then, let's try something else. We can do this because we have complete control of the SVG hierarchy tree...
	var node = currentDoll.childNodes[2];
	node.insertBefore(svg, node.childNodes[0]);	
	
	// animate the doll
	animateDoll(currentDoll, svg);
	
}












function getDollNum(trgDoll) {
	
	if (trgDoll) {
		var result = Number(trgDoll.id.split('doll_')[1]);
	} else {
		var result = 0;
	}

	return result;
}








function onClick(e) {
	
	// Show the reset button
	TweenMax.to(reset, dur, {autoAlpha:1})

	// Stop the event from propagating
	e.stopPropagation();
	// We only need the top level target
	var thisTarget = e.currentTarget;
		
	// Kills the nudge call
	TweenMax.killDelayedCallsTo(nudgeUser);
	
	
	// Update the index number
	currIndex = getDollNum(thisTarget);
	
	var amount = nextIndex - currIndex;
		
	// Should we create a new doll
	if (currIndex == (nextIndex - 1)) {
				
		// Reset the timeline's timeScale
		tl.timeScale(1);

		// Create a new doll
		createDoll(nextIndex);
		
	} else {
				
		// Check where in the timeline are we
		if (tl.currentLabel() == ("doll_" + currIndex)) {

			// Adjust the timescale of the timeline to stop the user from waiting too long
			tl.timeScale(amount);
			
			currIndex = nextIndex - 1;
			
			// Play the animation
			tl.play();
						
		} else {

			// Adjust the timescale of the timeline to stop the user from waiting too long
			tl.timeScale(amount);

			// Reverse the animation
			tl.tweenTo(thisTarget.id, {onComplete:function(){
				nudge();
			}});
			
			// Move the viewbox
			// moveViewBox(currIndex);
			
			// If we're back to the mother doll, hide the reset button
			if( tl.currentLabel() == "doll_1") {
				TweenMax.to(reset, dur, {autoAlpha:0});
			}
			
		}

	}
	
}







function moveViewBox(amount, reset) {
	
	console.log(amount);
	
		
	if(reset) {
		
		TweenMax.to(container, 1, {attr:{viewBox:amount+" 0 1600 900"}, ease:Power1.easeInOut});		
		
	} else {
		
		TweenMax.to(container, dur, {attr:{viewBox:amount+" 0 1600 900"}, ease:Power1.easeInOut});		
		
	}
	
}





function resetTL() {
	
		// Hide the reset button
	TweenMax.to(reset, dur, {autoAlpha:0})

	
		// Kills the nudge call
		TweenMax.killDelayedCallsTo(nudgeUser);

	
	// Rewind the animation
	TweenMax.to(tl, 1, {
		time:0,
		onComplete:function(){
		
			// Clear the timeline of all we've created previously
			tl.clear();

			// Get rid of all children dolls
			var doll = document.getElementById("doll_1");
			if(doll) {
				doll.parentNode.removeChild(doll);				
			}

			// Clear any transformation we might have applied to the first doll's children
			TweenMax.set(["#doll_0 > g > #Top","#doll_0 > g > #Bottom"], {clearProps:"all"});

			// Reset the initial label
			tl.add("doll_0");

			// Reset the indexes
			prevIndex = undefined;
			currIndex = 0;
			nextIndex = 1;
			
		}
	});
	
	// Move the viewBox to the original position
	TweenMax.to(container, 1, {attr:{viewBox:"0 0 1600 900"}, clearProps:"all", ease:Power1.easeInOut});
	
	// And reset its variables:
	TweenMax.set(doll_0, {x:0})
	// vbX = 0;
}







function animateDoll(currentDoll, newDoll) {
	
	// Scale the new doll down a little bit
	TweenMax.set('#' + newDoll.id, {
		attr: {
			height: "95%",
			y: "4.5%",
			x: "2.6%"
		},
		transformOrigin: "50% 100%",
		autoAlpha:0
	});	
	
	// Stop any rocking animation that might be going on:
	tl.call(function() {
		if(nudged) nudged.pause();
	})
	// Move the doll back into place
	tl.to('#' + currentDoll.id + '> g', dur*0.5, {rotation:0, ease:Power4.easeOut});
	
	//
	// Jump
	tl.add(jumpDoll(currentDoll, newDoll));
	
	
	tl.add("Pop")
		// Open the parent doll
	tl.add(openTop(currentDoll, newDoll), "Pop")
	//
	// Pop the child out of the mother
	tl.add(popDoll(currentDoll, newDoll), "Pop")

	// Create a reference label
	tl.add(newDoll.id);
		
	// Force the timeline to play
	tl.play();

}




function openTop(currentDoll, newDoll) {
	var this_tl = new TimelineLite();
	
	this_tl.add("openTop")
	this_tl.to('#' + currentDoll.id + ' > g > #Top', dur, {
		y:"-1200",
		ease:Power2.easeOut
	}, "openTop");
	this_tl.to('#' + currentDoll.id + ' > g > #Top', dur*2, {
		y:"650",
		ease:Bounce.easeOut
	});
	this_tl.to('#' + currentDoll.id + ' > g > #Top', dur*2, {
		rotation: "-360deg",
		transformOrigin: "50% 50%"
	}, "openTop");
	this_tl.to('#' + currentDoll.id + ' > g > #Top', dur*4, {
		x:"-=1100",
	}, "openTop");

	
	return this_tl;
}




function rockDoll(el, amount, num) {
	
	var this_tl = new TimelineLite();
		
	for(var i =0; i < num; i++) {
		this_tl.add(TweenMax.to(el, dur*.5, {
				rotation: "-"+amount+"deg_short",
				transformOrigin: "0% 100%",
				ease:Power1.easeOut,
				repeat:1,
				yoyo:true,
		}));
		this_tl.add(TweenMax.to(el, dur*.5, {
				rotation: amount+"deg_short",
				transformOrigin: "100% 100%",
				ease:Power1.easeOut,
				repeat:1,
				yoyo:true,
				// clearProps:"all"
		}));
		
		amount = amount * amount;
		
	}
	
	return this_tl;
}




function jumpDoll(currentDoll, newDoll) {
	var this_tl = new TimelineLite();
	
	this_tl.to([
				'#' + currentDoll.id + ' > g > #Bottom',
				'#' + newDoll.id + ' > g'
			], dur*.05, {
		scaleY: 0.8,
		transformOrigin:"50% 100%",
		ease:Power2.easeOut
	})
	this_tl.to([
				'#' + currentDoll.id + ' > g > #Bottom',
				'#' + newDoll.id + ' > g'
			], dur*.05, {
		scaleY: 1.3,
		transformOrigin:"50% 100%",
		ease:Power2.easeIn
	})


	
	
	return this_tl;
}




function popDoll(currentDoll, newDoll) {
	var this_tl = new TimelineLite();
	
	this_tl.set('#' + newDoll.id, {autoAlpha:1})
	this_tl.add("pop")
	this_tl.to([
				'#' + currentDoll.id + ' > g > #Bottom',
			], dur, {
		scaleY: 1,
		transformOrigin:"50% 100%",
		ease:Back.easeOut
	}, "pop")
	this_tl.to('#' + newDoll.id, dur * 3, {
		attr: {
			x: "+=225%"
		},
		ease: Power1.easeInOut
	}, "pop");
	this_tl.to('#' + newDoll.id + ' > g', dur, {
		y:-1000,
		scale: 1,
		ease:Power2.easeOut
	}, "pop");
	this_tl.to('#' + newDoll.id + ' > g', dur, {
		y:0,
		ease:Bounce.easeOut
	}, "pop+="+dur);
	this_tl.to('#' + newDoll.id + ' > g', dur*2, {
		rotation:360,
		transformOrigin:"50% 50%",
		clearProps:"all",
		onComplete:function() {
			// moveViewBox(nextIndex);
		}
	}, "pop+="+dur*0.5)
	
	// Move the viewBox
	
	
	return this_tl;
}
