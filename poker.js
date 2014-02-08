/*
0: A
1: 2
2: 3
.
9: 10
10: J
11: Q
12: K
13: Ace high

00-12 A-K of spades
13-25 A-K of diamonds
26-38 A-K of hearts
39-52 A-K of clubs

has_four_of_a_kind
has_straight_flush
has_full_house
has_flush
has_straight
has_three_of_a_kind
has_two_pair
has_pair
has_nothing

*/

function Hand(cards) {
    this.cards = [];
    this.suit_counts = new Uint8Array(4);
    this.index_counts = new Uint8Array(13);
    this.card_counts = new Uint8Array(52);
    this.add_cards(cards);
}

Hand.prototype.add_cards = function (cards) {
    var c, i;
    for (i=0; i<cards.length; i++) {
        c = cards[i];
        this.cards.push(c);
        this.card_counts[c]++;
        this.index_counts[c % 13]++;
        this.suit_counts[Math.floor(c/13)]++;
    }
}

Hand.prototype.pop_card = function () {
    var c = this.cards.pop();
    this.card_counts[c]--;
    this.index_counts[c % 13]--;
    this.suit_counts[Math.floor(c/13)]--;
}

function hand_to_text(hand) {
    function card_to_text(card) {
        var idx = card % 13;
        var suit = Math.floor(card/13);
        return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][idx] + "SDHC".substr(suit, 1);
    }
    return hand.cards.map(card_to_text).join(" ");
}

function helper_has_straight(suit_array, start_index) {
    var i;
    var check_index = 10;
    while (check_index>=0) {
        for (i=0;i<5;i++) {
            if (suit_array[start_index+(i+check_index)%13] == 0) {
                check_index = check_index - 5 + i;
                break
            }
        }
        if (i==5) {
            return (check_index+4)%13;
        }
    }
}

/*function helper_has_N_of_kind(hand, N) {
    var i, idx;
    var rank, cnt;
    var kickers = new Uint8Array(5-N);
    var kicker_count = 0;
    for (i=13;i>0;i--) {
        idx = i%13;
        cnt = hand.index_counts[idx];
        if (rank===undefined) {
            if (hand.index_counts[idx] >= N) {
                rank = idx;
            }
        }
        if (rank!==undefined) {
            if (cnt>0) {
            }
        }
    }
}*/

function has_four_of_a_kind(hand) {
    var i, idx;
    var rank, cnt;
    var kicker;
    for (i=13; i>0; i--) {
        idx = i % 13;
        cnt = hand.index_counts[idx];
        if (cnt === 4) {
            rank = i;
            break
        }
        if ((kicker === undefined) && (cnt > 0)) {
            kicker = i;
        }
    }
    if (rank !== undefined) {
        for (i=i-1; i>0; i--) {
            if (hand.index_counts[i]>0) {
                kicker = i;
                return [rank, kicker];
            }
        }
    }
}

function has_straight_flush(hand) {
    var v, i;
    for (i=0;i<4;i++) {
        v = helper_has_straight(hand.card_counts, 13*i);
        if (v) {
            return [v, i];
        }
    }
}

function has_full_house(hand) {
    var trip, doub, idx;
    for (i=13; i>0; i--) {
        idx = i % 13;
        if ((trip === undefined) && (hand.index_counts[idx] >= 3)) {
            trip = i;
            if (doub) {
                return [trip, doub];
            }
            continue;
        }
        if ((doub === undefined) && (hand.index_counts[idx] >= 2)) {
            doub = i;
            if (trip) {
                return [trip, doub];
            }
        }
    }
}

function has_flush(hand) {
    var i;
    for (i=0;i<4;i++) {
        if (hand.suit_counts[i] >= 5) {
            var kickers = new Uint8Array(5);
            var kicker_count = 0;
            var base_idx = 13 * i;
            for (i=13; i>0; i--) {
                var idx = i % 13;
                if (hand.card_counts[idx+base_idx] > 0) {
                    kickers[kicker_count++] = i;
                    if (kicker_count === 5) {
                        return kickers;
                    }
                }
            }
        }
    }
}

function has_straight(hand) {
    var i, v;
    for (i=0;i<4;i++) {
        v = helper_has_straight(hand.index_counts, 0);
        if (v) {
            return [v];
        }
    }
}

function has_three_of_a_kind(hand) {
    var i, idx;
    var rank, cnt;
    var kickers = new Uint8Array(2);
    var kicker_count = 0;
    for (i=13; i>0; i--) {
        idx = i % 13;
        cnt = hand.index_counts[idx];
        if ((cnt >= 3) && (rank === undefined)) {
            rank = i;
            continue;
        }
        if ((cnt > 0) && (kicker_count < 2)) {
            kickers[kicker_count] = i;
            kicker_count++;
        }
        if (rank && (kicker_count==2)) {
            return [rank, kickers[0], kickers[1]];
        }
    }
}


function has_two_pair(hand) {
    var i, idx;
    var pairs = new Uint8Array(2), pair_count = 0;
    var kicker;
    for (i=13; i>0; i--) {
        idx = i % 13;
        cnt = hand.index_counts[idx];
        if ((pair_count < 2) && (cnt >= 2)) {
            pairs[pair_count] = i;
            pair_count++;
        }
        else if ((cnt > 0) && (kicker === undefined)) {
            kicker = i;
        }
        if ((pair_count>=2) && kicker) {
            return [pairs[0], pairs[1], kicker];
        }
    }
}

function has_pair(hand) {
    var i, idx;
    var rank, cnt;
    var kickers = new Uint8Array(3);
    var kicker_count = 0;
    for (i=13; i>0; i--) {
        idx = i % 13;
        cnt = hand.index_counts[idx];
        if ((cnt >= 2) && (rank === undefined)) {
            rank = i;
        }
        else if ((cnt > 0) && (kicker_count < 3)) {
            kickers[kicker_count] = i;
            kicker_count++;
        }
        if (rank && (kicker_count==3)) {
            return [rank, kickers[0], kickers[1], kickers[2]];
        }
    }
}

function has_nothing(hand) {
    var i, idx;
    var rank, cnt;
    var kickers = new Uint8Array(5);
    var kicker_count = 0;
    for (i=13; i>0; i--) {
        idx = i % 13;
        if (hand.index_counts[idx] > 0) {
            kickers[kicker_count] = i;
            kicker_count++;
            if (kicker_count==5) {
                return kickers;
            }
        }
    }
}

function find_hand_count(hand, identifier_f, max_card_count, deck, deck_idx, totals) {
    var totals;
    if (totals === undefined) {
        totals = new Uint8Array(identifier_f.length);
    }
    var c, idx;
    var hand_name;
    deck_idx = deck_idx || 0;
    if (hand.cards.length >= max_card_count) {
        // figure out what kind of hand this is
        for (idx=0; idx<identifier_f.length; idx++) {
            hand_name = identifier_f[idx](hand);
            if (hand_name) {
                totals[idx]++;
                return;
            }
        }
        throw "got an exception";
    }
    for (idx=deck_idx;idx<deck.length;idx++) {
        c = deck[idx];
        hand.add_cards([c]);
        find_hand_count(hand, identifier_f, max_card_count, deck, idx+1, totals);
        hand.pop_card();
    }
    return totals;
}
