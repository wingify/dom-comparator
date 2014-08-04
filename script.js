function get(file, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(xhr.responseText);
        }
    }

    xhr.open("GET", file, true);
    xhr.send();
}

function include(file, node, cb) {
    get(file, function (contents) {
        if (!node) {
            var scripts = document.querySelectorAll('script'), script;
            for (var i = 0; i < scripts.length; i++) {
                script = scripts[i];
                if (script.textContent.indexOf(file) >= 0 && script.textContent.indexOf('include') >= 0) {
                    break;
                }
            }
            node = script;
        }

        var content = document.createElement('div');
        content.innerHTML = contents;
        node.parentNode.replaceChild(content, node);

        var blocks = content.querySelectorAll('pre code');
        for (i = 0; i < blocks.length; i ++) {
            hljs.highlightBlock(blocks[i]);
        }
        cb();
    });
}

function parseAnchors(node) {
    node = node || document;
    var anchors = node.querySelectorAll('nav a'), anchor;
    for (var i = 0; i < anchors.length; i++) {
        anchor = anchors[i];
        if (window.location.href.indexOf(anchor.getAttribute('href')) >= 0) {
            node.querySelector('nav a.active').className = '';
            anchor.className = 'active';
        }
        anchor.onclick = function () {
            var active = node.querySelector('nav a.active');;
            if (active) { active.className = ''; }
            this.className = 'active';
            var href = this.getAttribute('href');
            window.history.pushState(href, href, href);
            includeContent();
            return false;
        };
    }
}

function includeContent() {
    var activeAnchor = document.querySelector('nav a.active');
    include(activeAnchor.getAttribute('href'), document.querySelector('.content > *'), function () {
        get('disqus.html', function (disqus) {
            $('.content .main-content').append(disqus);
        });
    });
    document.title = activeAnchor.textContent + ' - Resource Manager';
}

function navigateHome() {
    get('index.html', function (file) {
        document.write(file);
    });
    document.write('<style>*{display:none}</style>');
}