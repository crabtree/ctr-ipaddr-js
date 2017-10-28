"use strict";

const expect = require("expect.js");
const { IPv4 } = require("./ipv4");
const IP = {
    "192.168.0.1/24": {
        ip: "192.168.0.1"
        , ipLong: 3232235521
        , mask: "255.255.255.0"
        , hostMask: "0.0.0.255"
        , maskCidr: 24
        , netSize: 256
        , netAddr: "192.168.0.0"
        , broadcast: "192.168.0.255"
    }
    , "172.16.0.1/16": {
        ip: "172.16.0.1"
        , ipLong: 2886729729
        , mask: "255.255.0.0"
        , hostMask: "0.0.255.255"
        , maskCidr: 16
        , netSize: 65536
        , netAddr: "172.16.0.0"
        , broadcast: "172.16.255.255"
    } 
    , "10.0.0.1/8": {
        ip: "10.0.0.1"
        , ipLong: 167772161
        , mask: "255.0.0.0"
        , hostMask: "0.255.255.255"
        , maskCidr: 8
        , netSize: 16777216
        , netAddr: "10.0.0.0"
        , broadcast: "10.255.255.255"
    }
}

describe("IPv4", function () {

    describe("toLong static method should throw when IP string has wrong value", function () {

        const params = [
            -10
            , -1
            , 4294967296
            , 4294967300
            , "ABC"
            , 1
            , "123.123.123"
            , "192.192.192.192.192"
            , "192.a.192.192"
            , "256.192.0.0"
            , "192.256.0.0"
            , "192.0.256.0"
            , "192.0.0.256"
        ];

        params.forEach(function (param) {
            it(`Value: ${param}`, function () {
                expect(IPv4.toLong.bind(void 0, param)).to.throwError();
            });
        });

    });

    describe("fromLong static method should throw when long value is out of IPv4 range", function () {
        
        const params = [
            -10
            , -1
            , 4294967296
            , 4294967300
        ];

        params.forEach(function (param) {
            it(`Value: ${param}`, function () {
                expect(IPv4.fromLong.bind(void 0, param)).to.throwError();
            });
        });

    })

    describe("cidrFromMask static method conversion from dotted notation to number", function () {
        
        const masks = [
            {ipstr: "128.0.0.0", cidr: 1}
            , {ipstr: "192.0.0.0", cidr: 2}
            , {ipstr: "224.0.0.0", cidr: 3}
            , {ipstr: "240.0.0.0", cidr: 4}
            , {ipstr: "248.0.0.0", cidr: 5}
            , {ipstr: "252.0.0.0", cidr: 6}
            , {ipstr: "254.0.0.0", cidr: 7}
            , {ipstr: "255.0.0.0", cidr: 8}
            
            , {ipstr: "255.128.0.0", cidr: 9}
            , {ipstr: "255.192.0.0", cidr: 10}
            , {ipstr: "255.224.0.0", cidr: 11}
            , {ipstr: "255.240.0.0", cidr: 12}
            , {ipstr: "255.248.0.0", cidr: 13}
            , {ipstr: "255.252.0.0", cidr: 14}
            , {ipstr: "255.254.0.0", cidr: 15}
            , {ipstr: "255.255.0.0", cidr: 16}

            , {ipstr: "255.255.128.0", cidr: 17}
            , {ipstr: "255.255.192.0", cidr: 18}
            , {ipstr: "255.255.224.0", cidr: 19}
            , {ipstr: "255.255.240.0", cidr: 20}
            , {ipstr: "255.255.248.0", cidr: 21}
            , {ipstr: "255.255.252.0", cidr: 22}
            , {ipstr: "255.255.254.0", cidr: 23}
            , {ipstr: "255.255.255.0", cidr: 24}

            , {ipstr: "255.255.255.128", cidr: 25}
            , {ipstr: "255.255.255.192", cidr: 26}
            , {ipstr: "255.255.255.224", cidr: 27}
            , {ipstr: "255.255.255.240", cidr: 28}
            , {ipstr: "255.255.255.248", cidr: 29}
            , {ipstr: "255.255.255.252", cidr: 30}
            , {ipstr: "255.255.255.254", cidr: 31}
            , {ipstr: "255.255.255.255", cidr: 32}
        ];

        masks.forEach(function(mask) {
            it(`should return CIDR ${mask.cidr} for ${mask.ipstr}`, function () {
                const cidr = IPv4.cidrFromMask(mask.ipstr);
                expect(cidr).to.equal(mask.cidr);
            });
        });
        
    });

    describe("cidrFromMask static method when passing valid cidr notation number", function () {

        const params = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

        params.forEach(function(param) {
            it(`should return CIDR equal to ${param}`, function () {
                const cidr = IPv4.cidrFromMask(param);
                expect(cidr).to.equal(param);
            });
        });

    });

    describe("initialization with ip and mask parameters", function () {

        const params = [
            { _ip: "192.168.0.1" , _mask: "255.255.255.0" , result: IP["192.168.0.1/24"] }
            , { _ip: "192.168.0.1", _mask: 24, result: IP["192.168.0.1/24"]}
            , { _ip: 3232235521, _mask: 24, result: IP["192.168.0.1/24"] }
            , { _ip: "172.16.0.1", _mask: "255.255.0.0", result: IP["172.16.0.1/16"] }
            , { _ip: "172.16.0.1", _mask: 16, result: IP["172.16.0.1/16"] }
            , { _ip: 2886729729, _mask: 16, result: IP["172.16.0.1/16"] }
            , { _ip: "10.0.0.1", _mask: "255.0.0.0", result: IP["10.0.0.1/8"] }
            , { _ip: "10.0.0.1", _mask: 8, result: IP["10.0.0.1/8"] }
            , { _ip: 167772161, _mask: 8, result: IP["10.0.0.1/8"] }
        ];

        params.forEach(function (param) {
            it(`IP ${param._ip} and mask ${param._mask} should produce valid IPv4 object`, function () {
                const ip = new IPv4(param._ip, param._mask);

                expect(ip.ip).to.equal(param.result.ip);
                expect(ip.mask).to.equal(param.result.mask);
                
                expect(ip.hostMask).to.equal(param.result.hostMask);
                expect(ip.ipLong).to.equal(param.result.ipLong);
                expect(ip.maskCidr).to.equal(param.result.maskCidr);
                expect(ip.netSize).to.equal(param.result.netSize);
                expect(ip.netAddr).to.equal(param.result.netAddr);
                expect(ip.broadcast).to.equal(param.result.broadcast);
            });
        });

    });

    describe("initialization with ip and mask as one parameter", function () {

        const params = [
            { _ip: "192.168.0.1/24", result: IP["192.168.0.1/24"] }
            , { _ip: "192.168.0.1/255.255.255.0", result: IP["192.168.0.1/24"] }
            , { _ip: "172.16.0.1/16", result: IP["172.16.0.1/16"] }
            , { _ip: "172.16.0.1/255.255.0.0", result: IP["172.16.0.1/16"] }
            , { _ip: "10.0.0.1/8", result: IP["10.0.0.1/8"] }
            , { _ip: "10.0.0.1/255.0.0.0", result: IP["10.0.0.1/8"] }
        ];

        params.forEach(function (param) {
            it(`IP string ${param._ip} should produce valid IPv4 object`, function () {
                const ip = new IPv4(param._ip);

                expect(ip.ip).to.equal(param.result.ip);
                expect(ip.mask).to.equal(param.result.mask);
                
                expect(ip.hostMask).to.equal(param.result.hostMask);
                expect(ip.ipLong).to.equal(param.result.ipLong);
                expect(ip.maskCidr).to.equal(param.result.maskCidr);
                expect(ip.netSize).to.equal(param.result.netSize);
                expect(ip.netAddr).to.equal(param.result.netAddr);
                expect(ip.broadcast).to.equal(param.result.broadcast);
            });
        });

    });

    describe("eachForSubnet should generate all IP addresses for subnets - subnet 192.168.0.0/30", function () {

        const params = [
            "192.168.0.0/30"
            , "192.168.0.1/30"
            , "192.168.0.2/30"
            , "192.168.0.3/30"
        ];

        params.forEach(function(param) {
            it(`Iterate all addresses for subnet 192.168.0.0/30 initializing with ${param}`, function () {
                const ip = new IPv4(param);
                const subnet = ip.eachForSubnet();
                
                let {value: subnetIp, done: last} = subnet.next();
                expect(subnetIp.ip).to.equal("192.168.0.0");
                expect(last).to.equal(false);
    
                ({value: subnetIp, done: last} = subnet.next());
                expect(subnetIp.ip).to.equal("192.168.0.1");
                expect(last).to.equal(false);
    
                ({value: subnetIp, done: last} = subnet.next());
                expect(subnetIp.ip).to.equal("192.168.0.2");
                expect(last).to.equal(false);
    
                ({value: subnetIp, done: last} = subnet.next());
                expect(subnetIp.ip).to.equal("192.168.0.3");
                expect(last).to.equal(false);
    
                ({value: subnetIp, done: last} = subnet.next());
                expect(subnetIp).to.equal(void 0);
                expect(last).to.equal(true);
            });
    
        });
        
        it("Iterate addresses for subnet 192.168.0.0/30 starting with 192.168.0.2 address", function () {
            const ip = new IPv4("192.168.0.1/30");
            const subnet = ip.eachForSubnet("192.168.0.2");
            
            let {value: subnetIp, done: last} = subnet.next();
            expect(subnetIp.ip).to.equal("192.168.0.2");
            expect(last).to.equal(false);

            ({value: subnetIp, done: last} = subnet.next());
            expect(subnetIp.ip).to.equal("192.168.0.3");
            expect(last).to.equal(false);

            ({value: subnetIp, done: last} = subnet.next());
            expect(subnetIp).to.equal(void 0);
            expect(last).to.equal(true);
        });

    });

    describe("eachForSubnet should throw when...", function () {

        const params = [
            "192.168.0.5"
            , "192.168.2.4"
            , 3232235525
            , 3232236036
        ];
        
        params.forEach(function(param) {
            it(`Iterate subnet addresses starting with address out of subnet scope - ${param}`, function () {
                const ip = new IPv4("192.168.1.1/30");
                const subnet = ip.eachForSubnet(param);
                
                expect(() => subnet.next()).to.throwError();
            });
        });

    });

});