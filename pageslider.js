/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

	var currentPage;
	var stateHistory = [];

	// Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
	this.slidePage = function(page, ctx) {

		var l = stateHistory.length,
			prevState = stateHistory[l-1],
			state = ctx.pathname;

		// starting out
		if (l === 0) {
			stateHistory.push(state);
			this.slidePageFrom(page);
			return;
		}

		// going 'back'
		if (state === stateHistory[l-2]) {
			stateHistory.pop();
			this.slidePageFrom(page, 'left');
		
		// trying to go to the same page??
		} else if(prevState === ctx.pathname) {
			return;
		
		// going to a 'new' page
		} else {
			stateHistory.push(state);
			this.slidePageFrom(page, 'right');
		}

	};

	// Removes old pages from DOM after they transition out.
	$(container).on("webkitTransitionEnd", ".page.left, .page.right", function(event) {
		event.target.parentNode.removeChild(event.target);
	});

	// Use this function directly if you want to control the sliding direction outside PageSlider
	this.slidePageFrom = function(page, from) {

		container.appendChild(page);

		if (!currentPage || !from) {
			page.setAttribute("class", "page center");
			currentPage = page;
			return;
		}

		// Position the page at the starting position of the animation
		page.setAttribute("class", "page " + from);

		// Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
		container.offsetWidth;

		// Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
		setTimeout(function() {
			page.setAttribute("class", "page transition center");
			currentPage.setAttribute("class", "page transition " + (from === "left" ? "right" : "left"));
			currentPage = page;
		},5);
		
	};

}
