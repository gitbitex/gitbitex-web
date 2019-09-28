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

import { Moment } from './../../../vendor';
import { HttpService } from './../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('panel-transaction', require('./transaction.jade')())
export class TransactionPanelComponent extends Component {

    @Prop()
    currency: string;

    transactions: any[] = [];

    mounted() {
        super.mounted();
    }

    @Watch('currency')
    onCurrencyChange() {

        HttpService.Account.getTransactions(this.currency).then((response: any) => {
            this.transactions = response;
            this.transactions.forEach((tran: any) => {
                tran.amountSymbol = tran.type == 'send' ? '−' : '+';
                tran.createdAt = Moment(tran.createdAt);
            });
        });
    }

    @Emit('detail')
    detail(transaction: any) {}

}