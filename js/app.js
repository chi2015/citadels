
App = Ember.Application.create();

App.Card = Ember.Object.extend({
	player : false,
	isChecked : false,
	status : 'in_deck', //in_deck, on_choice, in_hand, built, destroyed, in_lab, on_graveyard, on_wizard, on_swap, in_museum
	onChoose : function() {
		return this.get('status') == 'on_choice';
	}.property('status'),
	init() {
		if (!this.get('desc')) this.set('desc', this.get('name'));
	},
	serialize : function() {
		return {
			"name" : this.get('name'),
			"desc" : this.get('desc'),
			"color" : this.get('color'),
			"pic" : this.get('pic'),
			"cost" : this.get('cost'),
			"status" : this.get('status'),
			"player" : this.get('player') ? this.get('player').get('name') : false
		};
	},
	onWizard : function() {
		return this.get('status') == 'on_wizard';
	}.property('status'),
	inDeck : function() {
		return this.get('status') == 'in_deck';
	}.property('status')
});

App.Deck = Ember.Object.extend({
	init() {
		this.set('content', []);
		var i, deck_content = this.get('content');
		if (this.get('init_deck'))
		{
			this.get('init_deck').forEach(function(card) {
				deck_content.pushObject(App.Card.create(card));
				});
			this.set('init_deck', []);
		} else {
				this.initDefaultDeck();
				if (this.get('extended').length) this.initExtendedDeck();
		}
	},
	extended : [],
	inExtended : function(number) {
		var extended = this.get('extended');
		for (var j=0; j<extended.length; j++)
			if (number == extended[j])
				return true;
		return false;
	},
	cards_on_choose : Ember.computed('content.@each.status', function() {
		return this.get('content').filterBy('status','on_choice').length > 0;
	}),
	card_on_graveyard : Ember.computed('content.@each.status', function() {
		return this.get('content').findBy('status','on_graveyard');
	}),
	initDefaultDeck : function() {
		var deck_content = this.get('content');
		for (i=0; i<5; i++) 
			deck_content.pushObject(App.Card.create({"name":"domain","desc":"Manor","color":"yellow","pic":"domain.jpg","cost":3}));
		for (i=0; i<4; i++) 
			deck_content.pushObject(App.Card.create({"name":"castle","desc":"Castle","color":"yellow","pic":"castle.jpg","cost":4}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"palace","desc":"Palace","color":"yellow","pic":"palace.jpg","cost":5}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"temple","desc":"Temple","color":"blue","pic":"temple.jpg","cost":1}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"church","desc":"Church","color":"blue","pic":"church.jpg","cost":2}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"monastery","desc":"Monastery","color":"blue","pic":"monastery.jpg","cost":3}))
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"cathedral","desc":"Cathedral","color":"blue","pic":"cathedral.jpg","cost":5}));
		for (i=0; i<5; i++) 
			deck_content.pushObject(App.Card.create({"name":"tavern","desc":"Tavern","color":"green","pic":"tavern.jpg","cost":1}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"store","desc":"Trading Post","color":"green","pic":"store.jpg","cost":2}));	
		for (i=0; i<4; i++) 
			deck_content.pushObject(App.Card.create({"name":"market","desc":"Market","color":"green","pic":"market.jpg","cost":2}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"warehouse","desc":"Docks","color":"green","pic":"warehouse.jpg","cost":3}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"harbour","desc":"Harbor","color":"green","pic":"harbour.jpg","cost":4}));	
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"townhall","desc":"Town Hall","color":"green","pic":"townhall.jpg","cost":5}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"watchtower","desc":"Watchtower","color":"red","pic":"watchtower.jpg","cost":1}));	
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"prison","desc":"Prison","color":"red","pic":"prison.jpg","cost":2}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"barracks","desc":"Battlefield","color":"red","pic":"barracks.jpg","cost":3}));	
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"fortress","desc":"Fortress","color":"red","pic":"fortress.jpg","cost":5}));
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"keep","desc":"Keep. The Keep cannot be destroyed by the Warlord.","color":"purple","pic":"keep.jpg","cost":3}));
			
		deck_content.pushObject(App.Card.create({"name":"city","desc":"Miracle Courtyard. At the end of the game, the Miracle Courtyard counts as a colour of your choice.","color":"city","pic":"city.jpg","cost":2}));
		deck_content.pushObject(App.Card.create({"name":"observatory","desc":"Observatory. If you choose to draw cards at the begining of your turn, you may pick three cards, keep one of your choice and place the two others at the bottom the deck.","color":"purple","pic":"observatory.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"lab","desc":"Laboratory. Once per turn, you may discard a District card from your hand and get a gold piece in return.","color":"purple","pic":"lab.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"workshop","desc":"Workshop. Once per turn, you may pay 3 gold to draw 3 cards.","color":"purple","pic":"workshop.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"library","desc":"Library. If you choose to draw cards at the begining of your turn, you keep the two cards you have drawn.","color":"purple","pic":"library.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"school","desc":"School of Magic. For the purposes of income, the School of Magic is considered to be the colour of your choice.","color":"purple","pic":"school.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"greatwall","desc":"Great Wall. The cost to swap or destroy your Districts is increased by one.","color":"purple","pic":"greatwall.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"dragongate","desc":"Dragon Gate. This is a sign of prestige - the kingdom has not seen a dragon in over 1000 years. It costs 6 gold to build, but it's worth 8 points at the end of the game.","color":"purple","pic":"dragongate.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"university","desc":"University. This is a sign of prestige - nobody ever understood what it's for. It costs 6 gold to build, but it's worth 8 points at the end of the game.","color":"purple","pic":"university.jpg","cost":6}));
		if (!this.inExtended(8)) deck_content.pushObject(App.Card.create({"name":"graveyard","desc":"Graveyard. When the Warlord destroys a District, you may pay a gold piece to take the destroyed District into your hand. You cannot do this if you are the Warlord.","color":"purple","pic":"graveyard.jpg","cost":5}));
	},
	extended_deck : [
		{"name":"lighthouse","desc":"Lighthouse. When you play the lighthouse in your city, look through the district cards deck, choose one card and place it in your hand, then reshuffle the deck.","color":"purple","pic":"lighthouse.jpg","cost":3},
		{"name":"museum","desc":"Museum. On your turn, you may place one district card from your hand, face down, under the Museum. At the end of the game, you score 1 extra victory point for each card under the Museum.","color":"purple","pic":"museum.jpg","cost":4},
		{"name":"poorhouse","desc":"Poorhouse. If you have no gold at the end of your turn, get 1 gold from the bank.","color":"purple","pic":"poorhouse.jpg","cost":4},
		{"name":"belltower","desc":"Tower Bell. When you play the Tower Bell in your city, you may shorten the game and decide that it will end at the end of the turn in which a player builds one less district than the specified in the game. You can do this even if the Tower Bell is your last district. If the Tower bell is later destroyed by the Warlord, end conditions go back to normal.","color":"purple","pic":"belltower.jpg","cost":5},
		{"name":"factory","desc":"Factory. The building cost for any other purple building you build in your city is reduced by one. This doesn´t affect the price paid by the Warlord to destroy it.","color":"purple","pic":"factory.jpg","cost":5},
		{"name":"quarry","desc":"Quarry. Allows you to build Districts named as others you've already built.","color":"purple","pic":"quarry.jpg","cost":5},
		{"name":"fountain","desc":"Fountain of Wishes. At the end of the game, the Fountain of Wishes gives you 5 points, plus one more for every other purple District you have built.","color":"purple","pic":"fountain.jpg","cost":5},
		{"name":"ballroom","desc":"Ball room. When you have the crown, all other players must say 'Thanks, your Excellency' after you call his character. If a player forgets and starts his turn without saying it, he loses his turn.","color":"purple","pic":"ballroom.jpg","cost":6},
		{"name":"park","desc":"Park. If you have no card in hand at the end of your turn, draw two cards from the drawing pile.","color":"purple","pic":"park.jpg","cost":6},
		{"name":"hospital","desc":"Hospital. If you are assassinated, you still take two gold or draw two cards and discard one when comes your turn, but that's all you do this turn.","color":"purple","pic":"hospital.jpg","cost":6},
		{"name":"throneroom","desc":"Throne Hall. Every time the crown moves from a player to another, you receive 1 gold from the bank.","color":"purple","pic":"throneroom.jpg","cost":6},
		{"name":"armory","desc":"Powderhouse. During your turn, you can destroy the powderhouse and destroy another district card of your choice in any player's city.","color":"purple","pic":"armory.jpg","cost":3},
		{"name":"treasury","desc":"Imperial Treasury. At the end of the game, you score 1 victory point bonus for each coin in your hand.","color":"purple","pic":"treasury.jpg","cost":4},
		{"name":"maproom","desc":"Map Room. At the end of the game, you score 1 victory point bonus for each card in your hand.","color":"purple","pic":"maproom.jpg","cost":5}
	],
	initExtendedDeck : function() {
		/*for test 
		var extended_deck = this.get('extended_deck');
		for (var i=0; i<extended_deck.length; i++)
			this.get('content').pushObject(App.Card.create(extended_deck[i]));
		*/
		
		var n, chosen = false, deck_content = this.get('content'), extended_deck = this.get('extended_deck');
		for (var i=0; i<3; i++)
		{
			chosen = false;
			while (!chosen) 
			{
				n = Math.floor(Math.random() * extended_deck.length);
				if (!deck_content.findBy('name', extended_deck[n]["name"]))
					if (extended_deck[n]["name"]!="hospital" || !this.inExtended(1))
					{
						chosen = true;
						deck_content.pushObject(App.Card.create(extended_deck[n]));
					}
			}
			console.log(extended_deck[n]["name"]);
		}
	}
});

App.Character = Ember.Object.extend({
	player : false,
	handle_player: false,
	took : false,
	built : 0,
    max_build : 1,
    can_build : function() {
		return this.get('built') < this.get('max_build');
	}.property('built'),
	used_workshop : false,
	used_lab : false,
	used_museum : false,
	thanked : false,
	status : 'in_round', //in_round, in_hand, discarded
    pic : "",
	state : 'normal', //assasinated, robbed, bewitched
	reveal : function(game) {
	   if (this.get('state') == 'assasinated' || this.get('status') == 'discarded') 
	   		if (!this.get('player') || !this.get('player').hasDistrict('hospital'))
		    {
		   		this.endTurn(game);
		   		return;
		    }
	   
	   if (this.get('state') == 'robbed')
	   {
		   var thief_owner = game.get('characters').get('content').findBy('name', 'Thief').get('handle_player');
		   var coins = this.get('player').get('coins');
		   this.get('player').set('coins', 0);
		   thief_owner.set('coins', thief_owner.get('coins') + coins);
	   }
	   
	   this.set('handle_player', this.get('player'));
	   game.set('activePlayer', this.get('handle_player'));
	},
	canTake : true,
	takeCoins : function(game) {
		if (this.get('took')) return;
		this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 2);
		this.set('took', true);
		this.checkAssasinated(game);
		this.checkBewitched(game);
		this.checkThanked(game);
	},
	chooseCard : function(game) {
		if (this.get('took')) return;
		var n, chosen;
		var deck_content = game.get('deck').get('content');
		var deck_length = deck_content.length;
		
		var cards_to_choose = this.get('handle_player').get('hasObservatory') ? 3 : 2;
		
		for (var j=0; j<cards_to_choose; j++)
		{
			chosen = false;
			while (!chosen)
			{
				n = Math.floor(Math.random() * deck_length);
				var card = deck_content.objectAt(n);
				if (card.get('status') == 'in_deck')
				{
					card.set('status', 'on_choice');
					card.set('player', this.get('handle_player'));
					if (this.get('handle_player').get('hasLibrary')) this.takeCard(game, card);
					chosen = true;
				}
			}
		}
		this.set('took', true);
		
		if (this.get('handle_player').get('hasLibrary')) {
			this.checkAssasinated(game);
			this.checkBewitched(game);
			this.checkThanked(game);
		}	
		
	},
	takeCard : function(game, card)
	{
		if (card.get('status') == 'on_choice' && card.get('player') === this.get('handle_player'))
			card.set('status','in_hand');
			
		game.get('deck').get('content').filterBy('status','on_choice').forEach(function(card) {
			card.set('status','in_deck');
			card.set('player',false);
		});
		this.get('handle_player').get('cards').pushObject(card);
		
		if (!this.get('handle_player').get('hasLibrary')) {
			this.checkAssasinated(game);
			this.checkBewitched(game);
			this.checkThanked(game);
		}		
	},
	build : function(game, card) {
		if (this.get('built') == this.get('max_build')) return;
		if (!this.get('took')) return;
		if (card.get('status') != 'in_hand') return;
		if (card.get('player')!== this.get('handle_player')) return;
		
		var build_cost = card.get('cost') - (this.get('handle_player').hasDistrict('factory') &&
		(card.get('color') == 'purple' || card.get('color') == 'city'));
		
		if (build_cost > this.get('handle_player').get('coins'))
		{
			game.showError("You don't have enough coins to build this district");
			return;
		}
		
		if (this.get('handle_player').get('districts').filterBy('name', card.get('name')).length > this.get('handle_player').hasDistrict('quarry'))
		{
			game.showError("You can't build dublicate district");
			return;
		}
				
		card.set('status','built');
		if (card.get('name') == 'belltower') this.get('handle_player').set('can_use_belltower', true);
		if (card.get('name') == 'lighthouse') this.get('handle_player').set('can_use_lighthouse', true);			
		this.get('handle_player').get('districts').pushObject(card);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')-build_cost); 
		this.set('built',this.get('built')+1);
		this.get('handle_player').get('cards').removeObject(card);
	},
	endTurn : function(game) {
		if (this.get('status') == 'in_hand') this.payTax(game);
		if (this.get('handle_player') 
		    && !this.get('handle_player').get('coins') 
		    && this.get('handle_player').hasDistrict("poorhouse"))
		    this.get('handle_player').set('coins',1);
		if (this.get('handle_player') 
		    && !this.get('handle_player').get('cards').length 
		    && this.get('handle_player').hasDistrict("park"))
		    game.drawCards(this.get('handle_player'), 2);
		if (this.get('handle_player') && this.get('handle_player').get('can_use_belltower'))
			this.get('handle_player').set('can_use_belltower', false);
		if (this.get('handle_player') && this.get('handle_player').get('using_lighthouse'))
			this.get('handle_player').set('using_lighthouse', false);
		if (this.get('handle_player') && this.get('handle_player').get('can_use_lighthouse'))
			this.get('handle_player').set('can_use_lighthouse', false);
		if (this.get('handle_player') && this.get('handle_player').get('exploding'))
			this.get('handle_player').set('exploding', false);
		game.nextCharacter();
	},
	payTax : function(game) {
		var tax = game.get('characters').get('content').findBy('name', 'Tax');
		if (tax && tax.get('status') == 'in_hand') {
			if (tax.get('state') == 'assasinated') return;
			var tax_owner = tax.get(this.get('isAssasin') ? 'player' : 'handle_player');
			if (tax_owner === this.get('handle_player')) return;
			if (!this.get('built')) return;
			if (!this.get('handle_player').get('coins')) return;
			this.get('handle_player').set('coins', this.get('handle_player').get('coins') - 1);
			tax_owner.set('coins', tax_owner.get('coins') + 1);
		}
	},
	checkBewitched : function(game) {
		if (this.get('state') == 'bewitched') {
			var witch_owner = game.get('characters').get('content').findBy('name', 'Witch').get('player');
			this.set('handle_player', witch_owner);
			game.set('activePlayer', witch_owner);
		}
	},
	checkAssasinated : function(game) {
		if (this.get('state') == 'assasinated') this.endTurn(game);
	},
	checkThanked : function(game) {
		if (this.get('state') == 'bewitched') return;
		var ballroom = game.get('deck').get('content').findBy('name', 'ballroom');
		if (ballroom && ballroom.get('status') == 'built')
		{
			var ballroom_owner = ballroom.get('player');
			if (ballroom_owner !== this.get('player')
			&& ballroom_owner.get('has_crown') && !this.get('thanked'))
				this.endTurn(game);
		}
	},
	useWorkshop : function(game) {
		if (!this.get('handle_player').get('hasWorkshop')) return;
		if (this.get('used_workshop')) return;
		
		if (this.get('handle_player').get('coins') < 2)
		{
			game.showError("Not enough coins");
			return;
		}
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')-2);
		
		game.drawCards(this.get('handle_player'), 3);
		
		this.set('used_workshop', true);
	},
	useLab : function(card) {
		if (!this.get('handle_player').get('hasLab')) return;
		if (this.get('used_lab')) return;
		
		if ((card.get('status') == 'in_hand' || card.get('status') == 'on_wizard') && card.get('player') === this.get('handle_player'))
		{
			card.set('status', 'in_lab');
			card.set('player', false);
			this.get('handle_player').get('cards').removeObject(card);
			this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 1);
			this.set('used_lab', true);
		}
	},
	underMuseum : function(game, card) {
		if (!this.get('handle_player').get('hasMuseum')) return;
		if (this.get('used_museum')) return;
		if (card.get('status') != 'in_hand' && card.get('status') != 'on_wizard') return;
		if (card.get('player') !== this.get('handle_player')) return;
		
		card.set('status', 'in_museum');
		this.get('handle_player').get('cards').removeObject(card);
		card.set('player', false);
		game.get('player1').set('cards_under_museum', game.get('player1').get('cards_under_museum') + 1);
		game.get('player2').set('cards_under_museum', game.get('player2').get('cards_under_museum') + 1);
		this.set('used_museum', true);
	},
	resetParams : function() {
		this.set('player', false);
		this.set('handle_player', false);
		this.set('took', false);
		this.set('built', 0);
		this.set('state','normal');
		this.set('status','in_round');
		this.set('used_workshop', false);
		this.set('used_lab', false);
		this.set('used_museum', false);
		this.set('thanked', false);
	},
	thanksYourExcellency : function() {
		this.set('thanked', true);
		console.log(this.get('thanked'));
	},
	inRound : function() {
		return this.get('status') == 'in_round';
	}.property('status'),
	isAssasinated : function() {
		return this.get('state') == 'assasinated';
	}.property('state'),
	isRobbed : function() {
		return this.get('state') == 'robbed';
	}.property('state'),
	isBewitched : function() {
		return this.get('state') == 'bewitched';
	}.property('state'),
	serialize : function() {
		return {
			"player" : this.get('player') ? this.get('player').get('name') : false,
			"handle_player" : this.get('handle_player') ? this.get('handle_player').get('name') : false,
			"took" : this.get('took'),
			"built" : this.get('built'),
			"used_workshop" : this.get('used_workshop'),
			"used_lab" : this.get('used_lab'),
			"used_museum" : this.get('used_museum'),
			"status" : this.get('status'),
			"state" : this.get('state'),
			"thanked" : this.get('thanked')
		}	
	}
});

App.Assasin = App.Character.extend({
	name : "Assasin",
	desc: "Assassin. May select a character to Assassinate. That character loses their turn.",
	isAssasin : true,
	number : 1,
	pic: "character1.jpg",
	assasinated: false,
	assasinate : function(character) {
		if (this.get('assasinated')) return;
		if (character.get('isAssasin')) return;
		character.set('state','assasinated');
		this.set('assasinated', true);
	},
	resetParams : function() {
		this._super();
		this.set('assasinated', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['assasinated'] = this.get('assasinated');
		return ret;
	}
}
);

App.Thief = App.Character.extend({
	name: "Thief",
	desc: "Thief. May select a character to steal from. At the start of their turn, the Thief takes their gold.",
	isThief: true,
	pic: "character2.jpg",
	number: 2,
	robbed: false,
	rob : function(character) {
		if (this.get('robbed')) return;
		if (character.get('isAssasin') || character.get('isThief')) return;
		if (character.get('state') == 'assasinated') return;
		character.set('state','robbed');
		this.set('robbed',true);
	},
	resetParams : function() {
		this._super();
		this.set('robbed', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['robbed'] = this.get('robbed');
		return ret;
	}
});

App.Magician = App.Character.extend({
	name: "Magician",
	desc: "Magician. May either exchange hands with another player, or swap cards in his hand for cards from the deck.",
	isMagician: true,
	pic: "character3.jpg",
	number: 3,
	did_magic: false,
	choosed_to_discard : false,
	discarded: false,
	exchange_cards : function(game, player) {
		if (this.get('did_magic')) return false;
		var cards_in_hand = game.get('deck').get('content').filterBy('status','in_hand');
		for (var j=0; j<cards_in_hand.length; j++)
		{
			var card = cards_in_hand.objectAt(j)
			if (card.get('player') === player) 
			{
				card.set('player',this.get('handle_player'));
				this.get('handle_player').get('cards').pushObject(card);
				player.get('cards').removeObject(card);
			}
			else if (card.get('player') === this.get('handle_player')) 
			{
				card.set('player',player);
				player.get('cards').pushObject(card);
				this.get('handle_player').get('cards').removeObject(card);
			}	
		}
		
		this.set('did_magic', true);	
	},
	chooseToDiscard : function() {
		if (this.get('did_magic')) return;
		this.set('choosed_to_discard', true);
		this.set('did_magic', true);
	},
	discardCards : function(game) {
		if (this.get('discarded')) return;
		var n, draw;
		var deck_content = game.get('deck').get('content');
		var checked_cards = deck_content.filterBy('isChecked', true);
		game.drawCards(this.get('handle_player'), checked_cards.length);
		
		var that = this;
		checked_cards.forEach(function(item) {
			item.set('isChecked', false);
			item.set('status', 'in_deck');
			item.set('player', false);
			that.get('handle_player').get('cards').removeObject(item);
		});
		
		this.set('choosed_to_discard', false);
		this.set('discarded', true);	
	},
	resetParams : function() {
		this._super();
		this.set('did_magic', false);
		this.set('discarded', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['did_magic'] = this.get('did_magic');
		ret['choosed_to_discard'] = this.get('choosed_to_discard');
		ret['discarded'] = this.get('discarded');
		return ret;
	}
});

App.ColourCharacter = App.Character.extend({
	color: "",
	isColor: true,
	took_income : false,
	takeIncome : function()
	{
		if (this.get('took_income')) return;
		var player_districts = this.get('handle_player').get('districts');
		for (var j=0; j<player_districts.length; j++)
			if (player_districts.objectAt(j).get('color') == this.get('color'))
				this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 1);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins') + this.get('handle_player').get('hasSchool'));
		this.set('took_income', true);
	},
	resetParams : function() {
		this._super();
		this.set('took_income', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['took_income'] = this.get('took_income');
		return ret;
	}
});

App.King = App.ColourCharacter.extend({
	name: "King",
	desc: "King. Receives income for Noble (yellow) Districts. Also gets first choice of characters during the next turn.",
	number: 4,
	color: "yellow",
	pic: "character4.jpg",
	reveal : function(game) {
		
		if (this.get('status') == 'in_hand')
		{
			var old_crown_owner = game.get('player1').get('has_crown') ? game.get('player1') : game.get('player2');
			game.get('player1').set('has_crown', false);
			game.get('player2').set('has_crown', false);
			this.get('player').set('has_crown', true);
			if (old_crown_owner!==this.get('player')) {
				if (game.get('player1').hasDistrict("throneroom")) game.get('player1').set('coins', game.get('player1').get('coins')+1);
				if (game.get('player2').hasDistrict("throneroom")) game.get('player2').set('coins', game.get('player2').get('coins')+1);
			}
		}
		
		this._super(game);
	}
});

App.Bishop = App.ColourCharacter.extend({
	name: "Bishop",
	desc: "Bishop. Receives income from Religious (blue) Districts. His Buildings cannot be Destroyed by the Warlord or swapped by the Diplomat.",
	number: 5,
	color: "blue",
	pic: "character5.jpg"
});

App.Merchant = App.ColourCharacter.extend({
	name: "Merchant",
	desc: "Merchant. Receives income from Trade (green) Districts. Also receives one gold at the start of his turn.",
	number: 6,
	color: "green",
	pic: "character6.jpg",
	takeCoins: function(game)
	{
		if (this.get('took')) return;
		this._super(game);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')+1);
	},
	takeCard(game, card) {
		this._super(game, card);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')+1);
	}
});

App.Architect = App.Character.extend({
	name: "Architect",
	desc: "Architect. Receives 2 additional cards when he takes his 2 gold or 1 card. Can build up to 3 Districts per turn.",
	number: 7,
	pic: "character7.jpg",
	max_build : 3,
	takeCoins: function(game)
	{
		if (this.get('took')) return;
		this._super(game);
		this.take2Cards(game);
	},
	takeCard(game, card) {
		this._super(game, card);
		this.take2Cards(game);
	},
	take2Cards(game) {
		game.drawCards(this.get('handle_player'), 2);
	}
});

App.Warlord = App.ColourCharacter.extend({
	name: "Warlord",
	desc: "Warlord. Receives income from Military (red) Districts. At the end of his turn, he may destroy a District for the cost of that District -1 gold.",
	isWarlord: true,
	number: 8,
	pic: "character8.jpg",
	color: "red",
	destroyed : false,
	destroy : function(game, player_to, district) {
		if (this.get('destroyed')) return;
		
		if (player_to.get('closed')) 
		{
			game.showError("You can't destroy district in the city with "+player_to.get('districts_to_close')+" or more districts"); 
			return;
		}
		
		if (district.get('name') == 'keep')
		{
			game.showError("Keep can not be destroyed"); 
			return;
		}
		
		var bishop = game.get('characters').get('content').findBy('name','Bishop');
		if (bishop && bishop.get('state')!='assasinated' && bishop.get('handle_player') === player_to)
		{
			game.showError("You can't destroy Bishop's district"); 
			return;
		}
		
		if (district.get('cost') + player_to.get('hasGreatwall') - 1 > this.get('handle_player').get('coins'))
		{
			game.showError("You have not enough coins to destroy this district"); 
			return;
		}
		
		if (district.get('status') == 'built' && district.get('player') === player_to)
		{
			this.get('handle_player').set('coins',this.get('handle_player').get('coins')-district.get('cost')-player_to.get('hasGreatwall')+1);
			player_to.get('districts').removeObject(district);
			district.set('status', player_to.get('hasGraveyard') && player_to.get('coins') ? 'on_graveyard' : 'destroyed');
			if (district.get('name') == 'belltower') player_to.cancelRing(game);
			district.set('player', false);
			this.set('destroyed',true);
		}
	},
	resetParams : function() {
		this._super();
		this.set('destroyed', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['destroyed'] = this.get('destroyed');
		return ret;
	}
});

App.Witch = App.Character.extend({
	name : "Witch",
	desc : "Witch. Can Bewitch a character of her choice, playing part of her turn with the chosen character skills.",
	isWitch : true,
	number : 1,
	pic : "character11.jpg",
	max_build: 0,
	bewitched : false,
	bewitch : function(character) {
		if (this.get('bewitched')) return;
		if (character.get('isWitch')) return;
		character.set('state','bewitched');
		this.set('bewitched', true);
	},
	resetParams : function() {
		this._super();
		this.set('bewitched', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['bewitched'] = this.get('bewitched');
		return ret;
	}
});

App.TaxCollector = App.Character.extend({
	name : "Tax",
	desc : "Tax Collector. Each other player that builds at least one District in her turn, gives one gold to the Tax Collector.",
	number : 2,
	pic : "character12.jpg"
});

App.Wizard = App.Character.extend({
	name: "Wizard",
	number : 3,
	desc: "Wizard. Can choose a card from the hand of another player. Then, he can choose to put in his hand or to build it, regardless of the normal building in this turn.",
	pic: "character13.jpg",
	isWizard : true,
	stole : false,
	wizard_built : false,
	stealCard : function(player, card) {
		if (this.get('stole')) return;
		card.set('status', 'on_wizard');
		card.set('player', this.get('handle_player'));
		player.get('cards').removeObject(card);
		this.get('handle_player').get('cards').pushObject(card);
		this.set('stole', true);
	},
	wizardBuild : function(game, card) {
		if (this.get('wizard_built')) return;
		if (card.get('status') != 'on_wizard') return;
		if (card.get('player')!== this.get('handle_player')) return;
		
		var build_cost = card.get('cost') - (this.get('handle_player').hasDistrict('factory') &&
		(card.get('color') == 'purple' || card.get('color') == 'city'));
		
		if (build_cost > this.get('handle_player').get('coins'))
		{
			game.showError("You don't have enough coins to build this district");
			return;
		}
			
		card.set('status','built');			
		this.get('handle_player').get('districts').pushObject(card);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')-build_cost); 
		this.set('wizard_built', true);
		this.get('handle_player').get('cards').removeObject(card);
	},
	resetParams : function() {
		this._super();
		this.set('stole', false);
		this.set('wizard_built', false);
	},
	endTurn : function(game) {
		if (this.get('status') == 'in_hand' && this.get('state')!='assasinated')
		{
			this.get('handle_player').get('cards').forEach(function(card) {
				card.set('status', 'in_hand');
			});
		}
		
		this._super(game);
	},
	serialize : function() {
		var ret = this._super();
		ret['stole'] = this.get('stole');
		ret['wizard_built'] = this.get('wizard_built');
		return ret;
	}
});

App.Emperor = App.ColourCharacter.extend({
	name: "Emperor",
	desc: "Emperor. Receives income from Noble (gold) Districts. You must give the Crown to another player, who has to pay you a gold piece or a card (your choice).",
	number: 4,
	color: "yellow",
	pic: "character14.jpg",
	isEmperor: true,
	coronated: false,
	resetParams : function() {
		this._super();
		this.set('coronated', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['coronated'] = this.get('coronated');
		return ret;
	},
	canTake : function() {
		return this.get('coronated') || this.get('state') == 'bewitched';
	}.property('coronated'),
	coronate : function(game, player) {
		if (player!==this.get('handle_player')) 
		{
			if (!player.get('coins')) {
				player.giveCardForCrown(game);
				this.set('coronated', true);
			}
			else if (!player.get('cards').length) {
				player.giveCoinForCrown(game);
				this.set('coronated', true);
			}
			else player.set('on_coronation', true);
		}
	}
});

App.Abbot = App.ColourCharacter.extend({
	name: "Abbot",
	desc: "Abbot. Receives income from Religious (blue) Districts. The most rich player must give him a gold piece.",
	number: 5,
	color: "blue",
	pic: "character15.jpg",
	reveal : function(game) {
		if (this.get('state') == 'assasinated' || this.get('status') == 'discarded' || this.get('state') == 'bewitched')
		{
			this._super(game);
		}
		else {
			this._super(game);
			this.stealCoin(game);
		} 
	},
	checkBewitched : function(game) {
		this._super(game);
		this.stealCoin(game);
	},
	stealCoin : function(game) {
		var handle_player = this.get('handle_player');
		var player_from = handle_player === game.get('player2') ? game.get('player1') : game.get('player2');
		if (player_from.get('coins') > handle_player.get('coins'))
		{
			player_from.set('coins', player_from.get('coins') - 1);
			handle_player.set('coins', handle_player.get('coins') + 1);
		}
	}
});

App.Alchemist = App.Character.extend({
	name: "Alchemist",
	desc: "Alchemist. He receives the total cost of a District after building it.",
	number: 6,
	pic: "character16.jpg",
	build : function(game, card) {
		if (this.get('built') == this.get('max_build')) return;
		var coins_to_return = card.get('cost') - (this.get('handle_player').hasDistrict('factory') &&
		(card.get('color') == 'purple' || card.get('color') == 'city'));
		this._super(game, card);
		if (this.get('built')) this.get('handle_player').set('coins', this.get('handle_player').get('coins') + coins_to_return);
	}
});

App.Navigator = App.Character.extend({
	name: "Navigator",
	desc: "Navigator. You can take 4 gold or 4 cards. You cannot build.",
	isNavigator: true,
	number: 7,
	max_build: 0,
	pic: "character17.jpg",
	navigated: false,
	take4Cards : function(game) {
		if (this.get('navigated')) return;
		game.drawCards(this.get('handle_player'), 4);
		this.set('navigated', true);
	},
	take4Coins : function() {
		if (this.get('navigated')) return;
		this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 4);
		this.set('navigated', true);
	},
	resetParams : function() {
		this._super();
		this.set('navigated', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['navigated'] = this.get('navigated');
		return ret;
	}
});

App.Diplomat = App.ColourCharacter.extend({
	name: "Diplomat",
	desc: "Diplomat. Receives income from Military (red) Districts. He can swap a Distritct he owns for one of other player's (except the Bishop), paying them the difference.",
	isDiplomat: true,
	number: 8,
	color: "red",
	pic: "character18.jpg",
	swapped: false,
	resetParams : function() {
		this._super();
		this.set('swapped', false);
	},
	serialize : function() {
		var ret = this._super();
		ret['swapped'] = this.get('swapped');
		return ret;
	},
	swap : function(game, player, district) {
			if (this.get('swapped')) return;
			if (player === this.get('handle_player')) return;
			if (district.get('status') == 'on_swap') return;
			if (district.get('player').get('districts').filterBy('status', 'on_swap').length) return;
			district.set('status', 'on_swap');
			if (!this.get('handle_player').get('districts').filterBy('status', 'on_swap').length ||
			!player.get('districts').filterBy('status', 'on_swap').length) return;
			var compensation = 0;
			var your_district = this.get('handle_player').get('districts').findBy('status', 'on_swap');
			var enemy_district = player.get('districts').findBy('status', 'on_swap');
			
			if (player.get('closed')) 
			{
				game.showError("You can't swap district in the city with "+player.get('districts_to_close')+" or more districts"); 
				
			}
			else if (enemy_district.get('name') == 'keep')
			{
				game.showError("Keep can not be swapped");
			}
			else if (player.get('characters').findBy('name', 'Bishop') && player.get('characters').findBy('name', 'Bishop').get('state')!='assasinated'
			&& player.get('characters').findBy('name', 'Bishop').get('handle_player') === player)
			{
				game.showError("You cannot swap with Bishop");
			}
			else if (enemy_district.get('cost') + player.get('hasGreatwall') > your_district.get('cost') + this.get('handle_player').get('coins'))
			{
				game.showError("Not enough coins to swap this district");
			}
			else if (player.get('districts').filterBy('name', your_district.get('name')).length > player.hasDistrict('quarry')
			|| this.get('handle_player').get('districts').filterBy('name', enemy_district.get('name')).length > this.get('handle_player').hasDistrict('quarry'))
			{
			    game.showError("You cannot swap dublicate districts");
			}
			else {
				if (enemy_district.get('cost') + player.get('hasGreatwall') > your_district.get('cost'))
					compensation = enemy_district.get('cost') + player.get('hasGreatwall') - your_district.get('cost');
				this.get('handle_player').set('coins', this.get('handle_player').get('coins') - compensation);
				player.set('coins', player.get('coins') + compensation);
				player.get('districts').removeObject(enemy_district);
				player.get('districts').pushObject(your_district);
				this.get('handle_player').get('districts').removeObject(your_district);
				this.get('handle_player').get('districts').pushObject(enemy_district);
				your_district.set('player', player);
				enemy_district.set('player', this.get('handle_player'));
				this.set('swapped', true);
			}
			
			your_district.set('status', 'built');
			enemy_district.set('status', 'built');
	}
});

App.Characters = Ember.Object.extend({
	init() {
		this.set('content', []);
		var characters_content = this.get('content');
		characters_content.pushObject(this.inExtended(1) ? App.Witch.create() : App.Assasin.create());
		characters_content.pushObject(this.inExtended(2) ? App.TaxCollector.create() : App.Thief.create());
		characters_content.pushObject(this.inExtended(3) ? App.Wizard.create() : App.Magician.create());
		characters_content.pushObject(this.inExtended(4) ? App.Emperor.create() : App.King.create());
		characters_content.pushObject(this.inExtended(5) ? App.Abbot.create() : App.Bishop.create());
		characters_content.pushObject(this.inExtended(6) ? App.Alchemist.create() : App.Merchant.create());
		characters_content.pushObject(this.inExtended(7) ? App.Navigator.create() : App.Architect.create());
		characters_content.pushObject(this.inExtended(8) ? App.Diplomat.create() : App.Warlord.create());
	},
	extended : [],
	inExtended : function(number) {
		var extended = this.get('extended');
		for (var j=0; j<extended.length; j++)
			if (number == extended[j])
				return true;
		return false;
	}
});

App.Player = Ember.Object.extend({
	is_robot: false,
	has_crown : false,
	name : null,
	closed : Ember.computed('districts.length', 'districts_to_close', function() {
		return this.get('districts').length >= this.get('districts_to_close');
	}),
	closed_first : false,
	districts_to_close : 8,
	coins : 2,
	cards_under_museum : 0,
	on_coronation: false,
	districtOnSwap : Ember.computed('districts.@each.status', function() {
		return this.get('districts').filterBy('status', 'on_swap').length;
	}),
	giveCoinForCrown : function(game) {
		var emperor = game.get('characters').get('content').findBy('name', 'Emperor');
		var emperor_owner = emperor.get('handle_player');
		this.set('coins', this.get('coins') - 1);
		emperor_owner.set('coins', emperor_owner.get('coins') + 1);
		emperor.set('coronated', true);
		var old_crown_owner = game.get('player1').get('has_crown') ? game.get('player1') : game.get('player2');
		game.get('player1').set('has_crown', false);
		game.get('player2').set('has_crown', false);
		this.set('has_crown', true);
		if (old_crown_owner!==this) {
			if (game.get('player1').hasDistrict("throneroom")) game.get('player1').set('coins', game.get('player1').get('coins')+1);
			if (game.get('player2').hasDistrict("throneroom")) game.get('player2').set('coins', game.get('player2').get('coins')+1);
		}
		this.set('on_coronation', false);
	},
	giveCardForCrown : function(game) {
		var emperor = game.get('characters').get('content').findBy('name', 'Emperor');
		var emperor_owner = emperor.get('handle_player');
		var cards = this.get('cards');
		if (cards.length) {
			var n = Math.floor(Math.random() * cards.length);
			var given_card = cards.objectAt(n);
			given_card.set('player', emperor_owner);
			cards.removeObject(given_card);
			emperor_owner.get('cards').pushObject(given_card);
		}
		emperor.set('coronated', true);
		var old_crown_owner = game.get('player1').get('has_crown') ? game.get('player1') : game.get('player2');
		game.get('player1').set('has_crown', false);
		game.get('player2').set('has_crown', false);
		this.set('has_crown', true);
		if (old_crown_owner!==this) {
			if (game.get('player1').hasDistrict("throneroom")) game.get('player1').set('coins', game.get('player1').get('coins')+1);
			if (game.get('player2').hasDistrict("throneroom")) game.get('player2').set('coins', game.get('player2').get('coins')+1);
		}
		this.set('on_coronation', false);
	},
	score : Ember.computed('districts.[]', 'closed', 'closed_first', 'coins', 'cards.[]', 'cards_under_museum', function() {
    	var ret = 0;
		var colors = [];
		this.get('districts').forEach(function(item) {
			ret += item.get('cost');
			if (item.get('color')) colors.push(item.get('color'));
		});
		
		ret += this.hasDistrict('fountain') * 
		(this.get('districts').filterBy('color', 'purple').length
		 + this.get('districts').filterBy('color', 'city').length
		 - this.hasDistrict('fountain'));
		ret += this.hasDistrict('treasury') * this.get('coins');
		ret += this.hasDistrict('maproom') * this.get('cards').length;
		ret += this.hasDistrict('museum') * this.get('cards_under_museum');
		 
		if (this.hasDistrict('dragongate')) ret += 2;
		if (this.hasDistrict('university')) ret += 2;
		if (colors.uniq().length >= 5) ret += 3;
		if (this.get('closed')) ret += 2;
		if (this.get('closed_first')) ret += 2;
		
		return ret;
  	}),
  	init() {
  		this.set('cards', []);
  		this.set('characters', []);
  		this.set('districts', []);
  	},
  	hasDistrict : function(name) {
  		return this.get('districts').filterBy('name', name).length;
  	},
  	hasObservatory : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('observatory');
  	}),
  	hasLibrary : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('library');
  	}),
  	hasWorkshop : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('workshop');
  	}),
  	hasSchool : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('school');
  	}),
  	hasGreatwall : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('greatwall');
  	}),
  	hasDragongate : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('dragongate');
  	}),
  	hasUniversity : Ember.computed('districts.[]', function() {
  		return this.hasDistrict('university');
  	}),
  	hasLab : Ember.computed('districts.[]', function() {
		return this.hasDistrict('lab');
	}),
	hasGraveyard : Ember.computed('districts.[]', function() {
		return this.hasDistrict('graveyard');
	}),
	hasCity : Ember.computed('districts.[]', function() {
		return this.hasDistrict('city');
	}),
	hasFountain : Ember.computed('districts.[]', function() {
		return this.hasDistrict('fountain');
	}),
	hasArmory : Ember.computed('districts.[]', function() {
		return this.hasDistrict('armory');
	}),
	hasMuseum : Ember.computed('districts.[]', function() {
		return this.hasDistrict('museum');
	}),
	hasLighthouse : Ember.computed('districts.[]', function() {
		return this.hasDistrict('lighthouse');
	}),
	hasBallroom : Ember.computed('districts.[]', function() {
		return this.hasDistrict('ballroom');
	}),
	can_use_belltower : false,
	exploging : false,
	can_use_lighthouse : false,
	using_lighthouse : false,
	useLighthouse : function() {
		if (this.get('can_use_lighthouse'))
			this.set('using_lighthouse', true);
	},
	lighthouseTake : function(card) {
		if (this.get('using_lighthouse')) {
			card.set('status', 'in_hand');
			card.set('player', this);
			this.get('cards').pushObject(card);
			this.set('using_lighthouse', false);
			this.set('can_use_lighthouse', false);
		}
	},
	ringTheBell : function(game) {
		if (this.get('can_use_belltower')) {
			game.get('player1').set('districts_to_close', 7);
			game.get('player2').set('districts_to_close', 7);
			this.set('can_use_belltower', false);
		}
	},
	cancelRing : function(game) {
			game.get('player1').set('districts_to_close', 8);
			game.get('player2').set('districts_to_close', 8);
	},
	onExplode : function() {
		if (this.get('hasArmory')) this.set('exploding', true);
	},
	explodeArmory : function(game, district) {
		if (this.get('exploding')) {
			var armory = this.get('districts').findBy('name', 'armory');
			armory.set('status', 'destroyed');
			armory.set('player', false);
			this.get('districts').removeObject(armory);
			district.set('status', 'destroyed');
			if (district.get('player')) 
			{
				var district_owner = district.get('player');
				district_owner.get('districts').removeObject(district);
				if (district.get('name') == 'belltower') district_owner.cancelRing(game);
				if (district_owner.get('districts').length < district_owner.get('districts_to_close'))
				{
					district_owner.set('closed_first', false);
					game.set('first_full_city', false);
				}
			}
			
			district.set('player', false);
			this.set('exploding', false);
		}
	},
	useGraveyard : function(game, pay) {
		if (!this.get('hasGraveyard')) return;
		if (this.get('coins') < 1) return;
		
		var card = game.get('deck').get('card_on_graveyard');

		if (pay) {
			this.set('coins', this.get('coins') - 1);
			this.get('cards').pushObject(card);
		}
		
		card.set('status', pay ? 'in_hand' : 'destroyed');
		card.set('player', pay ? this : false);
	},
	takeCharacter : function(character) {
		if (character.get('status') == 'in_round')
		{
			this.get('characters').pushObject(character);
			character.set('status', 'in_hand');
			character.set('player', this);
		}
	},
	discardCharacter : function(character) {
		if (character.get('status') == 'in_round') character.set('status', 'discarded');
	},
	serialize : function() {
		return {"name" : this.get("name"),
		"is_robot" : this.get("is_robot"),
		"has_crown" : this.get("has_crown"),
		"coins" : this.get("coins"),
		"closed_first" : this.get("closed_first"),
		"on_coronation" : this.get("on_coronation"),
		"districts_to_close" : this.get("districts_to_close"),
		"can_use_belltower" : this.get("can_use_belltower"),
		"can_use_lighthouse" : this.get("can_use_lighthouse"),
		"using_lighthouse" : this.get("using_lighthouse"),
		"exploding" : this.get("exploding"),
		"cards_under_museum" : this.get("cards_under_museum")
		};
	}
});

App.Game = Ember.Object.extend({
	
	name: "new game",
	player1 : null,
	player2: null,
	activePlayer : null,
	deck : null,
	characters : null,
	currentCharacter : null,
	first_full_city : false,
	winner : "",
	is_extended : false,
	extended : [],
	setWinner : function() {
		var winner;
		if (this.get('player1').get('score') > this.get('player2').get('score'))
			winner = this.get('player1').get('name');
		else if (this.get('player1').get('score') < this.get('player2').get('score'))
			winner = this.get('player2').get('name');
		else winner = this.get('player1').get('name')+', '+this.get('player2').get('name');
		this.set('winner', winner);
	},
	setFirstPlayer : function() {
		this.set('activePlayer', Math.random() < 0.5 ? this.get('player1') : this.get('player2'));
	},
	phaze : null, //start, choose, discard, action,  end
	
	start : function(name, player1_name, player2_name, extended) {
			
			this.set('name',name);
			this.set('extended', extended);
			var player1 = App.Player.create({ name :  player1_name, districts : [], characters : [], cards : []});
			var player2 = App.Player.create({ name :  player2_name, is_robot : true, districts : [], characters : [], cards : []});
			this.set('player1', player1);
			this.set('player2', player2);
			this.setFirstPlayer();
			this.get('activePlayer').set('has_crown',true);
			
			var deck = App.Deck.create({extended : this.get('extended')}); 
			this.set('deck',deck);
			
			this.drawCards(this.get('player1'), 4);
			this.drawCards(this.get('player2'), 4);
			
			this.set('currentCharacter', null);
			
			var characters = App.Characters.create({extended : this.get('extended')});
			this.set('characters', characters);
			this.resetCharacters();
			this.set('phaze','choose');
			//console.log(JSON.stringify(this.get('deck')));
	},
	finish : function(text) {
		if (confirm("Are you sure you want to finish this game?"))
		{
			this.setWinner();
			this.set('phaze','end');
		}
	},
	restart : function() {
		this.set('first_full_city', false);
		this.set('winner', '');
		this.set('extended', []);
		this.set('phaze','start');
	},
	showError : function(text) {
		alert(text);
	},
	init() {
		//console.log(JSON.stringify(localStorage.getItem('game')));
		this.set('phaze','start');
		var that = this;
		$( window ).bind("unload", function() {
			that.save();
		});
	},
	save : function() {
		if (this.get('phaze') == 'choose' || this.get('phaze') == 'discard' || this.get('phaze') == 'action')
			localStorage.setItem('game', JSON.stringify(this.serialize()));
	},
	load : function(gameData) {
		var game = JSON.parse(gameData);
		this.set('name', game.name);
		this.set('first_full_city', game.first_full_city);
		this.set('phaze', game.phaze);
		this.set('extended', game.extended);
		this.set('player1', App.Player.create(game.player1));
		this.set('player2', App.Player.create(game.player2));
		
		var gamePlayers = [], owner, handle_player;
		gamePlayers.pushObject(this.get('player1'));
		gamePlayers.pushObject(this.get('player2'));
		this.set('activePlayer', gamePlayers.findBy('name', game.activePlayer));
		
		this.set('deck', App.Deck.create({ init_deck : game.deck, extended : game.extended }));
		this.get('deck').get('content').forEach(function(card) {
			if (card.get('player')) 
			{
				owner = gamePlayers.findBy('name', card.get('player'));
				card.set('player', owner);
				if (card.get('status') == 'in_hand' || card.get('status') == 'on_wizard') owner.get('cards').pushObject(card);
				if (card.get('status') == 'built' || card.get('status') == 'on_swap') owner.get('districts').pushObject(card);
			}
		});
		
		var characters = App.Characters.create({extended : game.extended});
		var character_data;
		
		characters.get('content').forEach(function(character) {
			character_data = game.characters[character.get('number')];
			for (var key in character_data) {
				if (key!='player') character.set(key, character_data[key]);
			}
			
			if (character_data.player) {
				owner = gamePlayers.findBy('name', character_data.player);
				handle_player = gamePlayers.findBy('name', character_data.handle_player);
				character.set('player', owner)
				character.set('handle_player', handle_player);
				owner.get('characters').pushObject(character);
			}
		});
		
		this.set('characters', characters);
		this.set('currentCharacter', game.currentCharacter ? this.get('characters').get('content').findBy('number', game.currentCharacter) : null);
		localStorage.removeItem('game');
	},
	serialize : function() {
		var that = this;
		return {"name" : this.get("name"),
		"player1" : this.get("player1").serialize(),
		"player2" : this.get("player2").serialize(),
		"activePlayer" : this.get("activePlayer") ? this.get("activePlayer").get("name") : null,
		"currentCharacter" : this.get("currentCharacter") ? this.get("currentCharacter").get("number") : null,
		"first_full_city" : this.get("first_full_city"),
		"phaze" : this.get("phaze"),
		"extended" : this.get("extended"),
		"characters" : (function() {
			var charactersArr = [];
			that.get("characters").get("content").forEach(function(character) {
				charactersArr[character.get("number")] = character.serialize();
			});
			return charactersArr;	
		})(),
		"deck" : (function() {
			var cardsArr = [];
			that.get("deck").get("content").forEach(function(card) {
				cardsArr.push(card.serialize());
			});
			return cardsArr;	
		})()
		};
	},
	drawCards : function(player, count)
	{
		for (var j=0; j<count; j++)
			this.drawCard(player);
	},
	drawCard : function(player) {
		var n, draw = false, card,
			deck_content = this.get('deck').get('content'),
			deck_length = deck_content.length;
		
		while (!draw) {
			n = Math.floor(Math.random() * deck_length);
			card = deck_content.objectAt(n);
			if (card.get('status') == 'in_deck')
				{
					card.set('status', 'in_hand');
					card.set('player', player);
					player.get('cards').pushObject(card);
					draw = true;
				}
		}
	},
	youActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player1');
	}.property('activePlayer'),
	robotActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player2');
	}.property('activePlayer'),
	player1Blocked : Ember.computed('activePlayer', 'player1', 'player2', 'currentCharacter', 'currentCharacter.thanked', function() {
		return (this.get('currentCharacter').get('state') == 'bewitched' && this.get('currentCharacter').get('player') === this.get('player1')
		&& this.get('activePlayer') === this.get('player1')) || (this.get('currentCharacter').get('state') == 'assasinated' && 
		this.get('currentCharacter').get('player') === this.get('player1'))
		|| (this.get('player2').get('hasBallroom') && this.get('player2').get('has_crown') && this.get('currentCharacter').get('state') != 'bewitched' 
		&& !this.get('currentCharacter').get('thanked'));
	}),
	player2Blocked : Ember.computed('activePlayer', 'player1', 'player2','currentCharacter', 'currentCharacter.thanked', function() {
		return (this.get('currentCharacter').get('state') == 'bewitched' && this.get('currentCharacter').get('player') === this.get('player2')
		&& this.get('activePlayer') === this.get('player2')) || (this.get('currentCharacter').get('state') == 'assasinated' && 
		this.get('currentCharacter').get('player') === this.get('player2'))
		|| (this.get('player1').get('hasBallroom') && this.get('player1').get('has_crown') && this.get('currentCharacter').get('state') != 'bewitched' 
		&& !this.get('currentCharacter').get('thanked'));
	}),
	toggleActivePlayer : function() {
		if (this.get('activePlayer') === this.get('player1')) this.set('activePlayer', this.get('player2'));
		else if (this.get('activePlayer') === this.get('player2')) this.set('activePlayer', this.get('player1'));
	},
	phazeIsStart : function () {
		return this.get('phaze') === 'start';
	}.property('phaze'),
	phazeIsChoose : function () {
		return this.get('phaze') === 'choose';
	}.property('phaze'),
	phazeIsDiscard : function () {
		return this.get('phaze') === 'discard';
	}.property('phaze'),
	phazeIsAction : function () {
		return this.get('phaze') === 'action';
	}.property('phaze'),
	phazeIsEnd : function () {
		return this.get('phaze') === 'end';
	}.property('phaze'),
	changePhaze : function()
	{
		var characters_rest = this.get('characters').get('content').filterBy('status','in_round').length;
		var owner = this.get('activePlayer').get('is_robot') ? 'robot' : 'me';
		switch (characters_rest)
		{
			case 6: 
			case 4: 
			case 2:
				this.toggleActivePlayer(); 
				this.set('phaze', 'choose');
				break;
								
			case 5:
			case 3: 
				this.set('phaze', 'discard');
				break;
								
			case 1: 
				this.get('characters').get('content').findBy('status','in_round').set('status', 'discarded');
				this.set('phaze', 'action'); 
				this.nextCharacter();
				break;
		}
	},
	checkFirstClosed : function(player) {
		if (this.get('first_full_city')) return;
		if (player.get('closed')) {
			this.set('first_full_city', true);
			player.set('closed_first', true);
		}
	},
	districtsOnSwapText : function() {
		
	},
	nextCharacter : function() {
		
		this.checkFirstClosed(this.get('activePlayer'));
		
		var character = this.get('currentCharacter');
		var n = !character ? 0 : character.get('number');
		if (n == 8)
		{
			this.resetCharacters();
			
			if (this.get('first_full_city'))
			{
				this.set('phaze', 'end');
				this.setWinner();
			}
			else {
				this.set('phaze','choose');
				this.set('currentCharacter', null);
				this.set('activePlayer', this.get('player1').get('has_crown') ? this.get('player1') : this.get('player2'));
				this.get('player1').set('characters',[]);
				this.get('player2').set('characters',[]);
			}
			return;	
		}
		
		n = n+1;
		this.set('currentCharacter', this.get('characters').get('content').findBy('number', n));

		character = this.get('currentCharacter');
		character.reveal(this);
	},
	resetCharacters : function() {

		var characters = this.get('characters').get('content');
		
		for (var j=0; j<characters.length; j++)
		{
			characters.objectAt(j).resetParams();
		}
		
		this.get('player1').set('characters', []);
		this.get('player2').set('characters', []);
		
		var d = Math.floor(Math.random() * characters.length);
		characters.objectAt(d).set('status', 'discarded');
	}
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		var game = App.Game.create();
		//localStorage.removeItem('game'); // temp for debug
		if (localStorage.getItem('game')) {
			var gameData = localStorage.getItem('game');
			game.load(gameData);
		}
		
		this.set('game', game);
		return game;
  },
  game : null,
  actions : {
  		start : function(gameName, yourName, robotName) {
  		   var extended = [];
  		   var cb_ext_arr = $('input[id^="cb_ext_"]:checked');
  		   
  		   if (this.get('game').get('is_extended') && !cb_ext_arr.length)
  		   {
  		   		this.get('game').showError('You should choose at least one extended character');
  		   		return;
  		   }
  		   
  		   var names_arr = {'Game name' : gameName, 'Your name' : yourName, 'Robot name' : robotName};
  		   
  		   for (var key in names_arr)
			   if (names_arr[key] && !names_arr[key].match('^[0-9A-Za-z_]+$'))
			   {
					this.get('game').showError(key+' can contain only the characters: 0-9, A-Z, a-z, _');
					return;
			   }
			   
		   if (yourName && robotName && yourName == robotName) {
			   this.get('game').showError('Your name and robot name should not be the same');
  		   		return;
		   } 
			
  		   for (var j=0; j<cb_ext_arr.length; j++)
					extended.push(parseInt(cb_ext_arr.eq(j).attr('id').substring(7)));

  		   this.get('game').start(gameName || "New Game", yourName || "Human", robotName || "Robot", extended);
  		},
  		setExtended : function() {
  			this.get('game').set('is_extended', $('input[name="game_type"]:checked').val() == 'extended');
  		},
  		randomExtended : function() {
			var gen_arr = [1,2,3,4,5,6,7,8];
			var ext_cnt = Math.floor(Math.random() * gen_arr.length);
			for (var i=0; i<ext_cnt; i++) gen_arr.splice(Math.floor(Math.random() * gen_arr.length), 1);
			$('input[id^="cb_ext_"]').prop('checked', false);
			for (var j=0; j<gen_arr.length; j++) {
				$('#cb_ext_'+gen_arr[j]).prop('checked', true);	
			}
		},
  		finish : function(game) {
  			game.finish();
  		},
  		restart : function(game) {
  			game.restart();
  		},
		takeCharacter : function(game, player, character) {
			player.takeCharacter(character);
			game.changePhaze();
		},
		discardCharacter : function(game, player, character) {
			player.discardCharacter(character);
			game.changePhaze();
		},
		takeCoins : function(game, character) {
			character.takeCoins(game);
		},
		chooseCards : function(game, character) {
			character.chooseCard(game);
		},
		takeCard : function(game, character, card) {
			character.takeCard(game, card);
		},
		build : function(game, character, card) {
			if (character.get('choosed_to_discard')) return;
			if (character) character.build(game, card);
		},
		endTurn : function(game, character) {
			character.endTurn(game);
		},
		assasinateCharacter : function(assasin, character)
		{
			assasin.assasinate(character);
		},
		bewitchCharacter : function(witch, character)
		{
			witch.bewitch(character);
		},
		robCharacter : function(robber, character)
		{
			robber.rob(character);
		},
		exchangeCards : function(game, character, player)
		{
			character.exchange_cards(game, player);
		},
		chooseToDiscard : function(character)
		{
			character.chooseToDiscard();
		},
		discardCards : function(game, character) {
			character.discardCards(game);
		},
		stealCard : function(character, player, card) {
			character.stealCard(player, card);
		},
		wizardBuild : function(game, character, card) {
			character.wizardBuild(game, card);
		},
		coronate : function(game, character, player) {
			character.coronate(game, player);
		},
		giveCoinForCrown : function(game, player) {
			player.giveCoinForCrown(game);
		},
		giveCardForCrown : function(game, player) {
			player.giveCardForCrown(game);
		},
		take4Coins : function(character) {
			character.take4Coins();
		},
		take4Cards : function(game, character) {
			character.take4Cards(game);
		},
		takeIncome : function(character) {
			character.takeIncome();
		},
		destroy : function(game, character, player_to, district) {
			if (player_to === game.get('activePlayer')) return;
			if (game.get('activePlayer') === game.get('player1') && game.get('player1Blocked')) return;
			if (game.get('activePlayer') === game.get('player2') && game.get('player2Blocked')) return;
			if (character && character.get('isWarlord')) character.destroy(game, player_to, district);
		},
		swap : function(game, character, district) {
			var player_to = game.get('activePlayer') === game.get('player2') ? game.get('player1') : game.get('player2');
			if (game.get('activePlayer') === game.get('player1') && game.get('player1Blocked')) return;
			if (game.get('activePlayer') === game.get('player2') && game.get('player2Blocked')) return;
			if (character && character.get('isDiplomat')) character.swap(game, player_to, district);
		},
		useWorkshop : function(game, character) {
			character.useWorkshop(game);
		},
		toLab : function(character, card) {
			character.useLab(card);
		},
		toMuseum : function(game, character, card) {
			character.underMuseum(game, card);
		},
		ringTheBell : function(game, player) {
			player.ringTheBell(game);
		},
		onExplode : function(player) {
			player.onExplode();
		},
		explode : function(game, player, district) {
			player.explodeArmory(game, district);
		},
		useLighthouse : function(player) {
			player.useLighthouse();
		},
		lighthouseTake : function(player, card) {
			player.lighthouseTake(card);
		},
		thanksYourExcellency : function(character) {
			character.thanksYourExcellency();
		},
		yesGraveyard : function(game, player_to) {
			player_to.useGraveyard(game, true);
		},
		noGraveyard : function(game, player_to) {
			player_to.useGraveyard(game, false);
		}	
  }
});
