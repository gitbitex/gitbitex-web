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

import { HttpService } from './../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('form-withdrawal', require('./withdrawal.jade')())
export class WithdrawalFormComponent extends Component {

    @Prop()
    currency: string;

    transfer: {
        amount: number,
        address: string
    } = {
        amount: undefined,
        address: ''
    };

    error: string = '';
    loading: boolean = false;

    @Emit()
    success() {}

    mounted() {
        super.mounted();
    }

    submit() {

        if (!this.transfer.address) {
            this.error = `The ${this.currency} address is required`;
            return;
        }

        if (Number(this.transfer.amount <= 0)) {
            this.error = `Please enter amount more than 0`;
            return;
        }

        this.error = '';
        this.loading = true;
        
        HttpService.Account.postWithdrawal(this.currency, this.transfer).then(() => {
            this.success();
        }).catch((error) => {
            this.error = error.response.data.message;
            this.loading = false;
        });

    }

}