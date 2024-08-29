document.addEventListener('DOMContentLoaded', function() {
    const urlList = document.getElementById('url-list');

    chrome.storage.sync.get(['urls'], function(result) {
        const urls = result.urls || [];
        urls.forEach(({url, time}, index) => {
            addUrlToList(url, time, index);
        });
    });

    document.getElementById('add').addEventListener('click', function() {
        const url = document.getElementById('url').value;
        const time = document.getElementById('time').value;

        chrome.storage.sync.get(['urls'], function(result) {
            const urls = result.urls || [];
            urls.push({url, time});

            chrome.storage.sync.set({urls: urls}, function() {
                addUrlToList(url, time, urls.length - 1);
            });
        });
    });

    function addUrlToList(url, time, index) {
        const div = document.createElement('div');
        div.className = 'url-item';
        div.innerHTML = `
            <span>${url} => ${time}</span>
            <button data-index='${index}'>Remove</button>
        `;

        div.querySelector('button').addEventListener('click', function() {
            removeUrl(index);
        })

        urlList.appendChild(div);
    }

    function removeUrl(index) {
        chrome.storage.sync.get(['urls'], function(result) {
            let urls = result.urls || [];
            urls.splice(index, 1);

            chrome.storage.sync.set({urls: urls}, function() {
                urlList.innerHTML = '';
                urls.forEach(({url, time}, index) => addUrlToList(url, time, index));
            });
        });
    }

})