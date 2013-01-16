$(function () {
    var kanbanHub = $.connection.kanbanHub;
    
    KanbanBoard.prototype.createCard = function() {
        kanbanHub.server.createCard();
    };
    
    var vm = new KanbanBoard();
    
    ko.applyBindings(vm);

    kanbanHub.client.cardCreated = function (card) {
        vm.addNewCardToLane(card.ID, card.Content, card.Lane);
    };

    $.connection.hub.start();
});
