// Copyright 2019 GitBitEx.com
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Collect, Moment } from './../vendor';
import { SocketMsgBuffer } from './buffer';
import { Helper } from './../helper';
import { WebSocketService } from './../service/websocket';
import { SubscribeChannel } from './channel';
import { Store } from './store';
import { HttpService } from './../service/http';

export class TradeStore extends Store {

    private static _instance: TradeStore;
    public static instance() {
        this._instance || (this._instance = new TradeStore());
        return this._instance;
    }

    orderBuffer: SocketMsgBuffer;
    bookBuffer: SocketMsgBuffer;
    fundsBuffer: SocketMsgBuffer;

    get storeOptions(): {} {
        return  {

            state: {
                products: [],
                objects: undefined,
                funds: {}
            },
        
            mutations: {
                setProducts: (state: any, products: any[]) => {

                    let objects: any = {};
                    products.forEach((product: any) => {
                        objects[product.id] = {
                            orderBook: {
                                bids: [],
                                asks: []
                            },
                            history: [],
                            historyType: 'candles_60',
                            tradeHistory: [],
                            product: product,
                            openOrders: [],
                        };
                    });

                    state.products = products;
                    state.objects || (state.objects = objects);
                },
                setOrderBook: (state: any, orderBook: any) => {
                    state.objects[orderBook.productId].orderBook = {
                        bids: orderBook.bids,
                        asks: orderBook.asks
                    };
                },
                setHistory: (state: any, history: any) => {
                    state.objects[history.productId].history = history.items;
                    state.objects[history.productId].historyType = history.type;
                },
                setTradeHistory: (state: any, history: any) => {
                    state.objects[history.productId].tradeHistory = history.trades;
                },
                setOpenOrders: (state: any, orders: any) => {
                    state.objects[orders.productId].openOrders = orders.items;
                },
                setFunds: (state: any, funds: any) => {
                    state.funds = funds;
                },
                updateFund: (state: any, fund: any) => {
                    state.funds[fund.currency] = fund;
                }
            }

        }
    
    }

    get products() {
        return this.store.state.products;
    }

    get funds() {
        return this.store.state.funds;
    }

    getObject(productId: string) {
        return this.store.state.objects[productId];
    }

    loadProducts(callback?: () => void) {
        HttpService.Trade.getProducts().then((response: any) => {
            this.store.commit('setProducts', response);
            callback && callback();
        });
    }

    loadProductHistory(productId: string, granularity: number, callback?: () => void) {
        let historyType = `candles_${granularity}`;
        this.subscribe([productId], [historyType]);
        HttpService.Trade.getProductHistory(productId, granularity).then((response: any) => {
            this.store.commit('setHistory', {
                productId: productId,
                type: historyType,
                items: response
            });
            callback && callback();
        });
    };

    loadTradeHistory(productId: string) {
        HttpService.Trade.getProductTradeHistory(productId).then((response: any) => {
            response.forEach((trade: any) => {
                trade.localTime = Moment(trade.time).format('H:mm:ss');
            });
            this.store.commit('setTradeHistory', {productId: productId, trades: response});
        })
    }

    loadOpenOrders(productId: string, callback?: () => void) {
        this.subscribe([productId], ['order']);
        let product = this.getObject(productId).product;
        HttpService.Order.getOrders(productId, 30, ['open']).then((response: any) => {
            response.items.forEach((order: any) => {
                order.statusFormat = order.status;
                order.price = Number(order.price).toFixed(product.quoteScale);
                order.fillFees = Number(order.fillFees).toFixed(product.quoteScale);
                order.filledSize = Number(order.filledSize).toFixed(4);
                order.size = Number(order.size).toFixed(4);
                order.timeFormat = Moment(order.createdAt).format('MM-DD hh:mm:ss');
                order.priceFormat = Number(order.price) ? order.price: 'MARKET';
            });
            this.store.commit('setOpenOrders', {productId: productId, items: response.items});
            callback && callback();
        })
    }

    loadFunds(currencies: string[]) {
        this.subscribeFunds(currencies);
        let funds: any = {};
        HttpService.Account.getFunds(currencies).then((response: any) => {
            response.forEach((item: any) => {
                funds[item.currency] = item;
            });
            this.store.commit('setFunds', funds);
        });
    }

    subscribeAllTicker() {
        let productIds: string[] = [];
        this.products.forEach((product: any) => {
            productIds.push(product.id);
        });
        this.subscribe(productIds, [SubscribeChannel.TICKET]);    
    }

    subscribe(productIds: string[], channels: string[]) {
        WebSocketService.Instance.subscribe({
            'type': 'subscribe',
            'product_ids': productIds,
            'channels': channels
        });
    }

    subscribeFunds(currencies: string[]) {
        WebSocketService.Instance.subscribe({
            'type': 'subscribe',
            'currency_ids': currencies,
            'channels': ['funds']
        });
    }

    unsubscribe(productIds: string[], channels: string[]) {
        WebSocketService.Instance.subscribe({
            'type': 'unsubscribe',
            'product_ids': productIds,
            'channels': channels
        });
    }
    
    setOrderBook(orderBook: any) {
        this.store.commit('setOrderBook', orderBook);
    }

    updateOrderBook(buffers: any) {

        let changes: any = {};

        buffers.forEach((buffer: any) => {
            changes[buffer.productId] || (changes[buffer.productId] = []);
            changes[buffer.productId] = changes[buffer.productId].concat(buffer.changes);
        });

        for(let productId in changes) {

            let bids: any = {},
                asks: any = {};

            this.getObject(productId).orderBook.bids.forEach((bid: any) => {
                bid && (bids[Number(bid[0])] = bid);
            });
            this.getObject(productId).orderBook.asks.forEach((ask: any) => {
                ask && (asks[Number(ask[0])] = ask);
            });

            changes[productId].forEach((change: any) => {
                if (change[0] == 'buy') {
                    change[2] == 0 ? delete bids[change[1]] : bids[change[1]] = [change[1], change[2]];
                }
                else {
                    change[2] == 0 ? delete asks[change[1]] : asks[change[1]] = [change[1], change[2]];
                }
            });
            let bidsArr = Helper.Object_values(bids).sort((a: any, b: any) => {
                return a[0] - b[0];
            });
            let asksArr = Helper.Object_values(asks).sort((a: any, b: any) => {
                return a[0] - b[0];
            });

            this.setOrderBook({
                productId: productId,
                bids: bidsArr.reverse(),
                asks: asksArr,
            });

        }

    }

    updateHistory(data: any) {

        let object = this.getObject(data.productId),
            time = Math.floor(Moment(data.time).format('X')),
            last_record = object.history[0],
            price = Number(data.price),
            size = Number(data.size),
            granularity = Number(object.historyType.replace('candles_', ''));

        if (!last_record) {
            return;
        }
  
        time = time - (time % granularity);

        object.history[0] = [
            last_record[0],
            last_record[1] > price ? price: last_record[1],
            last_record[2] > price ? last_record[2] : price,
            last_record[3],
            price,
            last_record[5] + size
        ];

        if (last_record[0] != time) {
            object.history.unshift([time, price, price, price, price, size])
        }

    }

    updateTradeHistory(data?: any) {

        this.updateHistory(data);

        data.localTime = Moment(data.time).format('H:mm:ss');;
        
        let trades = this.getObject(data.productId).tradeHistory;
        
        trades.unshift(data);

        if (trades.length > 120) {
            trades = trades.slice(0, 120);
        }

        this.store.commit('setTradeHistory', {productId: data.productId, trades: trades});
    }

    updatePruductPrice(data?: any) {
        let products: any[] = [];
        this.products.forEach((product: any) => {
            if (product.id == data.productId) {
                product = Object.assign(product, data);
                product.rate24h = ((product.price*100/product.open24h)-100).toFixed(2);
                product.volume24h = Math.floor(product.volume24h);
            }
            products.push(product);
        });
        this.store.commit('setProducts', products);
    }

    updateOrder(buffers: any[]) {

        let products: any = Collect(buffers).groupBy('productId');

        for(let productId in products.items) {

            let product = this.getObject(productId).product,
                orders = this.getObject(productId).openOrders;

            products.items[productId].items.forEach((order: any) => {
        
                let findOrders = orders.filter((_order: any) => {
                    return _order.id == order.id;
                })
        
                order.statusFormat = order.status;
                order.price = Number(order.price).toFixed(product.quoteScale);
                order.filledSize = Number(order.filledSize).toFixed(4);
                order.fillFees = Number(order.fillFees).toFixed(product.quoteScale);
                order.size = Number(order.size).toFixed(4);
                order.timeFormat = Moment(order.createdAt).format('MM-DD hh:mm:ss');
                order.priceFormat = Number(order.price) ? order.price: 'MARKET';
    
                if (findOrders.length) {
                    findOrders[0] = Object.assign(findOrders[0], order);
                }
                else {
                    orders.unshift(order);
                }

            });
     
            this.store.commit('setOpenOrders', {productId: productId, items: orders});

        }


    }

    updateFund(buffers: any) {
        let funds: any = {};
        buffers.forEach((buffer: any) => {
            funds[buffer.currencyCode] = {
                available: buffer.available,
                currency: buffer.currencyCode,
                hold: buffer.hold
            };
        });
        for(let code in funds) {
            this.store.commit('updateFund', funds[code]);
        }
    }

    clearUserTrades() {
        this.products.forEach((product: any) => {
            this.store.commit('setOpenOrders', {productId: product.id, items: []});
            this.unsubscribe([product.id], ['order']);
        });
    }

    parseWebSocketMessage(msg: any) {
        if (msg.type == 'snapshot') {
            this.setOrderBook(msg);
        }
        else if (msg.type == 'l2update') {
            
            this.bookBuffer || (this.bookBuffer = new SocketMsgBuffer((buffers: any[]) => {
                this.updateOrderBook(buffers);
            }, 200));
            this.bookBuffer.push(msg);
            
        }
        else if (msg.type.indexOf('candles') === 0) {
            this.updateHistory(msg);
        }
        else if (msg.type == 'match') {
            this.updateTradeHistory(msg);
        }
        else if (msg.type == 'ticker') {
            this.updatePruductPrice(msg);
        }
        else if (msg.type == 'order') {
            this.orderBuffer || (this.orderBuffer = new SocketMsgBuffer((buffers: any[]) => {
                this.updateOrder(buffers);
            }, 300));
            this.orderBuffer.push(msg);
        }
        else if (msg.type == 'funds') {
            this.fundsBuffer || (this.fundsBuffer = new SocketMsgBuffer((buffers: any[]) => {
                this.updateFund(buffers);
            }, 300));
            this.fundsBuffer.push(msg);
        }
     }

}