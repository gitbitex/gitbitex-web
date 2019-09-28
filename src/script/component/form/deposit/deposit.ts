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

@Dom('form-deposit', require('./deposit.jade')())
export class DepositFormComponent extends Component {

    @Prop()
    currency: string;

    address: string = '';
    qrcode: any;

    mounted() {
       
        super.mounted();
        this.onCurrencyChange();
        this.qrcode = new (window as any).QRCode(this.$refs.qrcode);
    }

    @Watch('currency')
    onCurrencyChange() {
        HttpService.Account.getDepositAddress(this.currency).then((response: any) => {
            this.address = response.address;
            this.qrcode && this.qrcode.clear();
            this.qrcode.makeCode({
                text: this.address,
                width: 400,
                height: 400,
                colorDark : "#000000",
                colorLight : "#ffffff"
            });
        });
    }


}