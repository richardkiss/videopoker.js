function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffle_deck() {
  var deck = [];
  var i;
  for (i=0; i<52; i++) {
    deck.push(i);
  }
  shuffle(deck);
  return deck;
}

function show_hand(hand) {
  var i;
  for (i=0; i<hand.cards.length; i++) {
    var c = hand.cards[i];
    var t = card_to_text(c);
    document.getElementById("card_" + i).innerHTML = '<img src="./img/' + t + '.svg" class="crop" />';
  }
}

function has_jacks_or_better(hand) {
  var v = has_pair(hand);
  if (v !== undefined) {
    if (v[0]>=10) {
      return v;
    }
  }
}

var pay_table = [
  ["Royal flush", 800],
  ["Straight flush", 50],
  ["Four of a kind, aces", 160],
  ["Four of a kind, 2, 3, or 4", 80],
  ["Four of a kind", 50],
  ["Full house", 10],
  ["Flush", 7],
  ["Straight", 5],
  ["Three of a kind", 3],
  ["Two pair", 1],
  ["Jacks or better", 1]
];

var hand_f_list = [
  has_royal_flush,
  has_straight_flush,
  has_four_of_a_kind,
  has_full_house,
  has_flush,
  has_straight,
  has_three_of_a_kind,
  has_two_pair,
  has_jacks_or_better,
  has_pair,
  has_nothing,
];

function draw_table(hands) {
  var s = '<table class="payouts">';
  s += '<tr><th>Hand</th><th>Payout</th><th>Count</th><th>Total</th></tr>';
  var i;
  var total_payout = 0, total_count = 0;
  for (i=0;i<hands.length;i++) {
      s += '<tr><td>' + hands[i].name + '</td>';
      s += '<td>' + hands[i].payout + '</td>';
      s += '<td>' + hands[i].count + '</td>';
      s += '<td>' + (hands[i].payout * hands[i].count) + '</td>';
      total_payout += (hands[i].payout * hands[i].count);
      total_count += hands[i].count;
  }
  s += '<tr><td></td><td></td><td>' + total_count + '</td><td>' + total_payout + '</td></tr>';
  s += '</table>';
  s += 'Expected payout: <b>' + total_payout/total_count + '</b>';
  document.getElementById("paytable").innerHTML = s;
}

function update_table(hand, deck) {
  var i;
  var totals = find_hand_count(hand, hand_f_list, 5, deck, 5);
  var hand_names = 'Royal Flush/Straight Flush/Four of a kind/Full House/Flush/Straight/Three of a Kind/Two Pair/Jacks or Better/Pair/Nothing'.split("/");
  var payouts = [250, 50, 25, 9, 6, 4, 3, 2, 1, 0, 0];
  var hands = [];
  for (i=0; i<hand_f_list.length; i++) {
      hands.push({name:hand_names[i], payout:payouts[i], count:totals[i]});
  }
  draw_table(hands);
}

function make_subhand(hand) {
  var new_hand = new Hand([]);
  new_hand.add_cards([hand.cards[0], hand.cards[2], hand.cards[4]]);
  return new_hand;
}

var deck = shuffle_deck();
var hand = new Hand(deck.slice(0, 5));

function recalculate() {
  var new_hand = new Hand([]);
  for (i=0;i<5;i++) {
    if (document.getElementById("discard" + i).checked) {
      new_hand.add_cards([hand.cards[i]]);
    }
  }
  update_table(new_hand, deck);
}

function note_events() {
  var i;
  for (i=0;i<5;i++) {
    document.getElementById("discard" + i).onclick = recalculate;
  }
}

note_events();
show_hand(hand);
