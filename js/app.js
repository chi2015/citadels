
App = Ember.Application.create();

App.Card = Ember.Object.extend({
	player : false,
	isChecked : false,
	init() {
		this.set('status','in_deck');  //in_deck, on_choice, in_hand, built, destroyed, in_lab, on_graveyard
	},
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
		for (i=0; i<2; i++) 
			cards.push(App.Card.create({"name":"keep","color":"purple","pic":"keep.jpg","cost":3}));
			
		cards.push(App.Card.create({"name":"city","color":false,"pic":"city.jpg","cost":2}));
		cards.push(App.Card.create({"name":"observatory","color":"purple","pic":"observatory.jpg","cost":5}));
		cards.push(App.Card.create({"name":"lab","color":"purple","pic":"lab.jpg","cost":5}));
		cards.push(App.Card.create({"name":"workshop","color":"purple","pic":"workshop.jpg","cost":5}));
		cards.push(App.Card.create({"name":"library","color":"purple","pic":"library.jpg","cost":6}));
		cards.push(App.Card.create({"name":"school","color":"purple","pic":"school.jpg","cost":6}));
		cards.push(App.Card.create({"name":"greatwall","color":"purple","pic":"greatwall.jpg","cost":6}));
		cards.push(App.Card.create({"name":"dragongate","color":"purple","pic":"dragongate.jpg","cost":6}));
		cards.push(App.Card.create({"name":"university","color":"purple","pic":"university.jpg","cost":6}));
		cards.push(App.Card.create({"name":"graveyard","color":"purple","pic":"graveyard.jpg","cost":5}));
		
		this.set('content',cards);
	},
	cards_on_choose : Ember.computed('content.@each.status', function() {
		return this.get('content').filterBy('status','on_choice').length > 0;
	}),
	card_on_graveyard : Ember.computed('content.@each.status', function() {
		return this.get('content').findBy('status','on_graveyard');
	})
});

App.Character = Ember.Object.extend({
	player : false,
	took : false,
	built : 0,
    max_build : 1,
    can_build : function() {
		return this.get('built') < this.get('max_build');
	}.property('built'),
	used_workshop : false,
	used_lab : false,
    pic : "",
	init() {
		this.set('status','in_round'); //in_round, in_hand, discarded
	},
	state : 'normal', //assasinated, robbed
	takeCoins : function(game) {
		if (this.get('took')) return;
		this.get('player').set('coins', this.get('player').get('coins') + 2);
		this.set('took', true);
	},
	chooseCard : function(game) {
		if (this.get('took')) return;
		var n, chosen;
		var deck_content = game.get('deck').get('content');
		var deck_length = deck_content.length;
		
		var cards_to_choose = this.get('player').get('hasObservatory') ? 3 : 2;
		
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
					card.set('player', this.get('player'));
					if (this.get('player').get('hasLibrary')) this.takeCard(game, card);
					chosen = true;
				}
			}
		}
		this.set('took', true);
	},
	takeCard : function(game, card)
	{
		if (card.get('status') == 'on_choice' && card.get('player') === this.get('player'))
			card.set('status','in_hand');
			
		game.get('deck').get('content').filterBy('status','on_choice').forEach(function(card) {
			card.set('status','in_deck');
			card.set('player',false);
		});
		this.get('player').get('cards').pushObject(card);		
	},
	
	build : function(game, card) {
		if (this.get('built') == this.get('max_build')) return;
		if (!this.get('took')) return;
		if (card.get('status') != 'in_hand') return;
		if (card.get('player')!== this.get('player')) return;
		
		if (card.get('cost') > this.get('player').get('coins'))
		{
			game.showError("You don't have enough coins to build this district");
			return;
		}
		
		if (this.get('player').get('districts').filterBy('name', card.get('name')).length > 0)
		{
			game.showError("You can't build dublicate district");
			return;
		}
				
		card.set('status','built');			
		this.get('player').get('districts').pushObject(card);
		this.get('player').set('coins', this.get('player').get('coins')-card.get('cost')); 
		this.set('built',this.get('built')+1);
		this.get('player').get('cards').removeObject(card);
	},
	useWorkshop : function(game) {
		if (!this.get('player').get('hasWorkshop')) return;
		if (this.get('used_workshop')) return;
		
		if (this.get('player').get('coins') < 2)
		{
			game.showError("Not enough coins");
			return;
		}
		this.get('player').set('coins', this.get('player').get('coins')-2);
		
		var n, draw, card;
		var deck_content = game.get('deck').get('content');
		var deck_length = deck_content.length;
		
		for (var j=0; j<3; j++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (deck_content.objectAt(n).get('status') == 'in_deck')
				{
					card = deck_content.objectAt(n);
					card.set('status', 'in_hand');
					card.set('player', this.get('player'));
					this.get('player').get('cards').pushObject(card);
					draw = true;
				}
			}
		}
		
		this.set('used_workshop', true);
	},
	useLab : function(card) {
		if (!this.get('player').get('hasLab')) return;
		if (this.get('used_lab')) return;
		
		if (card.get('status') == 'in_hand' && card.get('player') === this.get('player'))
		{
			card.set('status', 'in_lab');
			card.set('player', false);
			this.get('player').get('cards').removeObject(card);
			this.get('player').set('coins', this.get('player').get('coins') + 1);
			this.set('used_lab', true);
		}
	},
	resetParams : function() {
		this.set('player', false);
		this.set('took', false);
		this.set('built', 0);
		this.set('state','normal');
		this.set('status','in_round');
		this.set('used_workshop', false);
		this.set('used_lab', false);
	},
	inRound : function() {
		return this.get('status') == 'in_round';
	}.property('status'),
	isAssasinated : function() {
		return this.get('state') == 'assasinated';
	}.property('state'),
	isRobbed : function() {
		return this.get('state') == 'robbed';
	}.property('state')
});

App.Assasin = App.Character.extend({
	name : "Assasin",
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
	}
}
);

App.Thief = App.Character.extend({
	name: "Thief",
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
	}
});

App.Magician = App.Character.extend({
	name: "Magician",
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
				card.set('player',this.get('player'));
				this.get('player').get('cards').pushObject(card);
				player.get('cards').removeObject(card);
			}
			else if (card.get('player') === this.get('player')) 
			{
				card.set('player',player);
				player.get('cards').pushObject(card);
				this.get('player').get('cards').removeObject(card);
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
		for (var i=0; i<checked_cards.length; i++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_content.length);
				
				if (deck_content.objectAt(n).get('status') == 'in_deck')
				{
					card = deck_content.objectAt(n);
					card.set('status', 'in_hand');
					card.set('player', this.get('player'));
					this.get('player').get('cards').pushObject(card);
					draw = true;
				}
			}
		}
		
		var that = this;
		checked_cards.forEach(function(item) {
			item.set('isChecked', false);
			item.set('status', 'in_deck');
			item.set('player', false);
			that.get('player').get('cards').removeObject(item);
		});
		
		this.set('choosed_to_discard', false);
		this.set('discarded', true);	
	},
	resetParams : function() {
		this._super();
		this.set('did_magic', false);
		this.set('discarded', false);
	}
});

App.ColourCharacter = App.Character.extend({
	color: "",
	isColor: true,
	took_income : false,
	takeIncome : function()
	{
		if (this.get('took_income')) return;
		var player_districts = this.get('player').get('districts');
		for (var j=0; j<player_districts.length; j++)
			if (player_districts.objectAt(j).get('color') == this.get('color'))
				this.get('player').set('coins', this.get('player').get('coins') + 1);
		this.get('player').set('coins', this.get('player').get('coins') + this.get('player').get('hasSchool'));
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
	takeCoins: function(game)
	{
		if (this.get('took')) return;
		this._super(game);
		this.get('player').set('coins', this.get('player').get('coins')+1);
	},
	takeCard(game, card) {
		this._super(game, card);
		this.get('player').set('coins', this.get('player').get('coins')+1);
	}
});

App.Architect = App.Character.extend({
	name: "Architect",
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
	take2Cards(game, deck) {
		var n, draw, card;
		var deck_content = game.get('deck').get('content');
		var deck_length = deck_content.length;
		
		for (var j=0; j<2; j++)
		{
			draw = false;
			while (!draw)
			{
				n = Math.floor(Math.random() * deck_length);
				
				if (deck_content.objectAt(n).get('status') == 'in_deck')
				{
					card = deck_content.objectAt(n);
					card.set('status', 'in_hand');
					card.set('player', this.get('player'));
					this.get('player').get('cards').pushObject(card);
					draw = true;
				}
			}
		}
	}
});

App.Warlord = App.ColourCharacter.extend({
	name: "Warlord",
	isWarlord: true,
	number: 8,
	pic: "character8.jpg",
	color: "red",
	destroyed : false,
	destroy : function(game, player_to, district) {
		if (this.get('destroyed')) return;
		
		if (player_to.get('closed')) 
		{
			game.showError("You can't destroy district in the city with 8 or more districts"); 
			return;
		}
		
		if (district.get('name') == 'keep')
		{
			game.showError("Keep can not be destroyed"); 
			return;
		}
		
		var bishop = game.get('characters').get('content').findBy('name','Bishop');
		if (bishop && bishop.get('state')=='normal' && bishop.get('player') === player_to)
		{
			game.showError("You can't destroy Bishop's district"); 
			return;
		}
		
		if (district.get('cost') + player_to.get('hasGreatwall') - 1 > this.get('player').get('coins'))
		{
			game.showError("You have not enough coins to destroy this district"); 
			return;
		}
		
		if (district.get('status') == 'built' && district.get('player') === player_to)
		{
			this.get('player').set('coins',this.get('player').get('coins')-district.get('cost')-player_to.get('hasGreatwall')+1);
			player_to.get('districts').removeObject(district);
			district.set('status', player_to.get('hasGraveyard') && player_to.get('coins') ? 'on_graveyard' : 'destroyed');
			district.set('player', false);
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
	}
});


App.Player = Ember.Object.extend({
	is_robot: false,
	has_crown : false,
	name : null,
	cards : [],
	closed : Ember.computed('districts.length', function() {
		return this.get('districts').length >= 8;
	}),
	closed_first : false,
	count_city : true,
	districts : [],
	coins : 2,
	characters : [],
	score : Ember.computed('districts.[]', 'hasDragongate', 'hasUniversity', 'closed', 'closed_first', function() {
    	var ret = 0;
		var colors = [];
		this.get('districts').forEach(function(item) {
			ret += item.get('cost');
			if (item.get('color')) colors.push(item.get('color'));
		});
		
		if (this.get('hasDragongate')) ret += 2;
		if (this.get('hasUniversity')) ret += 2;
		if (colors.uniq().length + this.get('hasCity') >= 5) ret += 3;
		if (this.get('closed')) ret += 2;
		if (this.get('closed_first')) ret += 2;
		
		return ret;
  	}),
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
	phaze : null, //choose, action,  end
	
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
	init() {
		var deck = App.Deck.create(); 
		this.set('deck',deck);
		var characters = App.Characters.create();
		this.set('characters', characters);
	},
	drawCards : function(player)
	{
		var n;
		var deck_content = this.get('deck').get('content');
		var deck_length = deck_content.length;
		var draw;
		var card;

		for (var j=0; j<4; j++)
		{
			draw = false;
			while (!draw)
			{
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
		}
	},
	youActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player1');
	}.property('activePlayer'),
	robotActivePlayer : function() {
  		return this.get('activePlayer') === this.get('player2');
	}.property('activePlayer'),
	phazeIsChoose : true,
	phazeIsDiscard : false,
	toggleActivePlayer : function() {
		if (this.get('activePlayer') === this.get('player1')) this.set('activePlayer', this.get('player2'));
		else if (this.get('activePlayer') === this.get('player2')) this.set('activePlayer', this.get('player1'));
	},
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
				this.toggleActivePlayer(); 
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
	checkFirstClosed : function(player) {
		if (this.get('first_full_city')) return;
		if (player.get('closed')) {
			this.set('first_full_city', true);
			player.set('closed_first', true);
		}
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
				this.set('phazeIsChoose', true);
				this.set('phazeIsDiscard', false);
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
		if (character.get('status') == 'discarded') {
			this.nextCharacter(); return;
		}
		
		var character_owner = character.get('player');

		if (n == 4) {
			this.get('player1').set('has_crown', character.get('player') === this.get('player1'));
			this.get('player2').set('has_crown', character.get('player') === this.get('player2'));
		}
		
		if (character.get('state') == 'assasinated') { this.nextCharacter(); return; }
		if (character.get('state') == 'robbed')
		{
			var thief = this.get('characters').get('content').findBy('name','Thief');
			this.stealCoins(character.get('player'), thief.get('player'));
		}
		
		this.set('activePlayer',character.get('player'));
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
		
		var d = Math.floor(Math.random() * characters.length);
		characters.objectAt(d).set('status', 'discarded');
	}
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		var player1 = App.Player.create({ name :  'Chi', districts : [], characters : [], cards : []});
		var player2 = App.Player.create({ name :  'Robot', is_robot : true, districts : [], characters : [], cards : []});
		var game = App.Game.create();
		game.start('New Game', player1, player2);
		game.drawCards(player1);
		game.drawCards(player2);
		game.resetCharacters();
		this.set('game',game);
		return game;
  },
  game : null,
  actions : {
		takeCharacter : function(character) {
			var game = this.get('game');
			game.get('activePlayer').takeCharacter(character);
			game.changePhaze();
		},
		discardCharacter : function(character) {
			var game = this.get('game');
			game.get('activePlayer').discardCharacter(character);
			game.changePhaze();
		},
		takeCoins : function() {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.takeCoins(game);
		},
		chooseCards : function() {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.chooseCard(game);
		},
		takeCard : function(card) {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.takeCard(game, card);
		},
		build : function(card) {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			if (character.get('choosed_to_discard')) return;
			if (character) character.build(game, card);
		},
		endTurn : function() {
			this.get('game').nextCharacter();
		},
		assasinateCharacter : function(character)
		{
			var game = this.get('game');
			this.get('game').get('currentCharacter').assasinate(character);
		},
		robCharacter : function(character)
		{
			var game = this.get('game');
			this.get('game').get('currentCharacter').rob(character);
		},
		exchangeCards : function()
		{
			var game = this.get('game');
			var character = game.get('currentCharacter');
			var player = game.get('activePlayer') === game.get('player2') ? game.get('player1') : game.get('player2');
			character.exchange_cards(game, player);
		},
		chooseToDiscard : function()
		{
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.chooseToDiscard();
		},
		discardCards : function() {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.discardCards(game);
		},
		takeIncome : function()
		{
			this.get('game').get('currentCharacter').takeIncome();
		},
		destroy : function(district) {
			var game = this.get('game');
			var player_to = game.get('activePlayer') === game.get('player2') ? game.get('player1') : game.get('player2');
			var character = game.get('currentCharacter');
			if (character && character.get('isWarlord')) character.destroy(game, player_to, district);
		},
		useWorkshop : function() {
			var game = this.get('game');
			var character = game.get('currentCharacter');
			character.useWorkshop(game);
		},
		toLab : function(card) {
			var character = this.get('game').get('currentCharacter');
			character.useLab(card);
		},
		yesGraveyard : function() {
			var game = this.get('game');
			var player_to = game.get('activePlayer') === game.get('player2') ? game.get('player1') : game.get('player2');
			player_to.useGraveyard(game, true);
		},
		noGraveyard : function() {
			var game = this.get('game');
			var player_to = game.get('activePlayer') === game.get('player2') ? game.get('player1') : game.get('player2');
			player_to.useGraveyard(game, false);
		}	
  }
});

