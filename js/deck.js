Deck = Ember.Object.extend({
	content : [
	{
		"name" : "domain",
		"type" : "yellow",
		"pic" : "images/card19.jpg",
		"cost" : 3
	},
	{
		"name" : "castle",
		"type" : "yellow",
		"pic" : "images/card18.jpg",
		"cost" : 4
	},
	{
		"name" : "church",
		"type" : "blue",
		"pic" : "images/card2.jpg",
		"cost" : 2
	},
	{
		"name" : "castle",
		"type" : "yellow",
		"pic" : "images/card18.jpg",
		"cost" : 4
	},
	{
		"name" : "fortress",
		"type" : "red",
		"pic" : "images/card17.jpg",
		"cost" : 5
	},
	{
		"name" : "docks",
		"type" : "green",
		"pic" : "images/card26.jpg",
		"cost" : 3
	}
	],
	
	shuffle : function() {
		for (var j, x, i = this.content.length; i;  j = parseInt(Math.random() * i), 
		x = this.content[--i], this.content[i] = this.content[j], this.content[j] = x);
	}
});