#!/bin/sh

python -m SimpleHTTPServer &
open http://localhost:8000/test.html
