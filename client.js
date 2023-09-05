//Initialize the xAPI on page load to make the xapi object available.
//Creating a persistent Cookie with navigator ID is not necessary,
//just done as an example for how to distinguish between unique navigators.
async function init() {
    try {
        xapi = await getXAPI();
        //xapistatus.textContent = "jsxapi available";
        unique_id = createPersistentCookie();
        //content.textContent = "Navigator ID: " + unique_id;
        //setupSubscriptions();
        getAnaCurrent();
        //updateSerial();
    } catch(e) {
        //content.textContent = e.message;
        //xapistatus.textContent = "error getting jsxapi object";
    }
}

window.onload = async function() {
    init();
};

//Persistent Cookie example for Unique Navigator ID:
//Searches for an existing cookie, if not found generates a new UUID and stores it.
function createPersistentCookie() {
    value_or_null = (document.cookie.match(/^(?:.*;)?\s*uniqueId\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
    var ret_val;
    if(value_or_null == null) {
        var expiration_date = new Date();
        var cookie_string = '';
        expiration_date.setFullYear(expiration_date.getFullYear() + 1);
        cookie_string = "uniqueId=" + uuidv4() +"; path=/; expires=" + expiration_date.toUTCString();
        document.cookie = cookie_string;
    }
    return (document.cookie.match(/^(?:.*;)?\s*uniqueId\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function getAnaCurrent() {
    try{
        let data = {}
        const temp = await xapi.Status.RoomAnalytics.AmbientTemperature.get()
        data.temperature = temp;
        const hum = await xapi.Status.RoomAnalytics.RelativeHumidity.get()
        data.humidity = hum;
        const aq = await xapi.Status.RoomAnalytics.AirQuality.Index.get()
        data.airQuality = aq;
        await updatePanel(data)
        return
    }catch(e){
        console.error(e);
        document.getElementById('error').textContent = e;
    }
}

async function updatePanel(data) {
    document.getElementById('temperature').textContent = data.temperature + ' &deg;C';
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('airQuality').textContent = data.airQuality;
    return
}