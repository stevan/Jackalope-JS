
test(
    "Basic Form test",
    function() {

        var $doc = $(
            "<div id='ecode_form'>" +
                "<input type='text' id='ecode' />" +
                "<input type='button' id='ecode_button' />" +
            "</div>"
        );

        var controller = {
            data       : {},
            find_ecode : function ( data ) {
                this.data = data;
            }
        };

        var form = new Jackalope.Client.View.Form ({
            container     : $doc.find( '#ecode_form' ),
            target        : controller,
            target_action : 'find_ecode',
            form_data     : { ecode : '' },
            actions       : {
                ecode_button : new Jackalope.Client.Binding.Action.Button({
                    element         : $doc.find( '#ecode_button' ),
                    event_type      : 'click',
                    target_action   : 'submit_form',
                })
            },
            outlets       : {
                ecode_entry : new Jackalope.Client.Binding.Outlet ({
                    element  : $doc.find( '#ecode' ),
                    property : "ecode"
                })
            }
        });

        deepEqual(form.form_data, { ecode : '' }, '... the form-data is as expected');
        equals($doc.find( '#ecode' ).val(), '', '... the form is as expected');

        form.set('ecode', 'foo');
        deepEqual(form.form_data, { ecode : 'foo' }, '... the form-data is as expected');
        equals($doc.find( '#ecode' ).val(), 'foo', '... the form has been updated');

        $doc.find( '#ecode' ).val( 'test' ).change();
        deepEqual(form.form_data, { ecode : 'test' }, '... the form-data is as expected');
        equals($doc.find( '#ecode' ).val(), 'test', '... the form has been updated');

        deepEqual(controller.data, {}, '... the captured is as expected');
        $doc.find( '#ecode_button' ).click();
        deepEqual(controller.data, { ecode : 'test' }, '... the captured is as expected');

    }
);