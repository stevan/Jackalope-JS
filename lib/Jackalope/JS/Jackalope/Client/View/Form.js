if (Jackalope             == undefined) var Jackalope             = function () {}
if (Jackalope.Client      == undefined)     Jackalope.Client      = function () {}
if (Jackalope.Client.View == undefined)     Jackalope.Client.View = function () {}

// ----------------------------------------------------------------------------
// Jackalope Client View Form
// ----------------------------------------------------------------------------

Jackalope.Client.View.Form = function ( opts ) { this.init( opts ) }

Jackalope.Client.View.Form.prototype = Jackalope.Util.Object.merge(
    Jackalope.Client.Observable.prototype,
    Jackalope.Client.Traversable.prototype
);

Jackalope.Client.View.Form.prototype.init = function ( opts ) {
    if ( opts == undefined ) return;
    this.container     = opts['container'];
    this.actions       = opts['actions'];
    this.outlets       = opts['outlets'];
    this.target_action = opts['target_action'];

    this.set_form_data( opts["form_data"] || {} );

    if ( opts["target"] != undefined ) {
        this.set_target( opts['target'] );
    }

    var self = this;
    this.$container = function () { jQuery( self.container ) };
    this.init_all_bindings();
}

// ... actions on the container

Jackalope.Client.View.Form.prototype.show = function () { this.$container().show() }
Jackalope.Client.View.Form.prototype.hide = function () { this.$container().hide() }

// ... internal setup

Jackalope.Client.View.Form.prototype.init_all_bindings = function () {
    for (var action in this.actions) {
        this.actions[action].set_target( this );
    }
    for (var outlet in this.outlets) {
        this.outlets[outlet].set_target( this );
    }
}

Jackalope.Client.View.Form.prototype.set_form_data = function ( form_data ) {
    if ( this.form_data == undefined ) this.form_data = {};
    // save off the original value
    this._orig_form_data = Jackalope.Util.clone( form_data );
    // now set it correctly in a
    // way that will populate the
    // form if needed.
    for ( var datum in form_data ) {
        this.set( datum, form_data[ datum ] );
    }
}

Jackalope.Client.View.Form.prototype.set_target = function ( target ) {
    this.target = target;
};

// ... get/set for form data

Jackalope.Client.View.Form.prototype.get = function ( name ) {
    return this.traverse_path_and_get( name, this.form_data );
};

Jackalope.Client.View.Form.prototype.set = function ( name, value ) {
    this.traverse_path_and_set( name, this.form_data, value, name );
    this.trigger('update:' + name, this, value);
};

// ... actions to bind too

Jackalope.Client.View.Form.prototype.submit_form = function () {
    this.target[ this.target_action ].apply( this.target, [ this.form_data ] );
};

Jackalope.Client.View.Form.prototype.reset_form = function () {
    for ( var datum in this._orig_form_data ) {
        this.set( datum, this._orig_form_data[ datum ] );
    }
};
