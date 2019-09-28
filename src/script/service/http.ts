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

import { FileService } from './file';
import { ServerService } from './server';
import { OrderService } from './order';
import { TradeService } from './trade';
import { AccountService } from './account';

export class HttpService {

    private static _account: AccountService;
    private static _trade: TradeService;
    private static _order: OrderService;
    private static _server: ServerService;
    private static _file: FileService;

    static get Account() {
        this._account || (this._account = new AccountService());
        return this._account;
    }

    static get Trade() {
        this._trade || (this._trade = new TradeService());
        return this._trade;
    }

    static get Order() {
        this._order || (this._order = new OrderService());
        return this._order;
    }

    static get Server() {
        this._server || (this._server = new ServerService());
        return this._server;
    }

    static get File() {
        this._file || (this._file = new FileService());
        return this._file;
    }

}