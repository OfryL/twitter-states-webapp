function LetterTree(key) {
    this.key = key;
    this.value = undefined;
    this.top10 = [];
}

LetterTree.prototype.updateTop10 = function (name, count) {
    const notifyTopUpdate = () => {
        if (this.newTopNotifyCb && typeof this.newTopNotifyCb === 'function') {
            this.newTopNotifyCb(this.top10);
        }
    };
    let node = this.top10.find(x => x.n === name);
    if (node) {
        node.c = node.c + 1;
        notifyTopUpdate();
    } else {
        this.top10.push({n: name, c:count});
        this.top10 = this.top10.sort(function(a, b) {
            if (a.c <= b.c) {
                return 1;
            } else {
                notifyTopUpdate();
                return -1;
            }
        })
            .slice(0, 10);
    }
};

LetterTree.prototype.count = function (name) {
    let value = this.get(name).value,
        count;

    if (!value || value === 'not found' || !Number.isInteger(value)) {
        count = 1;
    } else {
        count = value + 1;
    }
    this.put(name, count);
    this.updateTop10(name, count);
    return count;
};

LetterTree.prototype.put = function (name, value) {
    let node = this,
        nameLength = name.length,
        i = 0,
        currentLetter;

    for (i = 0; i < nameLength; i++) {
        currentLetter = name[i];
        node = node[currentLetter] || (node[currentLetter] = new LetterTree(currentLetter));
        node.updateTop10(name, node.value || 1);
    }

    node.value = value;
    node.name = name;

    return node;
};

LetterTree.prototype.get = function (name) {
    let node = this,
        nameLength = name.length,
        i;

    for (i = 0; i < nameLength; i++) {
        if (!(node = node[name[i]])) break;
    }

    return (i === nameLength) ? node : 'not found';
};

module.exports = {LetterTree};