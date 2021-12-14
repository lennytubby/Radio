const icy = require('icy');
const Speaker = require('speaker');
//const lame = require('lame');
const lame = require("@suldashi/lame");
const { Client } = require('pg');

var client = new Client({
    user:'postgres',
    host:'127.0.0.1',
    database:'coffeealarm',
    password:"Lenny<3Tassi",
    port:5432
})

client.connect()

var index = process.argv[2]
var stations;

const Stations = {
    youfm: 'https://dispatcher.rndfnk.com/hr/youfm/live/mp3/high',
    klassik: 'http://stream.klassikradio.de/live/mp3-192/stream.klassikradio.de/',
    regenbogen: 'http://scast.regenbogen.de/rr-karlsruhe-64-mp3',
    krontehit: 'http://onair.krone.at/kronehit.mp3',
    sunshine: 'http://sunshinelive.hoerradar.de/sunshinelive-live-mp3-hq',
    B5aktuell: 'http://streams.br.de/b5aktuell_2.m3u'
}

const Stations_list = [ 'https://dispatcher.rndfnk.com/hr/youfm/live/mp3/high','http://stream.klassikradio.de/live/mp3-192/stream.klassikradio.de/',
'http://scast.regenbogen.de/rr-karlsruhe-64-mp3',
'http://onair.krone.at/kronehit.mp3',
'http://sunshinelive.hoerradar.de/sunshinelive-live-mp3-hq',
 'http://streams.br.de/b5aktuell_2.m3u'
]

function play_radio(url){
    
    // connect to the remote stream
    var Client = icy.get(url, function (res) {

    if(res.headers){
        if(res.headers.location){
            console.log('jump location')
            play_radio(res.headers.location)
        } else{
            console.log('next radio')
            index = (index+1)%stations.length
            play_radio(stations[index].url)
        }
    } 
    /*
    // possible check weather url is icy
    if(! res.rawHeaders['icy-url']) {
        console.log('next radio')
        index = (index+1)%stations.length
        play_radio(stations[index].url)
    }
    */
    // log any "metadata" events that happen
    
    res.on('metadata', function (metadata) {
        var parsed = icy.parse(metadata);
        console.error(parsed);
    });
    
    // Let's play the music (assuming MP3 data).
    // lame decodes and Speaker sends to speakers!
    
    res.pipe(new lame.Decoder())
        .pipe(new Speaker());
    });
    
}
console.log('opened radio with index: ' + index)
async function init(){

    res = await client.query("select * from stations;")
    stations = res.rows

    if (index > -1){
        console.log("playing : " + stations[index].name)
        play_radio(stations[index].url)
    }
    else {
        console.log("available stations:")
        console.log(stations)
    }
}

init()