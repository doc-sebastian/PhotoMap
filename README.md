# Modified Photo Map by BatPio

This Nextcloud Photomap Fork shows geotagged photos on a map.
It has a different, more monochrome styling and better links to the files and gallery app than the Original from BatPio.

It's fully translated to German language.


## Building the app

The app can be built by using the provided Makefile by running:

    make

This requires the following things to be present:
* make
* which
* tar: for building the archive
* curl: used if phpunit and composer are not installed to fetch them from the web
* npm: for building and testing JS
