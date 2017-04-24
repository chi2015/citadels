
App = Ember.Application.create();

App.Card = Ember.Object.extend({
	player : false,
	init() {
		this.set('status','in_deck');  //in_deck, on_choice, in_hand, built, destroyed
	},
	inMyHand : function() {
		return this.get('status') == 'in_hand' && this.get('player') == 'me';
	}.property('status', 'player'),
	inRobotHand : function() {
		return this.get('status') == 'in_hand' && this.get('player') == 'robot';
	}.property('status', 'player'),
	onChoose : function() {
		return this.get('status') == 'on_choice';
	}.property('status')
});

App.Deck = Ember.Object.extend({
	content : [],
	init() {
		var i, cards = [];
		var self = this;
		for (i=0; i<5; i++) 
			cards.push(App.Card.create({"name":"domain","color":"yellow","pic":"domain.jpg","cost":3}));
		for (i=0; i<5; i++) 
			cards.push(App.Card.create({"name":"castle","color":"yellow","pic":"castle.jpg","cost":4}));
		for (i=0; i<2; i++) 
			cards.push(App.Card.create({"name":"palace","color":"yellow","pic":"palace.jpg","cost":5}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"temple","color":"blue","pic":"temple.jpg","cost":1}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"church","color":"blue","pic":"church.jpg","cost":2}));
		for (i=0; i<4; i++) 
			cards.push(App.Card.create({"name":"monastery","color":"blue","pic":"monastery.jpg","cost":3}))
		for (i=0; i<2; i++) 
			cards.push(App.Card.create({"name":"cathedral","color":"blue","pic":"cathedral.jpg","cost":5}));
		for (i=0; i<5; i++) 
			cards.push(App.Card.create({"name":"tavern","color":"green","pic":"tavern.jpg","cost":1}));
		for (i=0; i<4; i++) 
			cards.push(App.Card.create({"name":"store","color":"green","pic":"store.jpg","cost":2}));	
		for (i=0; i<4; i++) 
			cards.push(App.Card.create({"name":"market","color":"green","pic":"market.jpg","cost":2}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"warehouse","color":"green","pic":"warehouse.jpg","cost":3}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"harbour","color":"green","pic":"harbour.jpg","cost":4}));	
		for (i=0; i<2; i++) 
			cards.push(App.Card.create({"name":"townhall","color":"green","pic":"townhall.jpg","cost":5}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"watchtower","color":"red","pic":"watchtower.jpg","cost":1}));	
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"prison","color":"red","pic":"prison.jpg","cost":2}));
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"barracks","color":"red","pic":"barracks.jpg","cost":3}));	
		for (i=0; i<3; i++) 
			cards.push(App.Card.create({"name":"fortress","color":"red","pic":"fortress.jpg","cost":5}));
		this.set('content',cards);
	}
});

App.Character = Ember.Object.extend({
	player : false,
	took : false,
	built : 0,
    max_build : 1,
    can_build : function() {
		return this.get('built') < this.get('max_build');
	}.property('built'),
    pic : "",
	init() {
		this.set('status','in_round'); //in_round, in_hand, discarded
	},
	state : 'normal', //assasinated, robbed
	takeCoins : function(player, deck) {
		if (this.get('took')) return;
		player.set('coins', player.get('coins') + 2);
		this.set('took', true);
	},
	chooseCard : function(player, deck) {
		if (this.get('took')) return;
		var n, chosen;
		var deck_length = deck.get('content').length;
		for (var j=0; j<2; j++)
		{
			chosen = false;
			while (!chosen)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (deck.get('content').objectAt(n).get('status') == 'in_deck')
				{
					deck.get('content').objectAt(n).set('status', 'on_choice');
					deck.get('content').objectAt(n).set('player', player.get('is_robot') ? 'robot' : 'me');
					chosen = true;
				}
			}
		}
		player.set('cards_on_choose', true);
		this.set('took', true);
	},
	takeCard : function(player, deck, n)
	{
		var player_is = player.get('is_robot') ? 'robot' : 'me';
		var chosen_card = deck.get('content').objectAt(n);
		if (chosen_card.get('status') == 'on_choice' && chosen_card.get('player') == player_is)
			chosen_card.set('status','in_hand');
			
		deck.get('content').filterBy('status','on_choice').forEach(function(card) {
			card.set('status','in_deck');
			card.set('player',false);
		});
		player.set('cards_count', player.get('cards_count')+1);
		player.set('cards_on_choose', false);
		
	},
	
	build : function(game, player, deck, n) {
		if (this.get('built') == this.get('max_build')) return;
		if (!this.get('took')) return;
		var player_is = player.get('is_robot') ? 'robot' : 'me';
		var chosen_card = deck.get('content').objectAt(n);
		var player_districts = player.get('districts');
		if (chosen_card.get('cost') > player.get('coins'))
		{
			game.showError("You don't have enough coins to build this district");
			return;
		}
		
		if (player_districts.filterBy('name', chosen_card.get('name')).length > 0)
		{
			game.showError("You can't build dublicate district");
			return;
		}
				
		if (chosen_card.get('status') == 'in_hand' && chosen_card.get('player') == player_is)
		{
			chosen_card.set('status','built');			
			player_districts.pushObject(chosen_card);

			player.set('coins',player.get('coins')-chosen_card.get('cost')); 
			this.set('built',this.get('built')+1);
			player.set('cards_count', player.get('cards_count')-1);
		}
	},
	resetParams : function() {
		this.set('player', false);
		this.set('took', false);
		this.set('built', 0);
		this.set('state','normal');
		this.set('status','in_round');
	},
	inRound : function() {
		return this.get('status') == 'in_round';
	}.property('status'),
	inMyHand : function() {
		return this.get('player') == 'me';
	}.property('player'),
	inRobotHand : function() {
		return this.get('player') == 'robot';
	}.property('player'),
	isAssasin : function() {
		return this.get('name') == 'Assasin';
	}.property('name'),
	isThief : function() {
		return this.get('name') == 'Thief';
	}.property('name'),
	isMagician : function() {
		return this.get('name') == 'Magician';
	}.property('name'),
	isWarlord : function() {
		return this.get('name') == 'Warlord';
	}.property('name'),
	isColor : function() {
		return this.get('name') == 'King' ||
			   this.get('name') == 'Bishop' ||
			   this.get('name') == 'Merchant' ||
			   this.get('name') == 'Warlord';
	}.property('name'),
	isAssasinated : function() {
		return this.get('state') == 'assasinated';
	}.property('state'),
	isRobbed : function() {
		return this.get('state') == 'robbed';
	}.property('state')
});

App.Assasin = App.Character.extend({
	name : "Assasin",
	number : 1,
	pic: "character1.jpg",
	assasinated: false,
	assasinate : function(game, n) {
		if (this.get('assasinated')) return;
		if (n==1) return;
		game.get('characters').get('content').findBy('number', n).set('state','assasinated');
		this.set('assasinated', true);
	},
	resetParams : function() {
		this._super();
		this.set('assasinated', false);
	}
}
);

App.Thief = App.Character.extend({
	name: "Thief",
	pic: "character2.jpg",
	number: 2,
	robbed: false,
	rob : function(game,n) {
		if (this.get('robbed')) return;
		if (n==1 || n==2) return;

		var character = game.get('characters').get('content').findBy('number', n);
		if (character.get('state') == 'assasinated') return;
		game.get('characters').get('content').findBy('number', n).set('state','robbed');
		this.set('robbed', true);
	},
	resetParams : function() {
		this._super();
		this.set('robbed', false);
	}
});

App.Magician = App.Character.extend({
	name: "Magician",
	pic: "character3.jpg",
	number: 3,
	did_magic: false,
	exchange_cards : function(player1, player2, deck) {
		if (this.get('did_magic')) return false;
		var deck_length = deck.get('content').length;
		for (var j=0; j<deck_length; j++)
			if (deck.get('content').objectAt(j).get('status') == 'in_hand')
			{
				var card_player = deck.get('content').objectAt(j).get('player');
				if (card_player == 'me')
				{
					deck.get('content').objectAt(j).set('player', 'robot');
				}
				else
				{	console.log('me');
					deck.get('content').objectAt(j).set('player', 'me');
				}
				 
			}
			
		var temp = player1.get('cards_count');
		player1.set('cards_count',player2.get('cards_count'));
		player2.set('cards_count',temp);
		this.set('did_magic', true);	
	},
	resetParams : function() {
		this._super();
		this.set('did_magic', false);
	}
});

App.ColourCharacter = App.Character.extend({
	color: "",
	took_income : false,
	takeIncome : function(player, deck)
	{
		if (this.get('took_income')) return;
		var deck_length = deck.get('content').length;
		var current_player = player.get('is_robot') ? 'robot' : 'me';
		for (var j=0; j<deck_length; j++)
		{
			var district = deck.get('content').objectAt(j);
		
			if (district.get('status') == 'built' 
			&& district.get('player') == current_player
			&& district.get('color') == this.get('color')) 
				player.set('coins', player.get('coins') + 1);
		}
		this.set('took_income', true);
	},
	resetParams : function() {
		this._super();
		this.set('took_income', false);
	}
});

App.King = App.ColourCharacter.extend({
	name: "King",
	number: 4,
	color: "yellow",
	pic: "character4.jpg",
});

App.Bishop = App.ColourCharacter.extend({
	name: "Bishop",
	number: 5,
	color: "blue",
	pic: "character5.jpg"
});

App.Merchant = App.ColourCharacter.extend({
	name: "Merchant",
	number: 6,
	color: "green",
	pic: "character6.jpg",
	takeCoins: function(player, deck)
	{
		if (this.get('took')) return;
		this._super(player, deck);
		player.set('coins',player.get('coins')+1);
	},
	takeCard(player,deck, n) {
		this._super(player,deck, n);
		player.set('coins',player.get('coins')+1);
	}
});

App.Architect = App.Character.extend({
	name: "Architect",
	number: 7,
	pic: "character7.jpg",
	max_build : 3,
	takeCoins: function(player,deck)
	{
		if (this.get('took')) return;
		this._super(player, deck);
		this.take2Cards(player,deck);
	},
	takeCard(player,deck, n) {
		this._super(player,deck, n);
		this.take2Cards(player,deck);
	},
	take2Cards(player, deck) {
		var n, deck_length = deck.get('content').length,
		draw, current_player = player.get('is_robot') ? 'robot' : 'me';
		var player_cards = player.get('cards_count');
		for (var j=0; j<2; j++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (deck.get('content').objectAt(n).get('status') == 'in_deck')
				{
					deck.get('content').objectAt(n).set('status', 'in_hand');
					deck.get('content').objectAt(n).set('player', current_player);
					draw = true;
					player_cards++;
				}
			}
			
		}
		player.set('cards_count',player_cards);	
	}
});

App.Warlord = App.ColourCharacter.extend({
	name: "Warlord",
	number: 8,
	pic: "character8.jpg",
	color: "red",
	destroyed : false,
	destroy : function(game, player_from, player_to, district) {
		if (this.get('destroyed')) return;
		
		if (player_to.get('closed')) 
		{
			game.showError("You can't destroy district in the city with 8 or more districts"); 
			return;
		}
		
		var player_to_type = player_to.get('is_robot') ? 'robot' : 'me';
		var bishop = game.get('characters').get('content').findBy('name','Bishop');
		
		if (bishop && bishop.get('state')=='normal' && bishop.get('player') == player_to_type)
		{
			game.showError("You can't destroy Bishop's district"); 
			return;
		}
		
		if (district.get('cost') - 	1 > player_from.get('coins'))
		{
			game.showError("You have not enough coins to destroy this district"); 
			return;
		}
		
		if (district.get('status') == 'built' && district.get('player') == player_to_type)
		{
			district.set('status','destroyed');
			district.set('player',false);
			player_to.get('districts').removeObject(district);
			player_from.set('coins',player_from.get('coins')-district.get('cost')+1);
			this.set('destroyed',true);
		}
	},
	resetParams : function() {
		this._super();
		this.set('destroyed', false);
	}
});

App.Characters = Ember.Object.extend({
	content : [],
	init() {
		var characters = [];
		characters.push(App.Assasin.create());
		characters.push(App.Thief.create());
		characters.push(App.Magician.create());
		characters.push(App.King.create());
		characters.push(App.Bishop.create());
		characters.push(App.Merchant.create());
		characters.push(App.Architect.create());
		characters.push(App.Warlord.create());
		this.set('content', characters);
	},
	inMyHand : function() {
		return this.get('content').filterBy('status','in_hand');
	}.property('content'),
	inRobotHand : function() {
		return this.get('content').filterBy('status','in_hand');
	}.property('content')
});


App.Player = Ember.Object.extend({
	is_robot: false,
	has_crown : false,
	name : null,
	cards_count : 0,
	cards_on_choose : false,
	closed : false,
	closed_first : false,
	districts : [],
	coins : 2,
	character : null,
	characters : [],
	score : Ember.computed('districts.[]', 'closed', 'closed_first', function() {
    	var ret = 0;
		var colors = [];
		this.get('districts').forEach(function(item) {
			ret += item.get('cost');
			colors.push(item.get('color'));
		});
		
		if (colors.uniq().length == 4) ret += 2;
		if (this.get('closed')) ret += 2;
		if (this.get('closed_first')) ret += 2;
		
		return ret;
  	}),
	takeCharacter : function(characters, n) {
		var choosed_character = characters.get('content').findBy('number', n);
		if (choosed_character.get('status') == 'in_round')
		{
			var player_characters = this.get('characters');
			player_characters.push(n);
			this.set('characters',player_characters);
			choosed_character.set('status', 'in_hand');
			choosed_character.set('player', this.get('is_robot') ? 'robot' : 'me');
		}
	},
	discardCharacter : function(characters, n) {
		var choosed_character = characters.get('content').findBy('number', n);
		if (choosed_character.get('status') == 'in_round')
		{
			choosed_character.set('status', 'discarded');
		}
	}
});

App.Game = Ember.Object.extend({
	
	name: "new game",
	player1 : null,
	player2: null,
	activePlayer : null,
	activeCharacter : null,
	deck : null,
	characters : null,
	currentCharacter : null,
	first_full_city : false,
	winner : "",
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
	phaze : null, //choose, action
	
	start : function(name, player1, player2) {
			this.set('player1', player1);
			this.set('player2', player2);
			this.set('name',name);
			this.setFirstPlayer();
			this.get('activePlayer').set('has_crown',true);
			this.set('phaze','choose');
			//console.log(JSON.stringify(this.get('deck')));
	},
	showError : function(text) {
		alert(text);
	},
	togglePlayers : function() {
		var self = this;
		var flag = true;
		setInterval(function() {self.set('activePlayer', flag ? self.get('player1') : self.get('player2')); 
			flag = !flag; }, 3000);
			
	},
	init() {
		var deck = App.Deck.create(); 
		this.set('deck',deck);
		var characters = App.Characters.create();
		this.set('characters', characters);
	},
	drawCards : function()
	{
		var n, deck_length = this.get('deck').get('content').length,
		draw, player1_cards = this.get('player1').get('cards_count'), player2_cards = this.get('player2').get('cards_count');
		for (var j=0; j<4; j++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (this.get('deck').get('content').objectAt(n).get('status') == 'in_deck')
				{
					this.get('deck').get('content').objectAt(n).set('status', 'in_hand');
					this.get('deck').get('content').objectAt(n).set('player', 'me');
					player1_cards++;
					draw = true;
				}
			}
			
		}
		
		for (var j=0; j<4; j++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (this.get('deck').get('content').objectAt(n).get('status') == 'in_deck')
				{
					this.get('deck').get('content').objectAt(n).set('status', 'in_hand');
					this.get('deck').get('content').objectAt(n).set('player', 'robot');
					player2_cards++;
					draw = true;
				}
			}
			
		}

		this.get('player1').set('cards_count',player1_cards);
		this.get('player2').set('cards_count',player2_cards);		
	},
	myCardsCount : function() {
		return this.get('deck').get('myCardsCount');
	}.property('deck'),
	youActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player1');
	}.property('activePlayer'),
	robotActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player2');
	}.property('activePlayer'),
	phazeIsChoose : true,
	phazeIsDiscard : false,
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
		this.set('phazeIsDiscard', false);
		this.set('phazeIsChoose', false);
		switch (characters_rest)
		{
			case 6: 
			case 4: 
			case 2:
				this.set('activePlayer', owner == 'robot' ? this.get('player1') : this.get('player2')); 
				this.set('phazeIsChoose', true);
				break;
								
			case 5:
			case 3: 
				this.set('phazeIsDiscard', true);
				break;
								
			case 1: 
				this.get('characters').get('content').findBy('status','in_round').set('status', 'discarded');
				this.set('phaze', 'action'); 
				this.nextCharacter();
				break;
		}
	},
	checkPlayerClosed : function(player) {
		if (player.get('closed')) return;
		
		if (player.get('districts').length >= 8)
		{
			player.set('closed', true);
			if (!this.get('first_full_city'))
			{
				this.set('first_full_city', true);
				player.set('closed_first', true);
			}
		}
	},
	nextCharacter : function() {
		
		this.checkPlayerClosed(this.get('activePlayer'));
		
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
				this.set('phazeIsChoose', true);
				this.set('phazeIsDiscard', false);
				this.set('currentCharacter', null);
				this.set('activePlayer', this.get('player1').get('has_crown') ? this.get('player1') : this.get('player2'));
			}
			return;	
		}
		
		n = n+1;
		this.set('currentCharacter', this.get('characters').get('content').findBy('number', n));

		character = this.get('currentCharacter');
		if (character.get('status') == 'discarded') {
			this.nextCharacter(); return;
		}
		
		var character_owner = character.get('player');

		if (n == 4) {
			this.get('player1').set('has_crown', character_owner == 'me' ? true : false);
			this.get('player2').set('has_crown', character_owner == 'robot' ? true : false);
		}
		
		if (character.get('state') == 'assasinated') { this.nextCharacter(); return; }
		if (character.get('state') == 'robbed')
		{
			var thief = this.get('characters').get('content').findBy('name','Thief');
			if (character_owner == 'me' && thief.get('player') == 'robot')
				this.stealCoins(this.get('player1'),this.get('player2'));
			if (character_owner == 'robot' && thief.get('player') == 'me')
				this.stealCoins(this.get('player2'),this.get('player1'));
		}
			
		if (character_owner == 'me') this.set('activePlayer', this.get('player1'));
		if (character_owner == 'robot') this.set('activePlayer', this.get('player2'));
		this.get('activePlayer').set('character', n);
	},
	stealCoins : function(player_from, player_to)
	{
		player_to.set('coins',player_to.get('coins')+player_from.get('coins'));
		player_from.set('coins',0);
	},
	resetCharacters : function() {

		var characters = this.get('characters').get('content');
		
		for (var j=0; j<characters.length; j++)
		{
			characters.objectAt(j).resetParams();
		}
		
		this.get('player1').set('characters', []);
		this.get('player2').set('characters', []);
		this.get('player1').set('character', 0);
		this.get('player2').set('character', 0);
		
		var d = Math.floor(Math.random() * characters.length);
		characters.objectAt(d).set('status', 'discarded');
	}
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
    console.log('model');
    var player1 = App.Player.create({ name :  'Chi', districts : []});
    var player2 = App.Player.create({ name :  'Robot', is_robot : true, districts : []});
    
    var game = App.Game.create();
    game.start('New Game', player1, player2);

    game.drawCards();
	game.resetCharacters();
	this.set('game',game);
    return game;
  },
  game : null,
  actions : {
		takeCharacter : function(character) {
			
			if (character.get('status') == 'in_round')
			{
				var game = this.get('game');
				var player_characters = game.get('activePlayer').get('characters');
				player_characters.push(character.get('number'));
				game.get('activePlayer').set('characters', player_characters);
				character.set('status','in_hand');
				var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
				character.set('player', owner);
				game.changePhaze();
			}
		},
		discardCharacter : function(character) {
			if (character.get('status') == 'in_round')
			{
				var game = this.get('game');
				character.set('status','discarded');
				game.changePhaze();
			}
		},
		takeCoins : function() {
			var game = this.get('game');
			var player = game.get('activePlayer');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var deck = game.get('deck');
			var character = game.get('currentCharacter');
			
			if (character.get('player') == owner) character.takeCoins(player,deck);
		},
		chooseCards : function() {
			var game = this.get('game');
			var player = game.get('activePlayer');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var deck = game.get('deck');
			var character = game.get('currentCharacter');
			
			if (character.get('player') == owner) 
			{
				character.chooseCard(player,deck);
			}
		},
		drawCards : function() {
			this.get('game').drawCards();
			console.dir(this.get('game').get('deck').get('content').filterBy('status','in_hand').filterBy('player','me'));
		},
		takeCard : function(n) {
			var game = this.get('game');
			var player = game.get('activePlayer');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var deck = game.get('deck');
			var character = game.get('currentCharacter');
			
			if (character.get('player') == owner) 
			{
				character.takeCard(player,deck,n);
			}
		},
		build : function(n) {
			var game = this.get('game');
			var player = game.get('activePlayer');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var deck = game.get('deck');
			var character = game.get('currentCharacter');
			
			if (character.get('player') == owner) 
			{
				character.build(game,player,deck,n);
			}
		},
		endTurn : function() {
			this.get('game').nextCharacter();
		},
		assasinateCharacter : function(character)
		{
			var game = this.get('game');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var current_character = game.get('currentCharacter');
			
			if (current_character.get('player') == owner && current_character.get('name') == "Assasin") 
			{
				current_character.assasinate(game, character.get('number'));
			}
		},
		robCharacter : function(character)
		{
			var game = this.get('game');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var current_character = game.get('currentCharacter');
			
			if (current_character.get('player') == owner && current_character.get('name') == "Thief") 
			{
				current_character.rob(game, character.get('number'));
			}
		},
		doMagic : function()
		{
			var game = this.get('game');
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var current_character = game.get('currentCharacter');
			var deck = game.get('deck');
			
			if (current_character.get('player') == owner && current_character.get('name') == "Magician") 
			{
				current_character.exchange_cards(game.get('player1'), game.get('player2'), deck);
			}
		},
		takeIncome : function()
		{
			var game = this.get('game');
			var player = game.get('activePlayer');
			var owner = player.get('is_robot') ? 'robot' : 'me';
			var current_character = game.get('currentCharacter');
			var deck = game.get('deck');
			
			if (current_character.get('player') == owner && current_character.isColor) 
			{
				current_character.takeIncome(player, deck);
			}
		},
		destroy : function(district) {
			
			var game = this.get('game');
			var player_from = game.get('activePlayer').get('is_robot') ? game.get('player2') : game.get('player1');
			var player_to = game.get('activePlayer').get('is_robot') ? game.get('player1') : game.get('player2');
			
			var owner = game.get('activePlayer').get('is_robot') ? 'robot' : 'me';
			var current_character = game.get('currentCharacter');
			
			if (current_character.get('player') == owner && current_character.isWarlord) 
			{
				current_character.destroy(game, player_from, player_to, district);
			}
		
		}	
  }
});

