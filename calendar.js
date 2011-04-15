$.fn.calendar = function(selectableDates, onselected) {
	var container = $(this).addClass("calendar");
	var months = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	var today = new Date();
	var visibleDate = today;

	function render(container) {
		var visibleSelectableDates = [];
		for (var i in selectableDates) {
			if (selectableDates[i].getFullYear() === visibleDate.getFullYear() &&
				selectableDates[i].getMonth() === visibleDate.getMonth()) {
				visibleSelectableDates.push(selectableDates[i].toDateString());
			}
		}
		$("<a href='#' class='previous'>&lt;</a>").appendTo(container).click(function () {
			visibleDate = new Date(visibleDate.getMonth() > 0 ? visibleDate.getFullYear() : visibleDate.getFullYear() - 1,
				visibleDate.getMonth() > 0 ? visibleDate.getMonth() - 1 : 11, 1);
			render(container.empty());
			return false;
		});
		$("<h3>" + months[visibleDate.getMonth()] + "</h3>").appendTo(container);
		$("<h4>" + visibleDate.getFullYear() + "</h4>").appendTo(container);
		$("<a href='#' class='next'>&gt;</a>").appendTo(container).click(function () {
			visibleDate = new Date(visibleDate.getMonth() < 11 ? visibleDate.getFullYear() : visibleDate.getFullYear() + 1,
				visibleDate.getMonth() < 11 ? visibleDate.getMonth() + 1 : 0, 1);
			render(container.empty());
			return false;
		});

		$("<ul class='week header'/>").appendTo(container).append(
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
		var week = $("<ul class='week'/>").appendTo(container);
		for (; dayIndex < firstDaysIndex; dayIndex++) {
			week.append("<li class='day index" + dayIndex.toString() + "'></li>");
		}
		for (day = 1; day < lastDayInMonth + 1; day++) {
			var date = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), day);

			var dayUI = $("<li class='day index" + dayIndex.toString() + " number" + day.toString() + "'>" + day.toString() + "</li>")
				.appendTo(week);

			if (date.toDateString() === today.toDateString()) {
				dayUI.addClass("today");
			}

			if (visibleSelectableDates.indexOf(date.toDateString()) > -1) {
				dayUI.addClass("special").click((function (date) {
					return function onclick() {
						if (onselected) {
							onselected.call(container.get(), date);
							return false;
						}
					};
				}(date)));
			}

			if (dayIndex++ === 7) {
				week = $("<ul class='week'/>").appendTo(container);
				dayIndex = 1;
			}
		}
		for (; dayIndex < 8; dayIndex++) {
			week.append("<li class='day index" + dayIndex.toString() + "'></li>");
		}

		return container;
	}

	return render(container.empty());
};