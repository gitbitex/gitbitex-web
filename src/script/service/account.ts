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

import { Service } from './service';

export class AccountService extends Service {

    signup(account: any) {
        return this.request.post('/users', account);
    }

    signin(email: string, password: string) {
        return this.request.post('/users/accessToken', {
            email: email,
            password: password
        });
    }

    signOut() {
        return this.request.delete('/users/accessToken');
    }

    current() {
        return this.request.get('/users/self', { headers : {'HideAuthError': true} });
    }

    saveToken(token: string) {
        (window as any).localStorage.setItem('access-token', token);
    }

    clearToken() {
        (window as any).localStorage.removeItem('access-token');
    }

    getToken() {
        return (window as any).localStorage.getItem('access-token');
    }

    getFunds(currencies: string[]) {
        let query = currencies.map((cur: string) => {
            return `currency=${cur}`
        });
        return this.request.get(`/accounts?${query.join('&')}`);
    }

    getDepositAddress(currency: string) {
        return this.request.get(`/wallets/${currency}/address`);
    }

    postWithdrawal(currency: string, transfer: any) {
        return this.request.post(`/wallets/${currency}/withdrawal`, {
            amount: transfer.amount,
            cryptoAddress: transfer.address
        });
    }

    getTransactions(currency: string) {
        return this.request.get(`/wallets/${currency}/transactions`);
    }

    changePassword(oldPassword: string, newPassword: string) {
        return this.request.post(`/users/password`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }

    sendEmailVerifyCode(email: string) {
        return this.request.post(`/verifyCodes/restPassword`, {
            email: email
        });
    }

    resetPassword(pwd: any) {
        return this.request.post(`/users/password/reset`, pwd);
    }

    getFileUrl() {
        return this.request.get(`/files/url`);
    
    }

    saveNickname(nickname: string) {
        return this.request.post('/users/name', {name: nickname});
    }

    saveAvatar(avatar: string) {
        return this.request.post('/users/profilePhoto', {profilePhotoUrl: avatar});
    }

}