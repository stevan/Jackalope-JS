
test(
    "Binding test",
    function() {

        (function () {
            var r = new Jackalope.Client.Resource ({
                "id"   : "stevan",
                "body" : {
                    "first_name" : "Stevan",
                    "last_name"  : "Little"
                },
                "version" : "fe982ce14ce2b2a1c097629adecdeb1522a1e0a2ca390673446c930ca5fd11d2",
                "links"   : [
                    { "rel" : "create", "href" : "/",  "method" : "POST"   },
                    { "rel" : "delete", "href" : "/1", "method" : "DELETE" },
                    { "rel" : "edit",   "href" : "/1", "method" : "PUT"    },
                    { "rel" : "list",   "href" : "/",  "method" : "GET"    },
                    { "rel" : "read",   "href" : "/1", "method" : "GET"    }
                ]
            });


            var $input = $("<input type='text'/>");

            var binding = new Jackalope.Client.Binding ({
                element  : $input,
                resource : r,
                property : "first_name"
            });

            equal($input.val(), "Stevan", "... got the right value for the DOM after initial binding");

            r.set({ first_name : "Steve" });
            equal($input.val(), "Steve", "... got the right value for the DOM after changing resource");

            $input.val("Scott");
            $input.trigger('change'); // gotta manually trigger this in the test
            equal(r.get('first_name'), "Scott", "... got the right value for updated resource after changing DOM");
        })();

        (function () {
            var r = new Jackalope.Client.Resource ({
                "id"   : "stevan",
                "body" : {
                    "first_name" : "Stevan",
                    "last_name"  : "Little"
                },
                "version" : "fe982ce14ce2b2a1c097629adecdeb1522a1e0a2ca390673446c930ca5fd11d2",
                "links"   : [
                    { "rel" : "create", "href" : "/",  "method" : "POST"   },
                    { "rel" : "delete", "href" : "/1", "method" : "DELETE" },
                    { "rel" : "edit",   "href" : "/1", "method" : "PUT"    },
                    { "rel" : "list",   "href" : "/",  "method" : "GET"    },
                    { "rel" : "read",   "href" : "/1", "method" : "GET"    }
                ]
            });

            var binding = new Jackalope.Client.Binding ({
                element  : "<input type='text'/>",
                resource : r,
                property : "first_name"
            });

            equal(binding.element.val(), "Stevan", "... got the right value for the DOM after initial binding");

            r.set({ first_name : "Steve" });
            equal(binding.element.val(), "Steve", "... got the right value for the DOM after changing resource");

            binding.element.val("Scott");
            binding.element.trigger('change'); // gotta manually trigger this in the test
            equal(r.get('first_name'), "Scott", "... got the right value for updated resource after changing DOM");
        })();

    }
);