# ctr-ipaddr-js

[![Build Status](https://travis-ci.org/crabtree/ctr-ipaddr-js.svg?branch=master)](https://travis-ci.org/crabtree/ctr-ipaddr-js)
[![Maintainability](https://api.codeclimate.com/v1/badges/369491a92154d4431283/maintainability)](https://codeclimate.com/github/crabtree/ctr-ipaddr-js/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/369491a92154d4431283/test_coverage)](https://codeclimate.com/github/crabtree/ctr-ipaddr-js/test_coverage)

## Installation

```bash
$ npm install ctr-ipaddr
```

## Usage

```js
const {IPv4} = require('ctr-ipaddr');
```

### Convert dotted string into long representation

```js
let ipLong = IPv4.toLong("192.168.0.1"); // => 3232235521
```

### Convert long representation to dotted string

```js
let ipStr = IPv4.fromLong(3232235521); // => "192.168.0.1"
```

### Convert to CIDR mask

```js
let cidr1 = IPv4.cidrFromMask("255.255.255.0"); // => 24
let cidr2 = IPv4.cidrFromMask(24); // => 24
let cidr3 = IPv4.cidrFromMask(4294967040); // => 24
```

### Initializing the object

```js
let ip1 = new IPv4("192.168.0.1/24");
let ip2 = new IPv4("192.168.0.1/255.255.255.0");
let ip3 = new IPv4("192.168.0.1", 24);
let ip4 = new IPv4("192.168.0.1", "255.255.255.0");
let ip5 = new IPv4(3232235521, 24);
```

After initialization it offers you following properties:

```json
{
  "ip": "192.168.0.1",
  "ipLong": 3232235521,
  "mask": "255.255.255.0",
  "maskLong": 4294967040,
  "maskCidr": 24,
  "hostMaskLong": 255,
  "hostMask": "0.0.0.255",
  "netSize": 256,
  "netAddrLong": 3232235520,
  "netAddr": "192.168.0.0",
  "broadcastLong": 3232235775,
  "broadcast": "192.168.0.255" 
}
```

### Generator method eachForSubnet

On the instance of an object there is also a generator method ```* eachForSubnet(startIp = void 0)```, which returns a generator for all IPv4 objects for IP addresses from a subnet. If you not specify the ```startIp``` parameter the generation will be started from the first address of the subnet.

```js
let subnet = ip1.eachForSubnet();
subnet.next(); // => { value: IPv4 { ip: 192.168.0.0, ... }, done: false }
subnet.next(); // => { value: IPv4 { ip: 192.168.0.1, ... }, done: false }
subnet.next(); // => { value: IPv4 { ip: 192.168.0.2, ... }, done: false }
...
subnet.next(); // => { value: IPv4 { ip: 192.168.0.255, ... }, done: false }
subnet.next(); // => { value: undefined, done: true }
```

```js
let subnet = ip1.eachForSubnet("192.168.0.253");
subnet.next(); // => { value: IPv4 { ip: 192.168.0.253, ... }, done: false }
subnet.next(); // => { value: IPv4 { ip: 192.168.0.254, ... }, done: false }
subnet.next(); // => { value: IPv4 { ip: 192.168.0.255, ... }, done: false }
subnet.next(); // => { value: undefined, done: true }
```

### Checking if an address belongs to the subnet

On the instance of an object there is a method named `belongsToSubnet(ip)`, which returns true when the given ip address belongs to the subnet represented by the instance.

```js
ip1.belongsToSubnet("192.168.0.5"); // => true
ip1.belongsToSubnet("10.0.0.1"); // => false
```
