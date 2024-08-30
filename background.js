// Run when the service worker is initialized
chrome.storage.sync.get(['urls'], function(result) {
    setupAlarms(result.urls || []);
  });
  
  // Listen for changes in storage and update alarms
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'sync' && changes.urls) {
      setupAlarms(changes.urls.newValue || []);
    }
  });
  
  function setupAlarms(urls) {
    // Clear all existing alarms
    chrome.alarms.clearAll(function() {
  
      // Set new alarms
      urls.forEach(({ url, time }) => {
        const [hours, minutes] = time.split(':');

        const now = new Date();
        const alarmTime = new Date();

        alarmTime.setHours(hours);
        alarmTime.setMinutes(minutes);
  
        if (alarmTime > now) {
          const delayInMinutes = (alarmTime - now) / 1000 / 60;
          chrome.alarms.create(url, { delayInMinutes });
        } else {
          console.log(`Scheduled time ${alarmTime} has already passed for ${url}`);
        }
        
      });
    });
  }
  
  chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.tabs.create({ url: alarm.name });
  });