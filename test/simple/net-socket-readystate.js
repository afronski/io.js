// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var net = require('net');
var assert = require('assert');

var sock = new net.Socket();

var server = net.createServer().listen(common.PORT, function() {
  assert(!sock.readable);
  assert(!sock.writable);
  assert.equal(sock.readyState, 'closed');

  sock.connect(common.PORT, function() {
    assert.equal(sock.readable, true);
    assert.equal(sock.writable, true);
    assert.equal(sock.readyState, 'open');

    sock.end();
    assert(!sock.writable);
    assert.equal(sock.readyState, 'readOnly');

    server.close();
    sock.on('close', function() {
      assert(!sock.readable);
      assert(!sock.writable);
      assert.equal(sock.readyState, 'closed');
    });
  });

  assert.equal(sock.readyState, 'opening');
});
