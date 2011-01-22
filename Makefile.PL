use strict;
use warnings;
use inc::Module::Install;

name 'Jackalope-JS';
all_from 'lib/Jackalope/JS.pm';
license 'perl';

requires 'Jackalope'                   => 0;

build_requires 'Test::More'            => 0;
build_requires 'Test::Moose'           => 0;
build_requires 'Test::Fatal'           => 0;

tests('t/*.t');

WriteAll();