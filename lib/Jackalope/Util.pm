package Jackalope::Util;

use strict;
use warnings;

our $VERSION   = '0.01';
our $AUTHORITY = 'cpan:STEVAN';

use JSON::XS ();

my @exports = qw/
    true
    false
    encode_json
    decode_json
/;

Sub::Exporter::setup_exporter({
    exports => \@exports,
    groups  => { default => \@exports }
});

sub true  () { JSON::XS::true()  }
sub false () { JSON::XS::false() }

sub is_bool { JSON::XS::is_bool( shift ) }

sub encode_json { JSON::XS::encode_json( shift ) }
sub decode_json { JSON::XS::decode_json( shift ) }

1;

__END__

=pod

=head1 NAME

=head1 SYNOPSIS

=head1 DESCRIPTION

=head1 BUGS

All complex software has bugs lurking in it, and this module is no
exception. If you find a bug please either email me, or add the bug
to cpan-RT.

=head1 AUTHOR

Stevan Little E<lt>stevan.little@iinteractive.comE<gt>

=head1 COPYRIGHT AND LICENSE

Copyright 2010 Infinity Interactive, Inc.

L<http://www.iinteractive.com>

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut