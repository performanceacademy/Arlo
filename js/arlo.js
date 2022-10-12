(function ($, ElementQueries) {
    document.addEventListener("arlojscontrolsloaded", function () {
        var platformID = "firstaid.arlo.co"; // Change platformID to point at your own account

        var filter = {
            moduleType: "Filters",
            targetElement: "#filters",
            template: "#filter-template",
            filterControlId: 1
        };

        var eventList = {
            moduleType: "UpcomingEvents",
            targetElement: "#upcoming-events",
            template: "#upcoming-events-template",
            maxCount: 20,
            filterControlId: 1,
            includeLoadMoreButton: true,
            loadMoreButtonText: "Show More",
            smartDateFormats: {
                startDay: "DD"
            },
            customUrls: {
                eventtemplate: "/course/",
                venue: "/venue/",
                presenter: "/presenter/"
            },
            callbacks: {
                onShow: addMonthDivider
            }
        };

        var app = new window.ArloWebControls();

        app.start({
            "platformID": platformID,
            "showDevErrors": false,
            "modules": [eventList, filter]
        });

    });

    /* ----- Callback function ----- */

    // "OnShow" callback
    window.addMonthDivider = function(getEventListItemsFunction) {
        var listItems = getEventListItemsFunction();
        var monthDivider = [];

        $(listItems).each(function(i, item) {
            var $item = $(item);
            if ($item.hasClass("arlo-list-divider")) {
                $item.remove();
                return;
            }
            if ($item.attr("class") == "arlo-event-listitem") {

                var date = $item.find(".arlo-date--hidden").text().trim();

                if (i === 0) {
                    var prevItem = $item.prevAll(".arlo-event-listitem:first");
                    var prevDate = $(prevItem).find(".arlo-date--hidden").text().trim();
                    if(prevDate === date) {
                        monthDivider.push(date);
                        return;
                    }
                }

                if ($item.prev(".arlo-month-divider").text() !== date) {
                    if(date.length > 0 && monthDivider.indexOf(date) < 0) {
                        monthDivider.push(date);
                        var $monthEle = $("<span class='arlo-text-color-primary'></span>").text(date.slice(0, -5)),
                            $yearEle = $("<span class='arlo-text-color-light'></span>").text(date.slice(-5)),
                            $dividerEle = $("<h1 class='arlo-list-divider clearfix'></h1>").append($monthEle).append($yearEle);
                        $item.before($dividerEle);
                    }
                }
            }

        });

        // Add list header
        var $listHeaderEle = $("<li class='arlo-event-listheader'><div class='arlo-date-header'>Date</div><div class='arlo-title-header'>Course</div><div class='arlo-offer-header'>Price</div><div class='arlo-region-header'>Location</div><div class='arlo-link-header'></div></li>");

        var eventList = $("#upcoming-events > ul.arlo-event-list");

        if(eventList.find('.arlo-event-listheader').length < 1) {
            eventList.prepend($listHeaderEle);
        }

    }


})(jQuery, window.ElementQueries);
