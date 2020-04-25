# eBay Monitor

Monitor for eBay that can be controlled from discord commands. Users can add/remove keywords which are used to request latest eBay listings, as well as being able to start/stop the monitor.

### Installing

Please run the following command, this will install superagent, cheerio and discord.js

```
$ npm install
```

Whilst that's install you can edit `settings.json`. Create your discord bot and get it's secret token [here](https://discordapp.com/developers)

```javascript
{
    "keyword": [],
    "webhook": "", // Discord webhook goes here
    "token": "" // Your discord bots secret token goes here
}

```

Once you've done all that you're ready to run! Simply run the following command...

```
$ node index
```

### Discord commands

+ `!start` - This will start the monitor (only need to do this if you've stopped)
+ `!stop` - This will stop the monitor
+ `!add` - This will add a new set of keywords, for example `!add graphics, card` (must be in this format)
+ `!remove` - This will remove a set of keywords, for example `!remove 1` 
+ `!keyword` - This will list all sets of keywords
