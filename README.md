PageSlider
==========

A simple library providing hardware accelerated page transitions for Mobile Apps
This fork doesn't use jQuery, but does use pageJS

usage:

var slider = app.slider = new PageSlider(document.getElementById("container"));
slider.slidePage(domElement, ctx);

ctx should contain the ctx var from page.js
