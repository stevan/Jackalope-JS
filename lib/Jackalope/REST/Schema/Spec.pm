package Jackalope::REST::Schema::Spec;
use Moose;

our $VERSION   = '0.01';
our $AUTHORITY = 'cpan:STEVAN';

extends 'Jackalope::Schema::Spec';

override '_all_spec_builder_methods' => sub {
    my $self = shift;
    super(), qw[ resource service ]
};

## ------------------------------------------------------------------
## Resource Schema
## ------------------------------------------------------------------
## The Resource schema is a simple wrapper for web based resources
## it is mostly intended to be used for extension where the body
## property is overriden with the schema of your choice.
## ------------------------------------------------------------------

sub resource {
    my $self = shift;
    return +{
        id          => "schema/web/resource",
        title       => "The 'Resource' schema",
        description => q[
            The is a 'wrapper' of sorts for resources
            as viewed from the concept of the web and
            REST. It is mostly intended to be extended
            where the 'body' property is overriden with
            the schema of our choice.
        ],
        type        => "object",
        properties  => {
            id      => {
                type        => "any",
                description => q[
                    This is the ID of the given resource, it is
                    assumed to be some kind of string, which should
                    still just work fine even for numeric values.
                    This is expected to be the lookup key for
                    resources in a resource repository.
                ]
            },
            body    => {
                type        => "any",
                description => q[
                    This is the body of the resource, it is of type
                    'any' for now, but it as this schema is meant to
                    be extended and this property overridden, this is
                    basically whatever you need it to be.
                ]
            },
            version => {
                type        => "string",
                'format'    => "digest",
                description => q[
                    This is a digest string (SHA1?) representing the current
                    version of the resource. When the resource is updated
                    the version should be compared first, to make sure
                    that it has not been updated by another.
                ]
            }
        },
        additional_properties => {
            links   => {
                type        => "array",
                items       => { '$ref' => "schema/core/xlink" },
                description => q[
                    This is a list of links which represent the
                    capabilities of given resource, the consumer of
                    the resource can use these links to perform
                    different actions.
                ]
            }
        }
    }
}

## ------------------------------------------------------------------
## Service Schema
## ------------------------------------------------------------------
## The Service schema is a simple template for REST based web
## service that follows a convention for the standard operations
## that would be performed on a REST resource collection.
## ------------------------------------------------------------------

sub service {
    my $self = shift;
    return +{
        id    => 'schema/web/service',
        title => 'This is a simple REST enabled schema',
        type  => 'object',
        links => [
            {
                rel           => 'list',
                href          => '/',
                method        => 'GET',
                target_schema => {
                    type  => "array",
                    items => {
                        type       => 'object',
                        extends    => { '$ref' => 'schema/web/resource' },
                        properties => {
                            body => { '$ref' => '#' },
                        }
                    }
                },
            },
            {
                rel           => 'create',
                href          => '/create',
                method        => 'POST',
                data_schema   => { '$ref' => '#' },
                target_schema => {
                    type       => 'object',
                    extends    => { '$ref' => 'schema/web/resource' },
                    properties => {
                        body => { '$ref' => '#' },
                    }
                },
            },
            {
                rel           => 'read',
                href          => '/:id',
                method        => 'GET',
                target_schema => {
                    type       => 'object',
                    extends    => { '$ref' => 'schema/web/resource' },
                    properties => {
                        body => { '$ref' => '#' },
                    }
                },
                uri_schema    => {
                    id => { type => 'string' }
                }
            },
            {
                rel           => 'edit',
                href          => '/:id/edit',
                method        => 'PUT',
                data_schema   => { '$ref' => '#' },
                target_schema => {
                    type       => 'object',
                    extends    => { '$ref' => 'schema/web/resource' },
                    properties => {
                        body => { '$ref' => '#' },
                    }
                },
                uri_schema    => {
                    id => { type => 'string' }
                }
            },
            {
                rel           => 'delete',
                href          => '/:id/delete',
                method        => 'DELETE',
                uri_schema    => {
                    id => { type => 'string' }
                }
            }
        ]
    };
}

__PACKAGE__->meta->make_immutable;

no Moose; 1;

__END__

=pod

=head1 NAME

Jackalope::REST::Schema::Spec - A Moosey solution to this problem

=head1 SYNOPSIS

  use Jackalope::REST::Schema::Spec;

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

Copyright 2010 Infinity Interactive, Inc.

L<http://www.iinteractive.com>

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut