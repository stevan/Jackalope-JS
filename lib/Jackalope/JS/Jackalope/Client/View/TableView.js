if (Jackalope             == undefined) var Jackalope             = function () {}
if (Jackalope.Client      == undefined)     Jackalope.Client      = function () {}
if (Jackalope.Client.View == undefined)     Jackalope.Client.View = function () {}

// ----------------------------------------------------------------------------
// Jackalope Client View TableView
// ----------------------------------------------------------------------------
// ARGUMENTS:
// This data source which can:
// - length()
// - get( idx )
//     - The elements in the data source must support
//       Traversable (read: get('property'))
// - bind( update:{idx} )
// - bind( add )
//
// This expects an HTML table-like element
// which has a single row template in it.
// The rest is handled by the binding spec.
//
// EVENTS:
// selected => clicking a table row will fire a 'selected' event => (idx)
// reloaded => calling the reload method fires this => (self)
// clear:selected => when a row is unselected for some reason
// ----------------------------------------------------------------------------

Jackalope.Client.View.TableView = function ( opts ) {
    this.table_body    = opts["table_body"];
    this.row_selector  = opts["row_selector"];
    this.binding_spec  = opts["binding_spec"];
    this.keyboard_nav  = opts["keyboard_nav"]  || false;
    this.select_by_row = opts["select_by_row"] || false;

    this.data_source  = opts["data_source"];

    var self = this;
    this.keydown_handler = function (e) {
        if (e.keyCode == 38) {
            self.move_selection_up();
        }
        else if (e.keyCode == 40) {
            self.move_selection_down();
        }
    };

    if (this.data_source) {
        this.init();
    }
};

Jackalope.Client.View.TableView.prototype = new Jackalope.Client.Observable ();

Jackalope.Client.View.TableView.prototype.set_data_source = function ( data_source ) {
    this.data_source = data_source;
    this.init();

    // bind the add event
    var self = this;
    this.data_source.bind( 'add', function ( c, idx, r ) {
        self.add_new_row( idx )
    });
}

Jackalope.Client.View.TableView.prototype.init = function () {
    if ( this.$table == undefined ) {
        this.$table        = jQuery( this.table_body );
        this.$row_template = this.$table.find( this.row_selector ).clone(true);
    }

    this.$table.empty();
    for (var i = 0; i < this.data_source.length(); i++) {
        this.add_new_row( i );
    }

    if (this.keyboard_nav == true) {
        $(document).unbind( 'keydown', this.keydown_handler );
        $(document).bind( 'keydown', this.keydown_handler );
    }
};

Jackalope.Client.View.TableView.prototype.reload = function () {
    this.init();
    this.trigger('reloaded', this);
};

Jackalope.Client.View.TableView.prototype.add_new_row = function ( index ) {
    var self     = this;
    var $new_row = this.$row_template.clone(true);

    this.data_source.bind(
        'update:' + index,
        function ( c, idx, r ) { self.populate_row( $new_row, idx, r ) }
    );

    this.populate_row( $new_row, index, this.data_source.get( index ) )
    this.$table.append( $new_row );
};

Jackalope.Client.View.TableView.prototype.populate_row = function ( $row, index, element ) {
    for ( var selector in this.binding_spec ) {
        var property = this.binding_spec[ selector ];
        if ( property.constructor == Function ) {
            property.apply( this, [ $row.find( selector ), element ] );
        }
        else {
            $row.find( selector ).html( element.get( property ) );
        }
    }
    if ( this.select_by_row == true ) {
        var self = this;
        $row.click(function () {
            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
            self.trigger('selected', index);
        });
    }
};

Jackalope.Client.View.TableView.prototype.clear_selection = function () {
    this.$table.find( this.row_selector ).removeClass('selected');
    this.trigger('clear:selected');
};

Jackalope.Client.View.TableView.prototype.move_selection_up = function () {
    var $row  = this.$table.find('.selected');
    if ($row.length != 0) {
        var $prev = $row.prev();
        if ($prev.length != 0) {
            $row.removeClass('selected');
            this.trigger('clear:selected');
            $prev.addClass('selected');
            this.trigger('selected', $prev.index());
        }
    }
};

Jackalope.Client.View.TableView.prototype.move_selection_down = function () {
    var $row  = this.$table.find('.selected');
    if ($row.length != 0) {
        var $next = $row.next();
        if ($next.length != 0) {
            $row.removeClass('selected');
            this.trigger('clear:selected');
            $next.addClass('selected');
            this.trigger('selected', $next.index());
        }
    }
};




