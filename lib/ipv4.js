"use strict";

const IPV4_LONG_MAX = 4294967295;
const IPV4_REGEX = /^([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){3}$/;

class IPv4 {
    static get IP_LONG_MAX () {
        return IPV4_LONG_MAX;
    }

    constructor (ip, mask) {
        [ip, mask] = this._initializeIpProperties(ip, mask);
        
        this._initializeMaskProperties(mask);        

        this._initializeNetworkProperties();
    }

    toString(format = void 0) {
        if(format !== void 0 && format >= 2 && format <= 32) {
            return `${this.ipLong.toString(format)}/${this.maskLong.toString(format)}`;
        }
        
        return `${this.ip}/${this.mask}`;
    }

    * eachForSubnet(startIp = void 0) {
        const last = this.broadcastLong;
        let current = this.netAddrLong;

        if(startIp !== void 0) {
            if(IPv4.isDottedStringNotation(startIp)) {
                startIp = IPv4.toLong(startIp);
            }

            if (startIp < this.netAddrLong || startIp > last) {
                throw new Error (`Starting IP address ${IPv4.fromLong(startIp)} is out of the subnet scope. Subnet starts with ${IPv4.fromLong(this.netAddrLong)} and ends with ${IPv4.fromLong(last)}`);
            }

            current = startIp;
        }
        
        while(current <= last) {
            yield new IPv4(current, this.maskLong);
            current += 1;
        }
    }

    _initializeIpProperties(ip, mask) {
        this.ip = void 0;
        this.ipLong = void 0;

        if(typeof ip === "string") {
            if (ip.includes("/")) {
                [ip, mask] = ip.split("/");
            }

            this.ip = ip;
            this.ipLong = IPv4.toLong(ip);
        } else if (typeof ip === "number") {
            this.ip = IPv4.fromLong(ip);
            this.ipLong = ip;
        } else {
            throw new Error(`Invalid IP address format - ${ip}`);
        }

        return [ip, mask];
    }

    _initializeMaskProperties(mask) {
        this.mask = void 0;
        this.maskLong = void 0;
        this.maskCidr = void 0;

        if(IPv4.isDottedStringNotation(mask)) {
            this.maskLong = IPv4.toLong(mask);
            this.mask = mask;
        } else if (typeof mask === "string" || mask <= IPv4.IP_LONG_MAX) {
            if (mask <= 32) {
                this.maskCidr = parseInt(mask);
                this.maskLong = (IPv4.IP_LONG_MAX << (32 - mask)) >>> 0;
            } else {
                this.maskLong = mask;
            }      
            
            this.mask = IPv4.fromLong(this.maskLong);
        } else {
            throw new Error(`Invalid mask format - ${mask}`);
        }

        if(this.maskCidr === void 0) {
            this.maskCidr = IPv4.cidrFromMask(this.maskLong);
        }

        this.hostMaskLong = ~this.maskLong;
        this.hostMask = IPv4.fromLong(this.hostMaskLong);
    }

    _initializeNetworkProperties() {
        this.netSize = 2 ** (32 - this.maskCidr);
        
        this.netAddrLong = (this.ipLong & this.maskLong) >>> 0;
        this.netAddr = IPv4.fromLong(this.netAddrLong);

        this.broadcastLong = this.netAddrLong + this.netSize - 1;
        this.broadcast = IPv4.fromLong(this.broadcastLong);
    }

    static fromLong (ipLong) {
        if (ipLong < 0 || ipLong > IPv4.IP_LONG_MAX) {
            throw new Error(`IPv4 long representation out of range, min value is 0, max value is ${IPv4.IP_LONG_MAX}`);
        }

        const a = ipLong >> 24 & 255;
        const b = ipLong >> 16 & 255;
        const c = ipLong >> 8 & 255;
        const d = ipLong & 255;

        return `${a}.${b}.${c}.${d}`;
    }

    static toLong (ipStr) {
        if(IPv4.isDottedStringNotation(ipStr) === false)  {
            throw new Error("Invalid IPv4 string representation");
        }

        const ipBytes = ipStr.split(".");
        const ipLong = (
            ipBytes[0] << 24 
            | ipBytes[1] << 16 
            | ipBytes[2] << 8 
            | ipBytes[3]
        ) >>> 0;

        return ipLong;
    }

    static cidrFromMask(mask) {
        if(IPv4.isDottedStringNotation(mask)) {
            mask = IPv4.toLong(mask);
        } 
        
        if (mask <= 32) {
            return parseInt(mask);
        }

        mask = mask.toString(2).replace(/0*$/, "");
        
        return mask.length;
    }

    static isDottedStringNotation(ipStr) {
        if(typeof ipStr !== "string") return false;

        return ipStr.match(IPV4_REGEX) !== null;        
    }
}

module.exports = {
    IPv4
};