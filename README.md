# dotADX-intranet
dotADX Intranet is a custom browser extending off of a localized Authoritative DNS Server

Written uncharacteristically of me in CommonJS (damn you electron!!)

## How to Use:

### Required Dependencies:
- Electron (`npm i --save-dev electron`)
- Electron Packager (`npm i --save-dev electron-packager`)
- PowerDNS (`brew install pdns`, [their website](https://doc.powerdns.com/authoritative/installation.html))

### Running:
- `npm run start` or `npx electron .`
- You can also do `npm run package`, but that is specific to macOS. (this builds it as a .app, meaning it becomes redistributable)

### Adding Websites:
- First, start PowerDNS: `sudo pdns_server --daemon=no --guardian=no --loglevel=9` (or just `sudo pdns_server`) to run it manually, `sudo pdns_server --daemon=yes` to run it as a daemon.
  - Stop daemon: `sudo pdns_control quit`
  - Reload daemon: `sudo pdns_control reload`
- `sudo pdnsutil create-zone hostname.tld hostname.tld.` to create an empty zone
- Add records:
  - TXT and A records are **required** to operate the site, you can add them like so:
  - `sudo pdnsutil add-record zone recordName type value`
    - `sudo pdnsutil add-record hostname.tld @ A 127.0.0.1`
    - `sudo pdnsutil add-record hostname.tld _port TXT 3000` (change 3000 to the port)
- Delete records:
  - In my experience, you have to edit the zone's records to delete them:
  - `sudo pdnsutil edit-zone zone`
  - Manually delete the line for a record
  - control+o, control+x
  - Increase serial
  - Apply changes

Congratulations! You have your own dotADX set up!

You're able to change the UI for the `index.html` file, but I recommend trying not to touch the IDs a lot because the code is highly-dependant on them.


Regards,

u1terior

**Note**: the authoritative server has ***no access whatsoever*** to the Global DNS, meaning you have free reign over all domains and zones registered. If you really wanted, you could register github.com to yourself or anything. TLDs can be whatever, but you **must** use an A record pointing to a static IP or 127.0.0.1 or whatever IP you currently have **and** a _port TXT record for the A record otherwise **it will not work**.

It will look something like this in your DNS editor: (test.thing is a random test zone I have setup)

```
; Warning - every name in this file is ABSOLUTE!
$ORIGIN .
test.thing      3600    IN      SOA     a.misconfigured.dns.server.invalid hostmaster.test.thing 0 10800 3600 604800 3600
test.thing      3600    IN      A       127.0.0.1
test.thing      3600    IN      NS      test.thing
_port.test.thing        3600    IN      TXT     "6731"
```

`test.thing` points to 127.0.0.1 (loopback ip) and _port.test.thing points to port 6731, where it's being hosted.



Also, sorry for the lack of support in how to do this on windows, I don't develop on windows and therefore I don't know how to do it on windows. Ask ChatGPT or something.
