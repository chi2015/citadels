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
	setCrownTo : function(player) {
		var old_crown_owner = this.get('player1').get('has_crown') ? this.get('player1') : this.get('player2');
		this.get('player1').set('has_crown', false);
		this.get('player2').set('has_crown', false);
		player.set('has_crown', true);
		if (old_crown_owner!==player) {
			if (this.get('player1').hasDistrict("throneroom")) this.get('player1').set('coins', this.get('player1').get('coins')+1);
			if (this.get('player2').hasDistrict("throneroom")) this.get('player2').set('coins', this.get('player2').get('coins')+1);
		}
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
			this.set('currentCharacter', null);
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
			this.set('currentCharacter', null);
			this.resetCharacters();
			
			if (this.get('first_full_city'))
			{
				this.set('phaze', 'end');
				this.setWinner();
			}
			else {
				this.set('phaze','choose');
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
