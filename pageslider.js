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

        self.snip = function (query) {
            $(query, "[data-PageSlider]").each(function (_, e) {
                var i = stateHistory.indexOf($(e).attr('data-PageSlider'));
                if (i >= 0)
                    stateHistory.splice(i, 1);
            });
        }

        self.back = function () {
            var
                prev = stateHistory.length - 2,
                ret = prev >= 0;
            if (ret)
                self.slidePage($("[data-PageSlider='" + stateHistory[prev] + "']"));
            return ret;
        };

        // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
        self.slidePage = function (page, after, from) {

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
                self.slidePageFrom(page, after, from || 'page-left');
            } else {
                stateHistory.push(state);
                self.slidePageFrom(page, after, from || 'page-right');
            }

        };

        // Use this function directly if you want to control the sliding direction outside PageSlider
        self.slidePageFrom = function (page, after, from) {

            container.append(page);

            (after || function(page, next) { next(page); })(page, function(_page) {
                page = _page || page;

                if (!currentPage || !from) {
                    page.addClass("page page-center");
                    page.removeClass("page-left page-right");
                    currentPage = page;
                    if (self.beforeSlidePage)
                        self.beforeSlidePage(page, from);
                    return;
                }

                self.slidePageCore(page, from, function (e) {
                    if (from == "page-left")
                        $(e.target).remove();
                });
            });
        };

        self.slidePageCore = function(page, from, end) {

            if (self.beforeSlidePage)
                self.beforeSlidePage(page, from);

            // Position the page at the starting position of the animation
            page.removeClass("page-left page-right page-center transition");
            page.addClass("page " + from);
            page.removeClass("page-finished");

            currentPage.one('webkitTransitionEnd', function (e) {
                $(e.target).addClass("page-finished");
                if (end)
                    end(e);
            })

            // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
            container[0].offsetWidth;

            // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
            page.addClass("page transition page-center");
            page.removeClass("page-left page-right");
            currentPage.removeClass("page-left page-right page-center");
            currentPage.addClass("page transition " + (from === "page-left" ? "page-right" : "page-left"));
            currentPage = page;
        };

    };

});
