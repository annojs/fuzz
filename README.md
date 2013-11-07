[![build status](https://secure.travis-ci.org/annojs/fuzz.png)](http://travis-ci.org/annojs/fuzz)
# annofuzz - Fuzzer for JavaScript

`annofuzz` provides a way to fuzz you functions. It has been designed to work with [annotate](https://github.com/annojs/annotate) and [annois](https://github.com/annojs/is) although it works as long as you implement the protocol.

`annofuzz` outputs test results using [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) format. This means you can easily pipe it into some TAP parser and examine the results as you like.

## License

`annofuzz` is available under MIT. See LICENSE for more details.
