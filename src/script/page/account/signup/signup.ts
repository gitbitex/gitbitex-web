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

@Route('/account/signup', require('./signup.jade')())
export class AccountSignupPage extends Page {

    account: {
        email: string,
        password: string
    } = {
        email: '',
        password: ''
    };

    error: string = '';
    checkArg: number = 0;

    mounted() {
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Gitbiex | Digital Asset Exchange');
        setTimeout(() => {
            (this.$refs.inputEmail as HTMLInputElement).disabled = false;
            (this.$refs.inputPassword as HTMLInputElement).disabled = false;
        }, 400)

    }

    submit() {

        if (!this.checkArg) {
            this.error = 'Please accept the user agreement';
            return;
        }

        HttpService.Account.signup(this.account).then(() => {
            this.$router.push(`/account/signin`);
        }).catch((res: any) => {
            this.error = res.message;
        });


    }

}