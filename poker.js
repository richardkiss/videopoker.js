/*
00-12 A-K of spades
13-25 A-K of diamonds
26-38 A-K of hearts
39-52 A-K of clubs
*/
function Hand(cards) {
    this.cards = [];
    this.suit_counts = Uint8Array(4);
    this.index_counts = Uint8Array(13);
    this.card_counts = Uint8Array(52);
    this.add_cards(cards);

    //this.prototype.
}

Hand.prototype.add_cards = function (cards) {
    var c, idx;
    for (i in idx) {
        c = cards[i];
        this.cards.push(c);
        this.card_counts[c]++;
        this.index_counts[c % 13]++;
        this.suit_counts[Math.floor(c/4)]++;
    }
}

Hand.prototype.pop_card = function () {
    var c = cards.pop();
    this.card_counts[c]--;
    this.index_counts[c % 13]--;
    this.suit_counts[Math.floor(c/4)]--;
}



function find_hand_count(hand, hand_name_identifier_f_pairs, max_card_count, deck, deck_idx, partial_totals) {
    var totals = partial_totals || Uint8Array(hand_name_identifier_f_pairs.length);
    var c, idx;
    var hand_name;
    deck_idx = deck_idx || 0;
    if (max_card_count < 1) {
        // figure out what kind of hand this is
        for (idx=0;idx<hand_name_identifier_f_pairs,idx++) {
            c = hand_name_identifier_f_pairs[idx];
            hand_name = c[1][1](hand);
            if (hand_name) {
                totals[idx]++;
            }
        }
    }
    for (idx=deck_idx;idx<deck.length;idx++) {
        c = deck[idx];
        hand.add_cards([c]);
        find_hand_count(hand, hand_name_identifier_f_pairs, max_card_count-1, deck, idx+1, totals);
    }
    return totals;
}
