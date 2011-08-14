/*global $*/
/*jslint nomen:false onevar:false */

$.fn.calendar = function (options) {

	function createCalendar(input) {
		var selectableDates = options.selectableDates || undefined;
		var onselected = options.onselected;
		var multiple = options.multiple || false;

		input.hide().removeClass("calendar");
		var months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		var today = new Date();
		var visibleDate = today;
		var originalContainer = $(input.get());
		var selectedDates = originalContainer.val() !== '' ? originalContainer.val().split("; ") : [];
		var visual = $("<div class='visual'/>");
		var container = $("<div class='calendar'/>");
		originalContainer.replaceWith(container);
		container.append(visual);
		container.append(originalContainer);

		function render(visual) {
			var visibleSelectableDates, i;
			if (selectableDates) {
				visibleSelectableDates = [];
				for (i in selectableDates) {
					if (selectableDates[i].getFullYear() === visibleDate.getFullYear() &&
						selectableDates[i].getMonth() === visibleDate.getMonth()) {
						visibleSelectableDates.push(selectableDates[i].toDateString());
					}
				}
			}
			$("<a href='#' class='previous'>&lt;</a>").appendTo(visual).click(function () {
				visibleDate = new Date(visibleDate.getMonth() > 0 ? visibleDate.getFullYear() : visibleDate.getFullYear() - 1,
					visibleDate.getMonth() > 0 ? visibleDate.getMonth() - 1 : 11, 1);
				render(visual.empty());
				return false;
			});
			$("<h3>" + months[visibleDate.getMonth()] + "</h3>").appendTo(visual);
			$("<h4>" + visibleDate.getFullYear() + "</h4>").appendTo(visual);
			$("<a href='#' class='next'>&gt;</a>").appendTo(visual).click(function () {
				visibleDate = new Date(visibleDate.getMonth() < 11 ? visibleDate.getFullYear() : visibleDate.getFullYear() + 1,
					visibleDate.getMonth() < 11 ? visibleDate.getMonth() + 1 : 0, 1);
				render(visual.empty());
				return false;
			});

			$("<ul class='week header'/>").appendTo(visual).append(
				"<li class='day index1'>Mon</li>",
				"<li class='day index2'>Tue</li>",
				"<li class='day index3'>Wed</li>",
				"<li class='day index4'>Thu</li>",
				"<li class='day index5'>Fri</li>",
				"<li class='day index6'>Sat</li>",
				"<li class='day index7'>Sun</li>"
				);

			var lastDayInMonth = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 0).getDate();
			var firstDaysIndex = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1).getDay();
			var day = 0, dayIndex = 1;
			var week = $("<ul class='week'/>").appendTo(visual);
			for (; dayIndex < firstDaysIndex; dayIndex += 1) {
				week.append("<li class='day index" + dayIndex.toString() + "'></li>");
			}
			for (day = 1; day < lastDayInMonth + 1; day += 1) {
				var date = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), day);

				var dayUI = $("<li class='day index" + dayIndex.toString() + " number" + day.toString() + "'>" + day.toString() + "</li>")
					.appendTo(week);

				if (selectedDates.indexOf(date.toDateString()) > -1) {
					dayUI.addClass("selected");
				}
				if (visibleSelectableDates && visibleSelectableDates.indexOf(date.toDateString()) > -1) {
					dayUI.empty().append("<a href='#'>" + day.toString() + "</a>").addClass("special")
				}
				if (!visibleSelectableDates || (visibleSelectableDates && visibleSelectableDates.indexOf(date.toDateString()) > -1)) {
					dayUI.click((function (date, dayUI) {
						return function onclick() {
							if (!multiple) {
								selectedDates = [];
							}
							if (selectedDates.indexOf(date.toDateString()) === -1) {
								selectedDates.push(date.toDateString());
							} else {
								selectedDates.splice(selectedDates.indexOf(date.toDateString()), 1);
							}
							originalContainer.val(selectedDates.join("; "));
							if (multiple) {
								dayUI.toggleClass("selected");
							} else {
								$(".day.selected", visual).removeClass("selected");
								dayUI.toggleClass("selected");
							}
							if (onselected) {
								onselected.call(container.get(), date);
								return false;
							}
						};
					}(date, dayUI)));
				}

				if (date.toDateString() === today.toDateString()) {
					dayUI.addClass("today");
				}

				if (dayIndex++ === 7) {
					week = $("<ul class='week'/>").appendTo(visual);
					dayIndex = 1;
				}
			}
			console.log("dayIndex", dayIndex);
			for (; dayIndex > 1 && dayIndex < 8; dayIndex++) {
				week.append("<li class='day index" + dayIndex.toString() + "'></li>");
			}

			return visual;
		}

		render(visual.empty());
		return container;
	}

	return $($(this).map(function (index, value) {
		if (value.nodeName !== "INPUT") {
			throw new Error("Calendar is only available for input elements");
		}
		return createCalendar($(value)).get(0);
	}));
};