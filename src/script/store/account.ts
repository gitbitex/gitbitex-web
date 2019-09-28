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

import { TradeStore } from './trade';
import { WebSocketService } from './../service/websocket';
import { Store } from './store';
import { HttpService } from './../service/http';

export class AccountStore extends Store {

    get storeOptions(): {} {

        return  {

            state: {
                userInfo: {},
            },
        
            mutations: {
                setUserInfo: (state: any, info: any[]) => {
                    state.userInfo = info;
                }
            }

        }
    
    }

    get userInfo() : {nickname: string, userId: number, avatar: string} {
        return this.store.state.userInfo;
    }

    get logined() : boolean {
        return Boolean(this.store.state.userInfo.userId);
    }

    get token() : string {
        return HttpService.Account.getToken();
    }

    current(callback: () => void) {
        HttpService.Account.current().then((response: any) => {
            this.store.commit('setUserInfo', {
                nickname: response.name,
                userId: response.id,
                avatar: response.profilePhoto
            });
            WebSocketService.Instance.token = this.token;
            callback && callback();
        }).catch(() => {
            callback && callback();
        });
    }

    signOut() {
        HttpService.Account.signOut().then(() => {});
        HttpService.Account.clearToken();
        TradeStore.instance().clearUserTrades();
        this.store.commit('setUserInfo', {
            nickname: '',
            userId: 0
        });
    }

    saveAvatar(url: string) {
        return HttpService.Account.saveAvatar(url).then((response: any) => {
            this.store.commit('setUserInfo', Object.assign(Object.assign({}, this.userInfo), {
                avatar: url
            }));
            return response;
        });
    }

    saveNickname(nickname: string) {
        return HttpService.Account.saveNickname(nickname).then((response: any) => {
            this.store.commit('setUserInfo', Object.assign(Object.assign({}, this.userInfo), {
                nickname: nickname
            }));
            return response;
        });
    }

}