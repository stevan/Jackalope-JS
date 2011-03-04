package Jackalope::JS;
use Moose;
use Resource::Pack;

use Path::Class ();

our $VERSION   = '0.01';
our $AUTHORITY = 'cpan:STEVAN';

extends 'Resource::Pack::Resource';

has '+name' => (default => __PACKAGE__);

sub BUILD {
    my $self = shift;
    resource $self => as {

        install_from( Path::Class::File->new( __FILE__ )->parent->subdir('JS') );

        file 'Jackalope'                            => 'Jackalope.js';
        file 'Jackalope::Util'                      => 'Jackalope/Util.js';
        file 'Jackalope::Schema'                    => 'Jackalope/Schema.js';

        file 'Jackalope::Client'                    => 'Jackalope/Client.js';
        file 'Jackalope::Client::Application'       => 'Jackalope/Client/Application.js';
        file 'Jackalope::Client::Controller'        => 'Jackalope/Client/Controller.js';
        file 'Jackalope::Client::HistoryController' => 'Jackalope/Client/HistoryController.js';
        file 'Jackalope::Client::Binding'           => 'Jackalope/Client/Binding.js';

        file 'Jackalope::Client::Resource'          => 'Jackalope/Client/Resource.js';

        file 'Jackalope::Client::View::Form'        => 'Jackalope/Client/View/Form.js';
        file 'Jackalope::Client::View::Panel'       => 'Jackalope/Client/View/Panel.js';
        file 'Jackalope::Client::View::TableView'   => 'Jackalope/Client/View/TableView.js';

    };
}

__PACKAGE__->meta->make_immutable;

no Moose; 1;

__END__

=pod

=head1 NAME

Jackalope::JS - A Moosey solution to this problem

=head1 SYNOPSIS

  use Jackalope::JS;

=head1 DESCRIPTION

=head1 METHODS

=over 4

=item B<>

=back

=head1 BUGS

All complex software has bugs lurking in it, and this module is no
exception. If you find a bug please either email me, or add the bug
to cpan-RT.

=head1 AUTHOR

Stevan Little E<lt>stevan.little@iinteractive.comE<gt>

=head1 COPYRIGHT AND LICENSE

Copyright 2011 Infinity Interactive, Inc.

L<http://www.iinteractive.com>

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
