const socket = io.connect('/');

const toplist = Vue.component('toplist',{
    template: '#toplist',
    props: ['name', 'urlprefix'],
    data: function () {
        return {
            items: [] ,
            filterInput: ''
        }
    },
    created: function(){
        this.filterInput = '';
        this.title = this.name;
        socket.on(this.name, (data) => {
            this.items = data.slice(0, 10);
        });
    },
    watch: {
        'filterInput': function (val, preVal) {
            socket.emit(this.name + 'Filter', {filter: val, old: preVal});
            socket.off(this.name + preVal);
            socket.on(this.name + val, (data) => {
                if (data) {
                    this.items = data.slice(0, 10);
                } else {
                    this.items = [{n: 'Not Found.'}];
                }
            });
        }
    }
});

const app = new Vue({
    el: '#main',
    data: {
        tweetPerSec: 0
    },
});

socket.on('error', function (error) {
    console.error(error);
});

socket.on('tweetPerSec', function (data) {
    app.tweetPerSec = data;
});
