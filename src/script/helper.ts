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

import { Collect } from './vendor';

export class Helper {

    static usNameWithObject(object: any, encode: boolean=false) {

        if (Array.isArray(object)) {
            
            object.forEach((item, index) => {
                object[index] = this.usNameWithObject(item, encode)
            })
    
        }
        else if (typeof object == 'object' && !Array.isArray(object)) {
            
            object = Object.assign({}, object)

            for(let key in object) {
    
                if (typeof object[key] == 'object') {
                    object[key] = this.usNameWithObject(object[key], encode)
                }
    
                let newKey = encode ? key.replace(/([A-Z])/g, "_$1").toLowerCase() : key.replace(/_(\w)/g, ($0, $1) => {
                    return $1.toUpperCase();
                })
    
                if (newKey != key) {
                    object[newKey] = object[key];
                    delete object[key];
                }
            }
    
        }
    
        return object;
    
    }

    static map = function (object: any, handle: (item: any, key?: any) => any) {
        let array = [];
        if (typeof handle === "function") {
            for (let key in object) {      
                array.push(handle(object[key], key));
            }
        }
        return array;
    }

    static Array_in = (search: any, array: any[]) => {
        for(var i in array){
            if(array[i]==search){
                return true;
            }
        }
        return false;
    }

    static Object_values(obj: any) {

        return Object.keys(obj).map((key) => {
            return obj[key]
        });

    }

    static Cookie_set(name: string, value: string, expire: number = 0) {
        let exp = new Date(); 
        exp.setTime(exp.getTime() + (expire ? expire : exp.getTime())); 
        document.cookie = `${name}=${value};expires=${exp.toUTCString()}`
    }

    static Trade_margeOrderBook(orderBook: any, scale: number, count: number=0) {

        let bids: any = {},
            asks: any = {},
            lastBidPrice: number =  0,
            lastAskPrice: number =  0;
            
        orderBook.bids.forEach((bid: any) => {
            let price = this.Trade_scalePrice(bid[0], scale);
            bids[price] || (bids[price] = [Number(price), 0]);
            bids[price][1] += Number(bid[1]);
            
            lastBidPrice == 0 && (lastBidPrice = Number(price));
        });
        
        orderBook.asks.forEach((ask: any) => {
            let price = this.Trade_scalePrice(ask[0], scale);
            asks[price] || (asks[price] = [Number(price), 0]);
            asks[price][1] += Number(ask[1]);
        });
        
        asks = this.Object_values(asks);
        bids = this.Object_values(bids);
    
        if (count && bids.length > 0 && asks.length > 0) {

            lastBidPrice = Collect(bids).first()[0];
            for(let i=0; bids.length<count; i++) {
                
                bids.push([this.Trade_scalePrice(lastBidPrice - (i+1)*scale, scale), 0]);
            }
    
            lastAskPrice = Collect(asks).last()[0];
            for(let i=0; asks.length<count; i++) {
                asks.push([this.Trade_scalePrice(lastAskPrice + (i+1)*scale, scale), 0]);
            }

        }

        return {asks: asks, bids: bids};

    }
    static Trade_scalePrice(price: number, scale:  number) {
        price = Number(Math.round(price/scale)*scale);
        return scale>=1 ? String(price) : price.toFixed(this.Number_toString(scale).length-2);
    }

    static Number_toString(number: number) : string {
        if (/\-/.test(String(number))) 
            return number.toFixed(Number(String(number).split("-")[1]));
        else return String(number);
    }

}