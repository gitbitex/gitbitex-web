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
import { Page, Route } from "../../page";

@Route('/account/forgot', require('./forgot.jade')())
export class AccountForgotPage extends Page {

    account: any = {};
    error: string = '';
    codeIsSend: boolean = false;

    mounted() {
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Gitbiex | Digital Asset Exchange');
    }

    submit() {

        if (this.codeIsSend) {

            if (!this.account.newPassword) {
                this.error = "Password is required";
                return;
            }

            HttpService.Account.resetPassword(this.account).then(() => {
                this.$router.replace('signin?alert=forgot');
            }).catch((error: any) => {
                this.error = error.response.data.message;
            });

        }
        else {

            let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");

            if (!reg.test(this.account.email)) {
                this.error = "Email doesn't look correct";
                return;
            }
    
            HttpService.Account.sendEmailVerifyCode(this.account.email).then(() => {
                this.codeIsSend = true;
            }).catch((error: any) => {
                this.error = error.response.data.message;
            });

        }

    }

}