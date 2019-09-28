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

import { DomWatch } from './watch';
import { StoreService } from './store/service';
import { WebSocketService } from './service/websocket';
import { Constant } from './constant';

export class App {

    static socketServer: string;
    private static loaded: number = 0;

    static init(callback: () => void) {
  
        StoreService.Account.current(() => {
            this.loadData(callback);
        });

        document.addEventListener("visibilitychange", () => {
            DomWatch.visibleChanged();
        });
        window.onresize = () => {
            DomWatch.visibleChanged();
        }
        
    }

    private static loadData(callback: () => void) {

        StoreService.Trade.loadProducts(() => {
            WebSocketService.Instance.connect(Constant.SOCKET_SERVER, () => {
                StoreService.Trade.subscribeAllTicker();
                callback && callback();
            }, (msg: any) => {
                StoreService.Trade.parseWebSocketMessage(msg);
            });
        });

    }


    static getQuery(name: string) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
            matchs= window.location.search.substr(1).match(reg);
        return  matchs ? decodeURIComponent(matchs[2]) : null;
    }

    static loading(show: boolean) {

        let dom = document.getElementById('GlobalPageLoading');
        dom.style.display = show ? 'flex' : 'none';

    }

}