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

        self.back = function(end) {
            var
                prev = stateHistory.length - 2,
                ret = prev >= 0;
            if (ret)
                self.slidePage($("[data-PageSlider='" + stateHistory[prev] + "']"), undefined, undefined, end);
            else if (end)
                end();
            return ret;
        };

        // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
        self.slidePage = function (page, after, from, end) {

            var l = stateHistory.length,
                state = page.attr('data-PageSlider');

            if (!state)
                page.attr('data-PageSlider', state = Math.random() + "");

            if (l === 0) {
                stateHistory.push(state);
                self.slidePageFrom(page, after, undefined, end);
                return;
            }
            if (state === stateHistory[l - 2]) {
                stateHistory.pop();
                self.slidePageFrom(page, after, from || 'page-left', end);
            } else {
                stateHistory.push(state);
                self.slidePageFrom(page, after, from || 'page-right', end);
            }

        };

        // Use this function directly if you want to control the sliding direction outside PageSlider
        self.slidePageFrom = function (page, after, from, end) {

            container.append(page);

            (after || function(page, next) { next(page); })(page, function(_page) {
                page = _page || page;

                if (!currentPage || !from) {
                    page.addClass("page page-center");
                    page.removeClass("page-left page-right");
                    currentPage = page;
                    if (self.beforeSlidePage)
                        self.beforeSlidePage(page, from);
                    if (end)
                        end();
                    return;
                }

                self.slidePageCore(page, from, function (oldPage) {
                    if (from === "page-left")
                        oldPage.not('.page-center').remove();
                    if (end)
                        end(oldPage);
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

            var oldPage = currentPage;
            currentPage = page;
            oldPage.one('webkitTransitionEnd', function (e) {
                oldPage.not('.page-center').addClass("page-finished");
                if (end)
                    end(oldPage);
            })

            // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
            container[0].offsetWidth;

            // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
            page.addClass("page transition page-center");
            page.removeClass("page-left page-right");
            oldPage.removeClass("page-left page-right page-center");
            oldPage.addClass("page transition " + (from === "page-left" ? "page-right" : "page-left"));
        };

    };

});
