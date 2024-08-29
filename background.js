chrome.storage.sync.get(['urls'], function(result) {
    const urls = result.urls || [];

    urls.forEach(({url, time}) => {
        const [hours, minutes] = time.split(':');

        const now = new Date();
        const alarmTime = new Date();

        alarmTime.setHours(hours);
        alarmTime.setMinutes(minutes);

        if (alarmTime > now) {
            
            // Delay computed in minutes
            const delay = (alarmTime - now)/(1000 * 60);

            chrome.alarms.create(url, {delay});
        }
    })
})

chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.tabs.create({url: alarm.name});
})