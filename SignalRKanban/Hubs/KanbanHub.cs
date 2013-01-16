using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRKanban.Hubs
{
    using System.Collections.Concurrent;

    using Microsoft.AspNet.SignalR;

    using SignalRKanban.Models;

    public class KanbanHub : Hub
    {
        private static ConcurrentDictionary<Guid, Card> _cards = new ConcurrentDictionary<Guid, Card>();

        public void CreateCard(string board)
        {
            var id = Guid.NewGuid();
            var card = new Card { ID = id, Lane = "1", Content = "", Board = board};
            _cards[id] = card;
            Clients.Group(board).cardCreated(card);                        
        }

        public void ChangeCardContent(Guid id, string content)
        {
            var card = _cards[id];
            card.Content = content;
            Clients.Group(card.Board).cardContentChanged(card);
        }
        
        public void MoveCard(Guid id, string lane)
        {
            var card = _cards[id];
            card.Lane = lane;
            Clients.Group(card.Board).cardMoved(id, lane);
        }

        public void JoinBoard(string boardToJoin, string oldBoard)
        {
            Groups.Remove(Context.ConnectionId, oldBoard);
            Groups.Add(Context.ConnectionId, boardToJoin);
            Clients.Caller.clearAllCards();
            var boardCards = _cards.Where(c => c.Value.Board == boardToJoin).ToList();
            foreach (var boardCard in boardCards)
            {
                Clients.Caller.cardCreated(boardCard.Value);
            }
        }
    }
}