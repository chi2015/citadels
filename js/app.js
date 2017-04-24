
App = Ember.Application.create();

App.Card = Ember.Object.extend({
	player : false,
	isChecked : false,
	status : 'in_deck', //in_deck, on_choice, in_hand, built, destroyed, in_lab, on_graveyard
	onChoose : function() {
		return this.get('status') == 'on_choice';
	}.property('status'),
	serialize : function() {
		return {
			"name" : this.get('name'),
			"color" : this.get('color'),
			"pic" : this.get('pic'),
			"cost" : this.get('cost'),
			"status" : this.get('status'),
			"player" : this.get('player') ? this.get('player').get('name') : false
		};
	}
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
			
		for (i=0; i<5; i++) 
			deck_content.pushObject(App.Card.create({"name":"domain","color":"yellow","pic":"domain.jpg","cost":3}));
		for (i=0; i<5; i++) 
			deck_content.pushObject(App.Card.create({"name":"castle","color":"yellow","pic":"castle.jpg","cost":4}));
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"palace","color":"yellow","pic":"palace.jpg","cost":5}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"temple","color":"blue","pic":"temple.jpg","cost":1}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"church","color":"blue","pic":"church.jpg","cost":2}));
		for (i=0; i<4; i++) 
			deck_content.pushObject(App.Card.create({"name":"monastery","color":"blue","pic":"monastery.jpg","cost":3}))
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"cathedral","color":"blue","pic":"cathedral.jpg","cost":5}));
		for (i=0; i<5; i++) 
			deck_content.pushObject(App.Card.create({"name":"tavern","color":"green","pic":"tavern.jpg","cost":1}));
		for (i=0; i<4; i++) 
			deck_content.pushObject(App.Card.create({"name":"store","color":"green","pic":"store.jpg","cost":2}));	
		for (i=0; i<4; i++) 
			deck_content.pushObject(App.Card.create({"name":"market","color":"green","pic":"market.jpg","cost":2}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"warehouse","color":"green","pic":"warehouse.jpg","cost":3}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"harbour","color":"green","pic":"harbour.jpg","cost":4}));	
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"townhall","color":"green","pic":"townhall.jpg","cost":5}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"watchtower","color":"red","pic":"watchtower.jpg","cost":1}));	
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"prison","color":"red","pic":"prison.jpg","cost":2}));
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"barracks","color":"red","pic":"barracks.jpg","cost":3}));	
		for (i=0; i<3; i++) 
			deck_content.pushObject(App.Card.create({"name":"fortress","color":"red","pic":"fortress.jpg","cost":5}));
		for (i=0; i<2; i++) 
			deck_content.pushObject(App.Card.create({"name":"keep","color":"purple","pic":"keep.jpg","cost":3}));
			
		deck_content.pushObject(App.Card.create({"name":"city","color":false,"pic":"city.jpg","cost":2}));
		deck_content.pushObject(App.Card.create({"name":"observatory","color":"purple","pic":"observatory.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"lab","color":"purple","pic":"lab.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"workshop","color":"purple","pic":"workshop.jpg","cost":5}));
		deck_content.pushObject(App.Card.create({"name":"library","color":"purple","pic":"library.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"school","color":"purple","pic":"school.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"greatwall","color":"purple","pic":"greatwall.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"dragongate","color":"purple","pic":"dragongate.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"university","color":"purple","pic":"university.jpg","cost":6}));
		deck_content.pushObject(App.Card.create({"name":"graveyard","color":"purple","pic":"graveyard.jpg","cost":5}));
	
		}
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
	handle_player: false,
	took : false,
	built : 0,
    max_build : 1,
    can_build : function() {
		return this.get('built') < this.get('max_build');
	}.property('built'),
	used_workshop : false,
	used_lab : false,
	status : 'in_round', //in_round, in_hand, discarded
    pic : "",
	state : 'normal', //assasinated, robbed
	reveal : function(game) {
	   if (this.get('state') == 'assasinated' || this.get('status') == 'discarded') 
	   {
		   this.endTurn(game);
		   return;
	   }
	   
	   if (this.get('state') == 'robbed')
	   {
		   var thief_owner = game.get('characters').get('content').findBy('name', 'Thief').get('player');
		   var coins = this.get('player').get('coins');
		   this.get('player').set('coins', 0);
		   thief_owner.set('coins', thief_owner.get('coins') + coins);
	   }
	   
	   this.set('handle_player', this.get('player'));
	   game.set('activePlayer', this.get('handle_player'));
	},
	takeCoins : function(game) {
		if (this.get('took')) return;
		this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 2);
		this.set('took', true);
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
	},
	
	build : function(game, card) {
		if (this.get('built') == this.get('max_build')) return;
		if (!this.get('took')) return;
		if (card.get('status') != 'in_hand') return;
		if (card.get('player')!== this.get('handle_player')) return;
		
		if (card.get('cost') > this.get('handle_player').get('coins'))
		{
			game.showError("You don't have enough coins to build this district");
			return;
		}
		
		if (this.get('handle_player').get('districts').filterBy('name', card.get('name')).length > 0)
		{
			game.showError("You can't build dublicate district");
			return;
		}
				
		card.set('status','built');			
		this.get('handle_player').get('districts').pushObject(card);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')-card.get('cost')); 
		this.set('built',this.get('built')+1);
		this.get('handle_player').get('cards').removeObject(card);
	},
	endTurn : function(game) {
		game.nextCharacter();
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
		
		if (card.get('status') == 'in_hand' && card.get('player') === this.get('handle_player'))
		{
			card.set('status', 'in_lab');
			card.set('player', false);
			this.get('handle_player').get('cards').removeObject(card);
			this.get('handle_player').set('coins', this.get('handle_player').get('coins') + 1);
			this.set('used_lab', true);
		}
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
	serialize : function() {
		return {
			"player" : this.get('player') ? this.get('player').get('name') : false,
			"handle_player" : this.get('handle_player') ? this.get('handle_player').get('name') : false,
			"took" : this.get('took'),
			"built" : this.get('built'),
			"used_workshop" : this.get('used_workshop'),
			"used_lab" : this.get('used_lab'),
			"status" : this.get('status'),
			"state" : this.get('state')
		}	
	}
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
					card.set('player', this.get('handle_player'));
					this.get('handle_player').get('cards').pushObject(card);
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
	number: 4,
	color: "yellow",
	pic: "character4.jpg",
	reveal : function(game) {
		
		if (this.get('status') == 'in_hand')
		{
			game.get('player1').set('has_crown', false);
			game.get('player2').set('has_crown', false);
			this.get('player').set('has_crown', true);
		}
		
		this._super(game);
	}
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
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')+1);
	},
	takeCard(game, card) {
		this._super(game, card);
		this.get('handle_player').set('coins', this.get('handle_player').get('coins')+1);
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
	take2Cards(game) {
		game.drawCards(this.get('handle_player'), 2);
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

App.Characters = Ember.Object.extend({
	init() {
		this.set('content', []);
		var characters_content = this.get('content');
		characters_content.pushObject(App.Assasin.create());
		characters_content.pushObject(App.Thief.create());
		characters_content.pushObject(App.Magician.create());
		characters_content.pushObject(App.King.create());
		characters_content.pushObject(App.Bishop.create());
		characters_content.pushObject(App.Merchant.create());
		characters_content.pushObject(App.Architect.create());
		characters_content.pushObject(App.Warlord.create());
	}
});

App.Player = Ember.Object.extend({
	is_robot: false,
	has_crown : false,
	name : null,
	closed : Ember.computed('districts.length', function() {
		return this.get('districts').length >= 8;
	}),
	closed_first : false,
	coins : 2,
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
		"closed_first" : this.get("closed_first")
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
	
	start : function(name, player1_name, player2_name) {
			
			this.set('name',name);
			
			var player1 = App.Player.create({ name :  player1_name, districts : [], characters : [], cards : []});
			var player2 = App.Player.create({ name :  player2_name, is_robot : true, districts : [], characters : [], cards : []});
			this.set('player1', player1);
			this.set('player2', player2);
			this.setFirstPlayer();
			this.get('activePlayer').set('has_crown',true);
			
			var deck = App.Deck.create(); 
			this.set('deck',deck);
			
			this.drawCards(this.get('player1'), 4);
			this.drawCards(this.get('player2'), 4);
			
			this.set('currentCharacter', null);
			
			var characters = App.Characters.create();
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
		if (this.get('phaze') == 'choose' || this.get('phaze') == 'action')
			localStorage.setItem('game', JSON.stringify(this.serialize()));
	},
	load : function(gameData) {
		var game = JSON.parse(gameData);
		this.set('name', game.name);
		this.set('first_full_city', game.first_full_city);
		this.set('phaze', game.phaze);
		this.set('player1', App.Player.create(game.player1));
		this.set('player2', App.Player.create(game.player2));
		
		var gamePlayers = [], owner, handle_player;
		gamePlayers.pushObject(this.get('player1'));
		gamePlayers.pushObject(this.get('player2'));
		this.set('activePlayer', gamePlayers.findBy('name', game.activePlayer));
		
		this.set('deck', App.Deck.create({ init_deck : game.deck }));
		this.get('deck').get('content').forEach(function(card) {
			if (card.get('player')) 
			{
				owner = gamePlayers.findBy('name', card.get('player'));
				card.set('player', owner);
				if (card.get('status') == 'in_hand') owner.get('cards').pushObject(card);
				if (card.get('status') == 'built') owner.get('districts').pushObject(card);
			}
		});
		
		var characters = App.Characters.create();
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
  			this.get('game').start(gameName || "New Game", yourName || "Human", robotName || "Robot");
  		},
  		finish : function() {
  			this.get('game').finish();
  		},
  		restart : function() {
  			this.get('game').restart();
  		},
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
			this.get('game').get('currentCharacter').endTurn(this.get('game'));
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
