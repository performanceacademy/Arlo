(function ($, ElementQueries) {
    document.addEventListener("arlojscontrolsloaded", function () {
        var platformID = "firstaid.arlo.co"; // Change platformID to point at your own account

        var eventTemplateModule = {
            moduleType: "EventTemplate",
            targetElement: "#arlo-event-template",
            template: "#event-template-template",
            queryStringConfig: ["eventtemplate"],
            maxCount: 1,
            includeLoadMoreButton: false
        };

        var app = new window.ArloWebControls();

        app.start({
            platformID: platformID,
            showDevErrors: false,
            modules: [eventTemplateModule]
        });
        window.loadedFilters = 0;
        window.loadedModules = 0;
    });

    window.loadModules = function () {
        //only load this when both events and OAs are loaded
        if (window.loadedModules == 2) {
            setTimeout(function () {
                // Hide the events section if this event is online only
                var eventTemplate = $('.arlo-eventtemplate-listitem'),
                    nEvents = $(eventTemplate).find(".arlo-event-listitem").length,
                    nOnlineActivities = $(eventTemplate).find('.arlo-oa-listitem').length;

                if (nOnlineActivities !== 0 && nEvents === 0) {
                    $(eventTemplate).find('.arlo-no-results-found').hide();
                    $(eventTemplate).find('.arlo-filters').hide();
                    $(eventTemplate).find('.arlo-register-interest-container').hide();
                }
            }, 0);

            window.loadedModules = 0;
        }
    }

    window.loadEvents = function (getEventListItemElements) {
        var eventItems = getEventListItemElements();
        var listParent = $(eventItems[0]).parent()[0];

        setTimeout(function () {
            afterRender();
        }, 0);

        function afterRender() {
            if (eventItems.length === 0) {
                listParent = $(".arlo-template-events");
            }

            setListLayout(eventItems, listParent);

            ElementQueries.init();

            setTimeout(function () {
                setListItemsHeight();
            }, 0);

            $(window).resize(function () {
                setListItemsHeight();
            });

            // Hide timezone selector if there are no online events
            if ($(".arlo-online").length < 1) {
                $(".arlo-timezone-select").hide();
            } else {
                $(".arlo-timezone-select").show();
                $(".arlo-timezone-select").parent().css("float", "right");
            }

            // Set up tooltips
            $.each(eventItems, function (index, listItem) {
                var tooltipElement = $(listItem).find('[data-toggle="tooltip"]')[0];
                if (tooltipElement) {
                    var toolTipContent = $(listItem).find(".tooltipcontent")[0];
                    if (toolTipContent) {
                        $(tooltipElement).attr("data-original-title", $(toolTipContent).html());
                        $(tooltipElement).tooltip();
                    }
                }
            });

            appendRegisterInterest($(listParent).closest('.arlo-eventtemplate-listitem'));

        }


        function setListLayout(eventItems, listParent) {
            listParent = $(listParent);
            eventItems = $(eventItems);

            listParent.removeClass('arlo-events-1 arlo-events-2 arlo-events-3 arlo-events-4');

            switch (listParent.find('.arlo-event-listitem').length) {
                case 1:
                    listParent.addClass('arlo-events-1');
                    break;
                case 2:
                    listParent.addClass('arlo-events-2');
                    break;
                case 3:
                    listParent.addClass('arlo-events-3');
                    break;
                default:
                    listParent.addClass('arlo-events-4');
                    break;
            }

        }

        // Get height from combined heights of list item elements (because of issue with using list items own height)
        function setListItemsHeight() {
            if ($(listParent).width() < 500 || $(listParent).hasClass("arlo-events-1")) {
                return;
            }
            $(listParent).find(".arlo-event-listitem").height("auto");
            var tallestListItemHeight = 0;
            $.each($(listParent).find(".arlo-event-listitem"), function (
                index,
                listItem
            ) {
                var height = 0;
                height += $(listItem).find(".arlo-listitem-header").height() || 0;
                height += $(listItem).find(".arlo-duration").height() || 0;
                height += $(listItem).find(".arlo-notice").height() || 0;
                height += $(listItem).find(".arlo-location").height() || 0;
                height += $(listItem).find(".arlo-presenter").height() || 0;
                height += $(listItem).find(".arlo-offers").height() || 0;
                height += ($(listItem).find(".arlo-event-register").height() || 0) + 120;

                if (height > tallestListItemHeight) {
                    tallestListItemHeight = height;
                }
            });
            // Set all list items to height of tallest item plus padding.
            $(listParent)
                .find(".arlo-listitem")
                .height(tallestListItemHeight);
        }

        // Show register interest button when there are no dates
        function appendRegisterInterest(eventTemplate) {
            var noResultsContainer = $(eventTemplate).find(".arlo-no-results-found");

            if (noResultsContainer.length > 0) {
                var registerInterestLink = $(eventTemplate).find(".arlo-register-interest .arlo-register-interest-link");
                if (registerInterestLink.length > 0) {
                    var registerLinkClone = registerInterestLink.clone();
                    registerInterestLink.remove();
                    registerLinkClone.html(" Register Interest");
                    noResultsContainer.append(registerLinkClone);
                }

                $(eventTemplate).find(".arlo-register-interest").hide();
            }
        }

    };


})(jQuery, window.ElementQueries);
