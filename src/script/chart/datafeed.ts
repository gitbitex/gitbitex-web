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

import { HttpService } from './../service/http';
import { StoreService } from '../store/service';

const configJSON = {
    supports_search: true,
    supports_time: true,
    supports_timescale_marks: true,
    supports_group_request: false,
    supports_marks: false,
    supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W'],
};

const symbolResolveJSON = {
    name: 'BTC/USDT',
    timezone: 'Asia/Shanghai',
    minmov: 1.5,
    minmov2:1,
    pointvalue: 0.01,
    has_intraday: true,
    intraday_multipliers: ['1', '5', '15', '30', '60', '240', '1D', '1W'],
    has_daily: true,
    has_empty_bars: false,
    has_no_volume: false,
    has_weekly_and_monthly: true,
    description: '',
    type: 'Index',
    supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W'],
    pricescale: 0.1,
    ticker: 'BTC/USDT',
};

export class UDFCompatibleDatafeed {

    productId: string;
    configuration: any;
  
    symbolSearch: any;
    symbolsStorage: any;
    barsPulseUpdater: DataPulseUpdater;
    quotesPulseUpdater: QuotesPulseUpdater;
    protocolVersion: number;
  
    enableLogging = false;
    initializationFinished = false;
    callbacks: any = {};
    history: any[] = [];
    resolution: string = "0"; 
    historyLoading: boolean = false;
    

    constructor(productId: string, updateFrequency: number, protocolVersion: number) {
        this.productId = productId;
        this.barsPulseUpdater = new DataPulseUpdater(this, updateFrequency || 1000 * 10);
        // 交易终端
        this.quotesPulseUpdater = new QuotesPulseUpdater(this);
        this.protocolVersion = protocolVersion || 2;

        this.initialize();

    }

    defaultConfiguration() {
        return {
            supports_search: false,
            supports_group_request: true,
            supported_resolutions: ['1', '5', '15', '30', '60', '1D'],
            supports_marks: false,
            supports_timescale_marks: false,
        };
    };

    getServerTime  (callback: (time: number) => void) {

        callback(new Date().getTime());

    }

    on(event: any, callback: any) {
        this.callbacks.hasOwnProperty(event) || (this.callbacks[event] = []);
        this.callbacks[event].push(callback);
        return this;
    }
  
    fireEvent(event: any, argument?: any) {
        if (this.callbacks.hasOwnProperty(event)) {
            const callbacksChain = this.callbacks[event];
            for (let i = 0; i < callbacksChain.length; ++i) {
                callbacksChain[i](argument);
            }
            this.callbacks[event] = [];
        }
    }

    onInitialized() {
        this.initializationFinished = true;
        this.fireEvent('initialized');
    }
    
    logMessage = function (message: string) {
        if (this.enableLogging) {
            const now = new Date();
        }
    }

    initialize = function () {
        const that = this;
        this.setupWithConfiguration(configJSON);
    }

    onReady(callback: any) {
        if (this.configuration) {
            callback(this.configuration);
        } 
        else {
            this.on('configuration_ready', () => {
                callback(this.configuration);
            });
        }
    }

    setupWithConfiguration = function (configurationData: any) {

        this.configuration = configurationData;
      
        if (!configurationData.exchanges) {
            configurationData.exchanges = [];
        }
      
        //	@obsolete; remove in 1.5
        const supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
        configurationData.supported_resolutions = supportedResolutions;
      
        //	@obsolete; remove in 1.5
        const symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
        configurationData.symbols_types = symbolsTypes;
      
        if (!configurationData.supports_search && !configurationData.supports_group_request) {
            throw 'Unsupported datafeed configuration. Must either support search, or support group request';
        }
      
        if (!configurationData.supports_search) {
            this.symbolSearch = new SymbolSearchComponent(this);
        }
      
        if (configurationData.supports_group_request) {
            this.symbolsStorage = new SymbolsStorage(this);
        } else {
            this.onInitialized();
        }
      
        this.fireEvent('configuration_ready');
        this.logMessage(`Initialized with ${JSON.stringify(configurationData)}`);
    }


    getMarks(symbolInfo: any, rangeStart: any, rangeEnd: any, onDataCallback: any, resolution: any) {
    // console.log('getMarks rangeStart ->', rangeStart);
    // console.log('getMarks rangeEnd ->', rangeEnd);
        onDataCallback([]);
    /*   if (this._configuration.supports_marks) {
        this._send(this._datafeedURL + "/marks", {
          symbol: symbolInfo.ticker.toUpperCase(),
          from: rangeStart,
          to: rangeEnd,
          resolution: resolution
        })
          .done(function (response) {
            // console.log('getMarks ->', response);
            onDataCallback(JSON.parse(response));
          })
          .fail(function () {
            onDataCallback([]);
          });
      } */
    }

    // 图表库调用此函数获取可见K线范围的时间刻度标记。图表预期您每个调用getTimescaleMarks会调用一次onDataCallback。
    getTimescaleMarks(symbolInfo: any, rangeStart: any, rangeEnd: any, onDataCallback: any, resolution: any) {
    // console.log('getTimescaleMarks rangeStart->', rangeStart);
    // console.log('getTimescaleMarks rangeEnd->', rangeEnd);
        onDataCallback([]);
  
    /*   if (this._configuration.supports_timescale_marks) {
        this._send(this._datafeedURL + "/timescale_marks", {
          symbol: symbolInfo.ticker.toUpperCase(),
          from: rangeStart,
          to: rangeEnd,
          resolution: resolution
        })
          .done(function (response) {
            // console.log('getTimescaleMarks response ->', response);
            onDataCallback(JSON.parse(response));
          })
          .fail(function () {
            onDataCallback([]);
          });
      } */
    }


    // 提供一个匹配用户搜索的商品列表
    searchSymbolsByName = function (ticker: any, exchange: any, type: any, onResultReadyCallback: any) {
        onResultReadyCallback([]);
        return;
    }


    // 通过日期范围获取历史K线数据。图表库希望通过onDataCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
    getBars(symbolInfo: any, resolution: any, rangeStartDate: any, rangeEndDate: any, onDataCallback: any, onErrorCallback: any) {

        const meta = { version: 1.0, noData: false };

        if (this.resolution == '0') {
            this.resolution = resolution;
            return;
        }

        let second = this.barsPulseUpdater.periodLengthSeconds(resolution);

        let returnBars =  () => {

            let history: any[] = [];
        
            StoreService.Trade.getObject(this.productId).history.forEach((item: any, index: number) => {
                history.push({
                    time: item[0], close: item[4], open: item[3], high: item[2], low: item[1], volume: item[5]
                });
            });
            history.reverse();

            return history;

        }

        let _history = returnBars();

        if(this.resolution != resolution) {
            this.resolution = resolution;
            _history = [];
        }

        if (_history.length > 0) {
            onDataCallback(_history, meta);
            return;
        }

        this.resolution = resolution;
        this.historyLoading = true;

        StoreService.Trade.loadProductHistory(this.productId, second, () => {
            onDataCallback(returnBars(), meta);
        });
    
    }

    // 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
    subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any, listenerGUID: any, onResetCacheNeededCallback: any) {
        (window as any).hasWsMessage = '';
        this.barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID);
    }
  
    // 取消订阅K线数据。在调用subscribeBars方法时,图表库将跳过与subscriberUID相同的对象。
    unsubscribeBars (listenerGUID: any) {
        this.barsPulseUpdater.unsubscribeDataListener(listenerGUID);
    }
  
    // 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度。
    calculateHistoryDepth(period: any, resolutionBack: any, intervalBack: any) {
    }
  
  
    // -------------------- 交易终端专属-----------------------------
  
    // 当图表需要报价数据时，将调用此函数。图表库预期在收到所有请求数据时调用onDataCallback。
    getQuotes(symbols: any, onDataCallback: any, onErrorCallback: any) {
        // this._send(`${this._datafeedURL}/quotes`, { symbols })
        // .done((response) => {
        //     const data = JSON.parse(response);
        //     if (data.s == 'ok') {
        //     //	JSON format is {s: "status", [{s: "symbol_status", n: "symbol_name", v: {"field1": "value1", "field2": "value2", ..., "fieldN": "valueN"}}]}
        //     if (onDataCallback) {
        //         onDataCallback(data.d);
        //     }
        //     } else if (onErrorCallback) {
        //     onErrorCallback(data.errmsg);
        //     }
        // })
        // .fail((arg) => {
        //     if (onErrorCallback) {
        //     onErrorCallback(`network error: ${arg}`);
        //     }
        // });
    }
  
    // 交易终端当需要接收商品的实时报价时调用此功能。图表预期您每次要更新报价时都会调用onRealtimeCallback。
    subscribeQuotes(symbols: any, fastSymbols: any, onRealtimeCallback: any, listenerGUID: any) {
        this.quotesPulseUpdater.subscribeDataListener(symbols, fastSymbols, onRealtimeCallback, listenerGUID);
    }
    
    // 交易终端当不需要再接收商品的实时报价时调用此函数。当图表库遇到listenerGUID相同的对象会跳过subscribeQuotes方法。
    unsubscribeQuotes(listenerGUID: any) {
        this.quotesPulseUpdater.unsubscribeDataListener(listenerGUID);
    }

    // 通过商品名称解析商品信息
    resolveSymbol(symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) {

        setTimeout(() => {
            if (!this.initializationFinished) {
                this.on('initialized', () => {
                    this.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
                });
                return;
            }
      
            const resolveRequestStartTime = Date.now();
            this.logMessage('Resolve requested');
      
            let onResultReady = (data: any) => {
                let postProcessedData = data;
                // if (this.postProcessSymbolInfo) {
                //     postProcessedData = this.postProcessSymbolInfo(postProcessedData);
                // }
        
                this.logMessage(`Symbol resolved: ${Date.now() - resolveRequestStartTime}`);
                onSymbolResolvedCallback(postProcessedData);
            }
      
            if (!this.configuration.supports_group_request) {
                onResultReady(symbolResolveJSON);
            } 
            else if (this.initializationFinished) {
                this.symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
            } 
            else {
                this.on('initialized', () => {
                    this.symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
                });
            }
        })

        
    }
}


class SymbolsStorage {

    datafeed: any;

    exchangesList = ['AAPL', 'NYSE', 'FOREX', 'AMEX'];
    exchangesWaitingForData = {};
    exchangesDataCache = {};
  
    symbolsInfo = {};
    symbolsList: any = [];

    constructor(datafeed: any) {

        this.datafeed = datafeed;
        
      
        this.requestFullSymbolsList();

        
    }

    // 设置商品集合信息
    requestFullSymbolsList = function () {
        const that = this;
        const datafeed = this._datafeed;
    
        for (let i = 0; i < this._exchangesList.length; ++i) {
        const exchange = this._exchangesList[i];
    
        if (this._exchangesDataCache.hasOwnProperty(exchange)) {
            continue;
        }
    
        this._exchangesDataCache[exchange] = true;
        this._exchangesWaitingForData[exchange] = 'waiting_for_data';
    
        const response = {
            symbol: ['AAPL', 'NYSE', 'FOREX', 'AMEX'],
            description: ['AAPL Inc', 'NYSE corp', 'FOREX index', 'AMEX index'],
            'exchange-listed': 'NYSE',
            'exchange-traded': 'NYSE',
            minmov: 1,
            minmov2: 0,
            pricescale: [1, 1, 100],
            'has-dwm': true,
            'has-intraday': true,
            'has-no-volume': [false, false, true, false],
            type: ['stock', 'stock', 'index', 'index'],
            ticker: ['AAPL~0', 'MSFT~0', '$SPX500'],
            timezone: 'Asia/Shanghai',
            'session-regular': '0900-1600',
        };
    
        // console.log('response ->', response);
    
        that._onExchangeDataReceived(exchange, response);
        that._onAnyExchangeResponseReceived(exchange);
    
        /*     this._datafeed._send(this._datafeed._datafeedURL + "/symbol_info", {
                group: exchange
            })
                .done(function (exchange) {
    
                return function (response) {
                    that._onExchangeDataReceived(exchange, JSON.parse(response));
                    that._onAnyExchangeResponseReceived(exchange);
                };
                }(exchange)) //jshint ignore:line
                .fail(function (exchange) {
                return function (reason) {
                    that._onAnyExchangeResponseReceived(exchange);
                };
                }(exchange)); //jshint ignore:line
        */
        }
    }
  
  onExchangeDataReceived = function (exchangeName: string, data: any) {
    let tableField = (data: any, name: string, index: number) => {
      return data[name] instanceof Array ?
        data[name][index] :
        data[name];
    }
  
    try {
      for (var symbolIndex = 0; symbolIndex < data.symbol.length; ++symbolIndex) {
        const symbolName = data.symbol[symbolIndex];
        const listedExchange = tableField(data, 'exchange-listed', symbolIndex);
        const tradedExchange = tableField(data, 'exchange-traded', symbolIndex);
        const fullName = `${tradedExchange}:${symbolName}`;
  
        //	This feature support is not implemented yet
        //	var hasDWM = tableField(data, "has-dwm", symbolIndex);
  
        const hasIntraday = tableField(data, 'has-intraday', symbolIndex);
  
        const tickerPresent = typeof data.ticker !== 'undefined';
  
        const symbolInfo = {
          name: symbolName,
          base_name: [`${listedExchange}:${symbolName}`],
          description: tableField(data, 'description', symbolIndex),
          full_name: fullName,
          legs: [fullName],
          has_intraday: hasIntraday,
          has_no_volume: tableField(data, 'has-no-volume', symbolIndex),
          listed_exchange: listedExchange,
          exchange: tradedExchange,
          minmov: tableField(data, 'minmovement', symbolIndex) || tableField(data, 'minmov', symbolIndex),
          minmove2: tableField(data, 'minmove2', symbolIndex) || tableField(data, 'minmov2', symbolIndex),
          fractional: tableField(data, 'fractional', symbolIndex),
          pointvalue: tableField(data, 'pointvalue', symbolIndex),
          pricescale: tableField(data, 'pricescale', symbolIndex),
          type: tableField(data, 'type', symbolIndex),
          session: tableField(data, 'session-regular', symbolIndex),
          ticker: tickerPresent ? tableField(data, 'ticker', symbolIndex) : symbolName,
          timezone: tableField(data, 'timezone', symbolIndex),
          supported_resolutions: tableField(data, 'supported-resolutions', symbolIndex) || this._datafeed.defaultConfiguration().supported_resolutions,
          force_session_rebuild: tableField(data, 'force-session-rebuild', symbolIndex) || false,
          has_daily: tableField(data, 'has-daily', symbolIndex) || true,
          intraday_multipliers: tableField(data, 'intraday-multipliers', symbolIndex) || ['1', '5', '15', '30', '60'],
          has_fractional_volume: tableField(data, 'has-fractional-volume', symbolIndex) || false,
          has_weekly_and_monthly: tableField(data, 'has-weekly-and-monthly', symbolIndex) || false,
          has_empty_bars: tableField(data, 'has-empty-bars', symbolIndex) || false,
          volume_precision: tableField(data, 'volume-precision', symbolIndex) || 0,
        };

        this._symbolsInfo[symbolInfo.ticker] = this._symbolsInfo[symbolName] = this._symbolsInfo[fullName] = symbolInfo;
        this._symbolsList.push(symbolName);
      }
    } catch (error) {
      throw `API error when processing exchange \`${exchangeName}\` symbol #${symbolIndex}: ${error}`;
    }
  }
  
  
    onAnyExchangeResponseReceived(exchangeName: string) {
        delete (this.exchangesWaitingForData as any)[exchangeName];
        const allDataReady = Object.keys(this.exchangesWaitingForData).length === 0;
    
        if (allDataReady) {
            this.symbolsList.sort();
            this.datafeed.logMessage('All exchanges data ready');
            this.datafeed.onInitialized();
        }
    }
  
    resolveSymbol(symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) {

        if (!this.symbolsInfo.hasOwnProperty(symbolName)) {
            onResolveErrorCallback('invalid symbol');
        } 
        else {
            onSymbolResolvedCallback((this.symbolsInfo as any)[symbolName]);
        }
    }
  
  
}

class SymbolSearchComponent{

    datafeed: any;

    constructor(datafeed: any) {
        this.datafeed = datafeed;
    }
  
    searchSymbolsByName(searchArgument: any, maxSearchResults: any) {
        searchArgument.onResultReadyCallback([]);
    }
}

class DataPulseUpdater {

    subscribers: any = {};
    datafeed: any;
    requestsPending: number = 0;

    constructor(datafeed: any, updateFrequency: number) {

        this.datafeed = datafeed;

        let update = () => {

            if (this.requestsPending > 0) {
              return;
            }

            for (var listenerGUID in this.subscribers) {

                const subscriptionRecord = (this.subscribers as any)[listenerGUID];
                
                var resolution = subscriptionRecord.resolution;

                var datesRangeRight = Number((new Date().valueOf()) / 1000);
            
                //	BEWARE: please note we really need 2 bars, not the only last one
                //	see the explanation below. `10` is the `large enough` value to work around holidays
                var datesRangeLeft = datesRangeRight - this.periodLengthSeconds(resolution, 10);
                this.requestsPending++;
            
                let that = this;
    
                (function(_subscriptionRecord) {
                    that.datafeed.getBars(_subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, (bars: any) => {
                        that.requestsPending--;
                        //	means the subscription was cancelled while waiting for data
                        if (!that.subscribers.hasOwnProperty(listenerGUID)) {
                            return;
                        }

                        if (bars.length === 0) {
                            return;
                        }
                
                        const lastBar = bars[bars.length - 1];
                        if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                            return;
                        }
                
                        const subscribers = _subscriptionRecord.listeners;
                        //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
                        //	_subscriptionRecord.lastBarTime = NaN
                        const isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;
                
                        //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
                        //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
                        if (isNewBar) {
                            if (bars.length < 2) {
                            throw 'Not enough bars in history for proper pulse update. Need at least 2.';
                            }
                
                            const previousBar = bars[bars.length - 2];
                            for (var i = 0; i < subscribers.length; ++i) {
                            subscribers[i](previousBar);
                            }
                        }
                        _subscriptionRecord.lastBarTime = lastBar.time;
                
                        for (var i = 0; i < subscribers.length; ++i) {
                            subscribers[i](lastBar);
                        }
                    },
                    () => {
                        that.requestsPending--;
                    });
                }(subscriptionRecord));
            }
        };
        
        if (typeof updateFrequency !== 'undefined' && updateFrequency > 0) {
            setInterval(update, 1000);
        }
        
    }

    unsubscribeDataListener(listenerGUID: any) {
        this.datafeed.logMessage(`Unsubscribing ${listenerGUID}`);
        delete this.subscribers[listenerGUID];
    }
      

    subscribeDataListener(symbolInfo: any, resolution: any, newDataCallback: any, listenerGUID: any) {
        
        this.datafeed.logMessage(`Subscribing ${listenerGUID}`);
  
        const key = `${symbolInfo.name}, ${resolution}`;
  
        if (!this.subscribers.hasOwnProperty(listenerGUID)) {
            this.subscribers[listenerGUID] = {
                symbolInfo,
                resolution,
                lastBarTime: NaN,
                listeners: [],
            };
        }
    
        this.subscribers[listenerGUID].listeners.push(newDataCallback);
    }
  
    periodLengthSeconds(resolution: any, requiredPeriodsCount: any = 1) {
        let daysCount = 0;
      
        if (resolution == 'D') {
            daysCount = requiredPeriodsCount;
        } 
        else if (resolution == 'M') {
            daysCount = 31 * requiredPeriodsCount;
        } 
        else if (resolution == 'W') {
            daysCount = 7 * requiredPeriodsCount;
        } 
        else {
            daysCount = requiredPeriodsCount * resolution / (24 * 60);
        }
      
        return daysCount * 24 * 60 * 60;
    }
    
      

}

class QuotesPulseUpdater {

    datafeed: any;
    subscribers: any = {};
    updateInterval = 60 * 1000;
    fastUpdateInterval = 10 * 1000;
    requestsPending = 0;

    constructor(datafeed: any) {

        this.datafeed = datafeed;

        setInterval(() => {
            this.updateQuotes((subscriptionRecord: any) => { return subscriptionRecord.symbols; });
        }, this.updateInterval);
    
        setInterval(() => {
            this.updateQuotes((subscriptionRecord: any) => { return subscriptionRecord.fastSymbols.length > 0 ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols; });
        }, this.fastUpdateInterval);
    }

    subscribeDataListener(symbols: any, fastSymbols: any, newDataCallback: any, listenerGUID: any) {
        if (!this.subscribers.hasOwnProperty(listenerGUID)) {
            this.subscribers[listenerGUID] = {
                symbols,
                fastSymbols,
                listeners: [],
            };
        }
        this.subscribers[listenerGUID].listeners.push(newDataCallback);
    };
      
    unsubscribeDataListener(listenerGUID: any) {
        delete this.subscribers[listenerGUID];
    };
      
    updateQuotes(symbolsGetter: any) {
        if (this.requestsPending > 0) {
            return;
        }
      
        const that = this;
        for (const listenerGUID in this.subscribers) {
            this.requestsPending++;
      
            const subscriptionRecord = this.subscribers[listenerGUID];
            this.datafeed.getQuotes(symbolsGetter(subscriptionRecord),
            // onDataCallback
            (function(subscribers, guid) {

                return (data: any) => {

                    that.requestsPending--;
      
                    // means the subscription was cancelled while waiting for data
                    if (!that.subscribers.hasOwnProperty(guid)) {
                        return;
                    }
        
                    for (let i = 0; i < subscribers.length; ++i) {
                        subscribers[i](data);
                    }
                }
            }(subscriptionRecord.listeners, listenerGUID)), // jshint ignore:line
            // onErrorCallback
            (error: any) => {
                this.requestsPending--;
            }); // jshint ignore:line
        }
    }
      
}
  
  