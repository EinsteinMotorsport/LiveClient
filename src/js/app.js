let app = {

    // Property for an Websocket Instance
    websocket: null,

    // Handles the data-flow to the chart
    chartDataHandler: new DataHandler(),

    // Initialize Application
    init: function () {
        // register its elements
        this.registerEvents();

        // Starts draggable
        draggable.init();

        // Initialize the chart loaded by default
        this.initCharts();

        // Init ChartConfiguration overlay
        chartConfiguration.init();
    },

    // Registers all events depending on this class
    registerEvents: function () {
        let me = this;

        // Event-listener for elements starting a WebSocket connection
        document.getElementsByClassName('start-socket').on('click', me.onClickStartSocket);

        // Event-listener for elements stopping a WebSocket connection
        document.getElementsByClassName('stop-socket').on('click', me.onClickStopSocket);
    },


    /**
     * Initialize the chart loaded by default
     *
     * Sets the chart object for each card.
     */
    initCharts: function () {
        document.querySelectorAll("[data-chart-id]").forEach((value, key) => {
            app.chartDataHandler.charts[key] = new LineChart(value.querySelector('.media > svg'));
        });
    },

    // Event-listener for elements starting a WebSocket connection
    onClickStartSocket: function (e) {
        let me = this;

        // New connection to local running WebSocket Server
        me.websocket = new WebSocket("ws://localhost:7777/service");

        // When connection is established
        me.websocket.onopen = function () {
            // Send test-data to the Server
            me.websocket.send("Hello server");
        };

        // Event for handling data sent from the server
        me.websocket.onmessage = function (evt) {
            // Parse Data and give it to the charts
            app.chartDataHandler.push(evt.data);
        };

        // Event fired when WebSocket connection is closed
        me.websocket.onclose = function () {
            // websocket is closed.
        };
    },

    // Event-listener for elements stopping a WebSocket connection
    onClickStopSocket: function () {
        if (this.websocket != null) {
            this.websocket.close();
        }
    },
};

// Start application when document is completely loaded
document.addEventListener("DOMContentLoaded", function () {
    app.init();
});


// Event handler for an Array of classes
Object.prototype.on = function (event, callback) {
    let me = this;

    // If multiple elements => loop
    if (NodeList.prototype.isPrototypeOf(me) || HTMLCollection.prototype.isPrototypeOf(me)) {

        // Add EventListener for each element
        Array.from(me).forEach(function (element) {
            element.addEventListener(event, function (e) {
                callback(e)
            });
        });

    } else {

        // Add EventListener for single element
        me.addEventListener(event, function (e) {
            callback(e)
        });

    }
};

// First char uppercase
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 *
 * https://stackoverflow.com/a/12646864
 */
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};
