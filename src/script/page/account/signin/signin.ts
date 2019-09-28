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

import { StoreService } from './../../../store/service';
import { Helper } from './../../../helper';
import { App } from './../../../app';
import { HttpService } from './../../../service/http';
import { Page, Route } from "../../page";

@Route('/account/signin', require('./signin.jade')())
export class AccountSigninPage extends Page {

    account: {
        email: string,
        password: string
    } = {
        email: '',
        password: ''
    };

    error: string = '';
    alert: string = '';

    mounted() {
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Gitbiex | Digital Asset Exchange');
        setTimeout(() => {
            (this.$refs.inputEmail as HTMLInputElement).disabled = false;
            (this.$refs.inputPassword as HTMLInputElement).disabled = false;
        }, 400)

        if (this.$route.query.alert) {
            if (this.$route.query.alert=='forgot') {
                this.alert = 'Your password has been reset! You can now continue below.';
            }
        }

    }

    submit() {

        HttpService.Account.signin(this.account.email, this.account.password).then((response: any) => {
            HttpService.Account.saveToken(response);
            StoreService.Account.current(() => {
                if (this.$route.query.ref) {
                    this.$router.push(this.$route.query.ref);
                }
                else {
                    this.$router.push(`/account/profile`);
                }
            })
        }).catch((res: any) => {
            this.error = res.message;
        });

    }

}