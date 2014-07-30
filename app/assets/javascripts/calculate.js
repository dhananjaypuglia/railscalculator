var Calculator = function (viewId,wrapperId) {
    this.viewElement = $(viewId).clone().appendTo(wrapperId);
    this.calculatorcreated = false;
    this.commandElement = this.viewElement.find("#command");
    this.buttonElement = this.viewElement.find("#calculate");
    this.resultElement = this.viewElement.find("#result");
    this.clearElement = this.viewElement.find("#clear");
    this.observers = $({});
    this.initialize();
};
Calculator.prototype = {
    initialize: function () {
        var self = this;
        self.buttonElement.click(_.bind(self.observeClickElement, self));
        self.clearElement.click(_.bind(self.clearClickElement, self));
    },
    clearClickElement: function () {
        this.clearResultElement();
        this.notifyClearCommand();
    },
    clearResultElement: function(){
        this.resultElement.text("");
    },
    observeClickElement: function () {
        if (!this.calculatorcreated) {
            this.createCalculator();
            this.calculate();
        }
        else {
            this.calculate();
        }
    },
    createCalculator: function () {
        var self = this;
        $.ajax({
            type: "POST",
            url: "api/create"
        }).success(_.bind(self.updateStatus, self));
    },
    updateStatus: function (data, statustext, xhr) {
        if (xhr.status == 200) {
            this.updateGrabbedStatus();
            this.notifyCalculatorGrabbed();
        }
        else if (xhr.status == 201) {
            this.updateCreateStatus();
            this.notifyCalculatorCreated();
        }
    },
    updateCreateStatus: function () {
        this.calculatorcreated = true;
        this.resultElement.append("Calculator Created<br><br>");
    },
    updateGrabbedStatus: function () {
        this.calculatorcreated = true;
        this.resultElement.append("Calculator Grabbed<br><br>");
    },
    calculate: function () {
        var self = this;
        $.ajax({
            type: "PUT",
            url: "api/calculate",
            data: {command: self.commandElement.val()}
        }).success(_.bind(self.updateResult, self));
    },

    updateResult: function (data) {
        this.updateResultElement(null, data.state, this.commandElement.val());
        this.notifyCalculatorUpdated(data.state, this.commandElement.val());
    },
    updateResultElement: function (event, result, command) {
        $(this.resultElement).append("Result is " + result + " for command " + command + "<br><br>");
    },
    registerObserver: function (otherCalculator) {
        this.observers.on("calculator:created", _.bind(otherCalculator.updateCreateStatus, otherCalculator));
        this.observers.on("calculator:grabbed", _.bind(otherCalculator.updateGrabbedStatus, otherCalculator));
        this.observers.on("calculator:updated", _.bind(otherCalculator.updateResultElement, otherCalculator));
        this.observers.on("calculator:clear", _.bind(otherCalculator.clearResultElement, otherCalculator));
    },

    notifyCalculatorCreated: function () {
        this.observers.trigger("calculator:created");
    },
    notifyCalculatorGrabbed: function () {
        this.observers.trigger("calculator:grabbed");
    },
    notifyCalculatorUpdated: function (state, command) {
        this.observers.trigger("calculator:updated", [state, command]);
    },
    notifyClearCommand: function () {
        this.observers.trigger("calculator:clear");
    }
};
var Calculators = function(viewId){
    this.calculatorArray = [];
    this.viewElementId = $(viewId);
    this.addElementId = this.viewElementId.find("#addCalculator");
    this.calculatorsWrapper = this.viewElementId.find("#wrapper");
    this.initialize();
};
Calculators.prototype = {
    initialize:function(){
      this.addElementId.click(_.bind(this.addCalculator,this));
    },
    addCalculator: function () {
        var calculator = new Calculator("#template #calculator",this.calculatorsWrapper);
        $.each(this.calculatorArray, function (index, calc) {
            calc.registerObserver(calculator);
            calculator.registerObserver(calc);
        });
        this.calculatorArray.push(calculator);

    }
};
$(document).ready(function () {
    var calculators = new Calculators("#calculators");
});