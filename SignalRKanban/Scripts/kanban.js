$(function () {
    var kanbanHub = $.connection.kanbanHub;
    var draggedCard;
    
    KanbanBoard.prototype.createCard = function() {
        kanbanHub.server.createCard();
    };
    
    KanbanBoard.prototype.dragCard = function (card, event) {
        draggedCard = card;
        return true;
    };
    
    KanbanBoard.prototype.dropCardOnLane = function (lane, event) {
        kanbanHub.server.moveCard(draggedCard.id(), lane.id());
    };
    
    Card.prototype.isEditingChanged = function (newVal, card) {
        if (!newVal) {
            kanbanHub.server.changeCardContent(card.id(), card.content());
        }
    };
    
    var vm = new KanbanBoard();
    
    ko.applyBindings(vm);

    kanbanHub.client.cardCreated = function (card) {
        vm.addNewCardToLane(card.ID, card.Content, card.Lane);
    };

    kanbanHub.client.cardContentChanged = function (card) {
        vm.setCardContentById(card.ID, card.Content);
    };

    kanbanHub.client.cardMoved = function (id, lane) {
        vm.moveCardToLane(id, lane);
    };

    $.connection.hub.start();
});
