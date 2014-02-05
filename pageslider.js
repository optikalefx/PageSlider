define(function (require) {

    "use strict";

    var $ = require('jquery');

    return function PageSlider(container) {

        var self = this,
            currentPage,
            stateHistory = [];

        self.current = function () {
            return currentPage;
        };

        self.back = function () {
            var
                prev = stateHistory.length - 2,
                ret = prev >= 0;
            if (ret)
                self.slidePage($("[data-PageSlider='" + stateHistory[prev] + "']"));
            return ret;
        };

        // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
        self.slidePage = function (page, after) {

            var l = stateHistory.length,
                state = page.attr('data-PageSlider');

            if (!state)
                page.attr('data-PageSlider', state = Math.random() + "");

            if (l === 0) {
                stateHistory.push(state);
                self.slidePageFrom(page, after);
                return;
            }
            if (state === stateHistory[l - 2]) {
                stateHistory.pop();
                self.slidePageFrom(page, after, 'page-left');
            } else {
                stateHistory.push(state);
                self.slidePageFrom(page, after, 'page-right');
            }

        };

        // Use this function directly if you want to control the sliding direction outside PageSlider
        self.slidePageFrom = function (page, after, from) {

            container.append(page);

            (after || function(page, next) { next(page); })(page, function(_page) {
                page = _page || page;
                
                if (!currentPage || !from) {
                    page.attr("class", "page page-center");
                    currentPage = page;
                    return;
                }

                self.slidePageCore(page, from, function (e) {
                    if (from == "page-left")
                        $(e.target).remove();
                    else
                        $(e.target).addClass("finished");
                });
            });
        };
        
        self.slidePageCore = function(page, from, end) {

            // Position the page at the starting position of the animation
            page.attr("class", "page " + from);
            page.removeClass("finished");

            if (end)
                currentPage.one('webkitTransitionEnd', end);

            // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
            container[0].offsetWidth;

            // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
            page.attr("class", "page transition page-center");
            currentPage.attr("class", "page transition " + (from === "page-left" ? "page-right" : "page-left"));
            currentPage = page;
        };

    };

});
